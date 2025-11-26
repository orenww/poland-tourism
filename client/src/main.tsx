import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./i18n"; // Import i18n config
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.js";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
