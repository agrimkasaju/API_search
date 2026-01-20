import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";
import qs from "qs";

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173" // frontend origin
}));

// --- Token Management ---
let cachedToken: string | null = null;
let tokenExpirationTime: number = 0; // Timestamp in milliseconds

async function getEbayAccessToken() {
  const now = Date.now();

  // Return cached token if it's still valid (with a 2-minute buffer)
  if (cachedToken && now < tokenExpirationTime - 120000) {
    return cachedToken;
  }

  console.log("Fetching new eBay Access Token...");

  try {
    // Basic Auth is base64(CLIENT_ID:CLIENT_SECRET)
    const authHeader = Buffer.from(
      `${process.env.EBAY_APP_ID}:${process.env.EBAY_CERT_ID}`
    ).toString("base64");

    const response = await axios.post(
      "https://api.ebay.com/identity/v1/oauth2/token",
      qs.stringify({
        grant_type: "client_credentials",
        scope: "https://api.ebay.com/oauth/api_scope" // Basic scope for search
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${authHeader}`,
        },
      }
    );

    const { access_token, expires_in } = response.data;
    
    cachedToken = access_token;
    // expires_in is usually 7200 seconds (2 hours). Convert to ms and add to current time.
    tokenExpirationTime = now + (expires_in * 1000);

    return cachedToken;
  } catch (error: any) {
    console.error("Failed to refresh eBay token:", error.response?.data || error.message);
    throw new Error("Could not authenticate with eBay");
  }
}
// ------------------------
app.get("/api/search", async (req, res) => {
  const query = (req.query.q as string) || "keyboard"; // default search/ASIN
  const limit = Number(req.query.limit) || 3;

  try {
    // 1. Get a valid token (either cached or fresh)
    const accessToken = await getEbayAccessToken();

    // 2. eBay API request using the dynamic token
    const ebayPromise = axios.get(
      "https://api.ebay.com/buy/browse/v1/item_summary/search",
      {
        params: { q: query, limit, offset: 0 },
        headers: {
          Authorization: `Bearer ${accessToken}`, // Use the variable, not the hardcoded string
          "X-EBAY-C-MARKETPLACE-ID": "EBAY_US",
        },
      }
    );

    // -----------------------------
    // Amazon API request (RapidAPI)
    // -----------------------------
    // const amazonPromise: any = axios.get(
    //   "https://real-time-amazon-data.p.rapidapi.com/search",
    //   {
    //     params: {
    //       query,
    //       page: "1",
    //       country: "US",
    //       sort_by: "RELEVANCE",
    //       product_condition: "ALL",
    //       is_prime: "false",
    //       deals_and_discounts: "NONE"
    //     },
    //     headers: {
    //       "x-rapidapi-key": process.env.RAPIDAPI_KEY,
    //       "x-rapidapi-host": "real-time-amazon-data.p.rapidapi.com",
    //     },
    //   }
    // );

    // const aliexpressPromise: any = axios.get(
    //   "https://aliexpress-datahub.p.rapidapi.com/item_search_2",
    //   {
    //     params: {
    //       q: query,https://www.overleaf.com/project/6834a2cfce7d372299716458
    //       page: "1",
    //       sort: "default"
    //     },
    //     headers: {
    //       "x-rapidapi-key": process.env.RAPIDAPI_KEY,
    //       "x-rapidapi-host": "aliexpress-datahub.p.rapidapi.com"
    //     },
    //   }
    // );

    // Wait for both requests to complete
    // const [ebayRes, aliRes] = await Promise.all([ebayPromise, aliexpressPromise]);
    const [ebayRes] = await Promise.all([ebayPromise]);

    // Normalize eBay
    const ebayResults = ebayRes.data.itemSummaries?.map((item: any) => ({
      id: item.itemId,
      title: item.title,
      price: item.price?.value,
      url: item.itemWebUrl,
      source: 'ebay',
      image: item.image?.imageUrl,
    })) || [];

    // Normalize Amazon + apply limit manually
    // const amazonResults = amazonRes.data?.data?.products
    //   ? amazonRes.data.data.products.slice(0, limit).map((item: any) => ({
    //     id: item.asin,
    //     title: item.product_title,
    //     price: item.product_price,
    //     url: item.product_url,
    //     source: 'amazon',
    //   }))
    //   : [];

    // Normalize AliExpress + apply limit
    // const aliExpressResults = aliRes.data?.result?.resultList
    //   ? aliRes.data.result.resultList.slice(0, limit).map((entry: any) => {
    //     const item = entry.item;
    //     return {
    //       id: item.itemId,
    //       title: item.title,
    //       price: item.sku?.def?.promotionPrice || null,
    //       url: item.itemUrl?.startsWith("//")
    //         ? `https:${item.itemUrl}`
    //         : item.itemUrl,
    //       source: "aliexpress",
    //       image: item.image?.startsWith("//")
    //         ? `https:${item.image}`
    //         : item.image,
    //     };
    //   })
    //   : [];


    // Combine into a single list
    // const combinedResults = [...ebayResults, ...aliExpressResults];
    const combinedResults = [...ebayResults];

    // sort by price ascending
    combinedResults.sort((a, b) => a.price - b.price);
    res.json(combinedResults);
  } catch (err: any) {
    console.error("API Error:", err.response?.data || err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});