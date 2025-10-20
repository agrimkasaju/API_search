# 🛍️ API Search

**API Search** is a full-stack web application that allows users to search and compare products from multiple e-commerce platforms, such as **AliExpress** and **eBay**.
Users can browse by category or keyword, view prices, product images, and relevant information — all in a single interface.

---

## 🚀 Features

* 🔎 **Multi-platform search** (AliExpress, eBay, and more)
* 💰 **Price comparison** between stores
* 🖼️ **Image display** for each result
* ⚡ **Fast search API integration**
* 📱 **Responsive frontend built with React + TypeScript**
* 🔧 **Backend built with Node.js + Express**

---

## 🧩 Tech Stack

| Layer           | Technology                                |
| --------------- | ----------------------------------------- |
| Frontend        | React, TypeScript, Vite                   |
| Backend         | Node.js, Express                          |
| APIs            | AliExpress Affiliate API, eBay Browse API |
| Styling         | TailwindCSS / CSS Modules                 |
| Version Control | Git + GitHub                              |

---

## ⚙️ Setup

### 1. Clone the Repository

```bash
git clone https://github.com/agrimkasaju/api-search.git
cd api-search
```

### 2. Install Dependencies

```bash
# For backend
cd backend
npm install

# For frontend
cd ../frontend
npm install
```

### 3. Set Environment Variables

Create a `.env` file in the backend directory and add:

```
ALIEXPRESS_APP_KEY=your_app_key
ALIEXPRESS_APP_SECRET=your_app_secret
ALIEXPRESS_ACCESS_TOKEN=your_access_token
EBAY_APP_ID=your_ebay_app_id
PORT=5000
```

### 4. Run the Application

```bash
# Start backend
cd backend
npm run dev

# Start frontend (in another terminal)
cd ../frontend
npm run dev
```

Visit: **[http://localhost:5173](http://localhost:5173)** (or your configured frontend port)

---

## 🧠 How It Works

1. The **frontend** sends a search request (e.g. `keyboard`, `headphones`) to the backend.
2. The **backend** queries both **AliExpress** and **eBay APIs**.
3. Results are **merged and formatted**.
4. The **frontend** displays products with names, prices, and images.

---

## 📦 Project Structure

```
api-search/
├── backend/
│   ├── index.ts        # Main server logic
│   ├── routes/
│   │   ├── search.ts   # Handles product search
│   ├── utils/
│   │   ├── apiHelpers.ts
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── About.tsx
│   │   │   └── Contact.tsx
│   │   ├── components/
│   │   │   ├── SearchBar.tsx
│   │   │   └── ProductCard.tsx
│   └── package.json
│
└── README.md
```

---

## 📚 API References

* **AliExpress Affiliate API:** [Developers Portal](https://openservice.aliexpress.com)
* **eBay Browse API:** [eBay Developer Docs](https://developer.ebay.com/signin?return_to=%2Fmy%2Fapi_test_tool%3Findex%3D0%26env%3Dproduction)

---

## 💡 Future Improvements

* Add Amazon API integration
* User authentication
* Saved searches and favorites
* Caching for faster results

---

## 👨‍💻 Author

**Agrim Kasaju**
Third-Year Computer Systems Engineering @ Carleton University
[GitHub](https://github.com/agrimkasaju) • [LinkedIn](https://linkedin.com/in/agrimkasaju)

---
