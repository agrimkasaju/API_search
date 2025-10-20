import React from 'react';
import ReactDOM from 'react-dom/client'; // ✅ Import ReactDOM correctly
import { BrowserRouter } from 'react-router-dom';
import App from './app_nav.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
