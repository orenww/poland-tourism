import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Tabs from "../components/Tabs";
import ItemCard from "../components/ItemCard";
import { items } from "../data/item";

interface HomePageProps {
  searchQuery: string;
}

function HomePage({ searchQuery }: HomePageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  // Get unique categories dynamically from items
  const categories = [...new Set(items.map((item) => item.category))];
  // Add "Discounts" as special aggregated tab
  const tabs = [...categories, "Discounts"];

  const [activeTab, setActiveTab] = useState(tabs[0]);

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  useEffect(() => {
    document.title = `${t("home.title")} | ${t("header.title")}`;
  }, [t]);

  const filteredItems = items.filter((item) => {
    // If searching, search all items
    if (searchQuery) {
      return (
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // If "Discounts" tab is active, show items that have discounts
    if (activeTab === "Discounts") {
      return item.content.Discounts && item.content.Discounts.trim() !== "";
    }

    // Otherwise filter by category
    return item.category === activeTab;
  });

  const handleCardClick = (id: string, category: string) => {
    const categoryPath = category.toLowerCase();
    navigate(`/${categoryPath}/${id}`);
  };

  return (
    <>
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6">
        <div
          className="container mx-auto px-4"
          dir={i18n.language === "he" ? "rtl" : "ltr"}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {t("home.title")}
          </h1>
          <p className="text-lg text-blue-100">{t("home.subtitle")}</p>
        </div>
      </div>

      <main
        className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen"
        dir={i18n.language === "he" ? "rtl" : "ltr"}
      >
        {!searchQuery && (
          <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        )}

        {searchQuery && (
          <div className="mb-6">
            <p className="text-gray-600">
              {t("home.searchResults")}{" "}
              <span className="font-semibold">"{searchQuery}"</span>
            </p>
          </div>
        )}

        {filteredItems.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            {t("home.noResults")} "{searchQuery}"
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleCardClick(item.id, item.category)}
                className="cursor-pointer"
              >
                <ItemCard
                  name={item.name}
                  description={item.description}
                  image={item.image}
                  category={item.category}
                  showCategory={!!searchQuery}
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

export default HomePage;
