import { useParams, useNavigate, useLocation } from "react-router-dom";
import ProductGrid from "./ProductGrid";
import "./Home.css";

const categories = [
  { name: "Keyboards", query: "keyboard" },
  { name: "Mice", query: "mouse" },
  { name: "Headphones", query: "headphones" },
  { name: "Monitors", query: "monitor" },
  { name: "Laptops", query: "laptop" },
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { category } = useParams<{ category?: string }>();

  const handleCategoryClick = (query: string) => {
    navigate(`/category/${query}`);
  };

  // Detect if we are on home page
  const isHome = location.pathname === "/";

  return (
    <div className="home-container">
      <aside className="sidebar">
        <h3>Categories</h3>
        <ul className="category-list">
          {categories.map((cat) => (
            <li
              key={cat.query}
              className={category === cat.query ? "active" : ""}
              onClick={() => handleCategoryClick(cat.query)}
            >
              {cat.name}
            </li>
          ))}
        </ul>
      </aside>

      <main className="content-area">
        {!isHome && category ? (
          <ProductGrid query={category} />
        ) : (
          <p className="placeholder-text">
            Select a category to view products
          </p>
        )}
      </main>
    </div>
  );
};

export default Home;
