import { useEffect, useState } from "react";
import "./ProductGrid.css";

interface Product {
  id: string;
  title: string;
  price?: string;
  url: string;
  source: string;
  image?: string;
}

interface Props {
  query: string;
}

const ProductGrid: React.FC<Props> = ({ query }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3000/api/search?q=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [query]);

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <div className="product-grid">
      {products.map((p) => (
        <a
          key={p.id}
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          className="product-card"
        >
          <img
            src={p.image || "/placeholder.jpg"}
            alt={p.title}
            className="product-image"
          />
          <div className="product-info">
            <h4 className="product-title">{p.title}</h4>
            <p className="product-price">{p.price || "—"}</p>
            <span className="product-source">{p.source}</span>
          </div>
        </a>
      ))}
    </div>
  );
};

export default ProductGrid;
