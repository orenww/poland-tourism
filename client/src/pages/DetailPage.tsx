import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { items } from "../data/item";
import Tabs from "../components/Tabs";
import Breadcrumbs from "../components/Breadcrumbs";
import { getContentFieldsForCategory } from "../utils/categoryUtils";

interface ItemData {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  image: string;
  category: "Locations" | "Attractions" | "Routes";
}

function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const item = items.find((item) => item.id === id);

  // Get base tabs for category
  const baseTabs = item
    ? getContentFieldsForCategory(item.category)
    : ["Overview"];

  // Add "Discounts" tab if item has discount content
  const tabs =
    item?.content.Discounts && item.content.Discounts.trim() !== ""
      ? [...baseTabs, "Discounts"]
      : baseTabs;

  const [activeTab, setActiveTab] = useState(tabs[0]);

  useEffect(() => {
    if (item) {
      document.title = `${item.name} | ${t("header.title")}`;
    }
  }, [item, t]);

  if (!item) {
    return (
      <div
        className="container mx-auto px-4 py-8"
        dir={i18n.language === "he" ? "rtl" : "ltr"}
      >
        <h1 className="text-3xl font-bold text-red-600">
          {t("detail.notFound")}
        </h1>
      </div>
    );
  }

  return (
    <div
      className="bg-gray-50 min-h-screen"
      dir={i18n.language === "he" ? "rtl" : "ltr"}
    >
      <div className="container mx-auto px-4 py-6">
        <Breadcrumbs category={item.category} itemName={item.name} />

        <h1 className="text-3xl font-bold text-gray-800 mb-3">{item.name}</h1>
        <p className="text-lg text-gray-600 mb-6">{item.description}</p>

        <div>
          <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-700 whitespace-pre-line">
              {item.content[activeTab] || "Content coming soon..."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailPage;
