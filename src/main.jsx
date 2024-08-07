import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { MarketplaceProvider } from "./components/utils/MarketplaceProvider"; // Asegúrate de importar correctamente
import "bootstrap/dist/css/bootstrap.min.css";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <MarketplaceProvider>
        <App />
      </MarketplaceProvider>
    </BrowserRouter>
  </React.StrictMode>
);