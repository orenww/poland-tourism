import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { items } from "../data/item";
import Tabs from "../components/Tabs";
import Breadcrumbs from "../components/Breadcrumbs";

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
  const [activeTab, setActiveTab] = useState("Overview");
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const item = items.find((item) => item.id === id);
  // TODO: When adding English support, use getLocalizedContent(item.name, language)
  // TODO: When adding English support, use getLocalizedContent(item.description, language)
  // TODO: When adding English support, use getLocalizedContent(item.longDescription, language)
  // TODO: When adding English support, use getLocalizedContent(item.content[activeTab], language)

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

  // Different tabs based on category - English keys
  const getTabsForCategory = (category: string) => {
    switch (category) {
      case "Locations":
        return [
          "Overview",
          "Restaurants",
          "Hotels",
          "Attractions",
          "Practical_Info",
        ];
      case "Attractions":
        return ["Overview", "Hours_Prices", "How_To_Get_There", "Tips"];
      case "Routes":
        return ["Itinerary", "Map", "Budget", "Tips"];
      default:
        return ["Overview"];
    }
  };

  const tabs = getTabsForCategory(item.category);
  return (
    <div
      className="bg-gray-50 min-h-screen"
      dir={i18n.language === "he" ? "rtl" : "ltr"}
    >
      <div className="container mx-auto px-4 py-6">
        <Breadcrumbs category={item.category} itemName={item.name} />

        {/* <button
          onClick={() => navigate("/")}
          className="mb-4 flex items-center text-blue-600 hover:text-blue-800 font-semibold"
        >
          <span className={i18n.language === "he" ? "ml-2" : "mr-2"}>
            {i18n.language === "he" ? "→" : "←"}
          </span>
          {t("detail.backToHome")}
        </button> */}

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
