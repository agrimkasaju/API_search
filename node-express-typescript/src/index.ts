import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173" // frontend origin
}));

app.get("/api/search", async (req, res) => {
  const query = (req.query.q as string) || "keyboard"; // default search/ASIN
  const limit = Number(req.query.limit) || 3;

  try {
    // -----------------------------
    // eBay API request
    // -----------------------------
    const ebayPromise = axios.get(
      "https://api.ebay.com/buy/browse/v1/item_summary/search",
      {
        params: { q: query, limit, offset: 0 },
        headers: {
          Authorization: process.env.EBAY_API_KEY,
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