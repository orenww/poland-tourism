import { Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import HomePage from "./pages/HomePage";
import Header from "./components/Header";
import DetailPage from "./pages/DetailPage";
import { useState } from "react";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const { i18n } = useTranslation();

  return (
    <div
      className="min-h-screen bg-gray-50"
      dir={i18n.language === "he" ? "rtl" : "ltr"}
    >
      <Header
        title="Poland Tourism"
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <Routes>
        <Route path="/" element={<HomePage searchQuery={searchQuery} />} />
        <Route path="/locations/:id" element={<DetailPage />} />
        <Route path="/attractions/:id" element={<DetailPage />} />
        <Route path="/routes/:id" element={<DetailPage />} />
      </Routes>
    </div>
  );
}

export default App;
