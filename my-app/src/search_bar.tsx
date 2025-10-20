import { useState, useEffect } from "react";
import "./MyComponent.css";

const MyComponent: React.FC = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (search.trim() === "") {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      setLoading(true);

      fetch(`http://localhost:3000/api/search?q=${encodeURIComponent(search)}`)
        .then(res => res.json())
        .then(data => {
          setResults(data);
          setLoading(false);
        })
        .catch(() => {
          setResults([]);
          setLoading(false);
        });
    }, 500); // wait 300ms after typing stops

    return () => clearTimeout(timeoutId); // cancel previous fetch if typing continues
  }, [search]);

  const listItems = results.map(item => (
    <li key={item.id}>
      {item.url ? (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="result-link"
        >
          <span className="result-title">{item.title || item.name}</span>
          {item.price !== undefined && (
            <span className="result-price">${item.price}</span>
          )}
          <span className="result-source">({item.source})</span>
        </a>
      ) : (
        <div>
          <span className="result-title">{item.title || item.name}</span>
          {item.price !== undefined && (
            <span className="result-price">${item.price}</span>
          )}
          <span className="result-source">({item.source})</span>
        </div>
      )}
    </li>
  ));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      <input
        id="myInput"
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search..."
        style={{ marginLeft: '10px' }}
      />
      {search.trim() !== "" && (
        loading ? (
          <div style={{ marginLeft: '10px' }}>Loading...</div>
        ) : (
          <ul id="myUL" className="results-list">
            {listItems}
          </ul>
        )
      )}
    </div>
  );
};

export default MyComponent;
