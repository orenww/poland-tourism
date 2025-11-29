import { Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import HomePage from "./pages/HomePage";
import Header from "./components/Header";
import DetailPage from "./pages/DetailPage";
import { useState } from "react";
import AdminPage from "./pages/admin/AdminPage";
import ItemForm from "./pages/admin/ItemForm";
import SubItemsManagement from "./pages/admin/SubItemsManagement";
import SubItemForm from "./pages/admin/SubItemForm";

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
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/item/new" element={<ItemForm />} />
        <Route path="/admin/item/edit/:id" element={<ItemForm />} />
        <Route
          path="/admin/item/:itemId/subitems/:sectionType"
          element={<SubItemsManagement />}
        />
        <Route
          path="/admin/item/:itemId/subitems/:sectionType/new"
          element={<SubItemForm />}
        />
        <Route
          path="/admin/item/:itemId/subitems/:sectionType/edit/:subItemId"
          element={<SubItemForm />}
        />
      </Routes>
    </div>
  );
}

export default App;
