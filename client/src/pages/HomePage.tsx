import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Tabs from "../components/Tabs";
import ItemCard from "../components/ItemCard";
import { items } from "../data/item";

interface HomePageProps {
  searchQuery: string;
}

function HomePage({ searchQuery }: HomePageProps) {
  const [activeTab, setActiveTab] = useState("Locations");
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  // TODO: When adding English support, use getLocalizedContent() for item.name and item.description in search/display

  useEffect(() => {
    document.title = `${t("home.title")} | ${t("header.title")}`;
  }, [t]);

  const filteredItems = items.filter((item) => {
    // If searching, ignore tab filter and search all items
    if (searchQuery) {
      return (
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // If not searching, filter by active tab only
    return item.category === activeTab;
  });

  const handleCardClick = (id: string, category: string) => {
    const categoryPath = category.toLowerCase(); // "Locations" → "locations"
    navigate(`/${categoryPath}/${id}`);
  };

  return (
    <main
      className="container mx-auto px-4 py-8"
      dir={i18n.language === "he" ? "rtl" : "ltr"}
    >
      <h1 className="text-4xl font-bold text-gray-800 mb-2">
        {t("home.title")}
      </h1>
      <p className="text-gray-600 mb-8">{t("home.subtitle")}</p>

      {!searchQuery && (
        <Tabs
          tabs={["Locations", "Attractions", "Routes"]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  );
}

export default HomePage;
