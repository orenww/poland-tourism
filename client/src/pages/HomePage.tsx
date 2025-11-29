import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Tabs from "../components/Tabs";
import ItemCard from "../components/ItemCard";
import { categoriesService, Category } from "../services/categories.service";
import { itemsService, Item } from "../services/items.service";

interface HomePageProps {
  searchQuery: string;
}

function HomePage({ searchQuery }: HomePageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create tabs from categories + "Discounts"
  const tabs = [...categories.map((cat) => cat.key), "Discounts"];
  const [activeTab, setActiveTab] = useState("");

  // Fetch categories and items on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesData, itemsData] = await Promise.all([
          categoriesService.getAll(),
          itemsService.getAll(),
        ]);

        setCategories(categoriesData);
        setItems(itemsData);

        // Set first tab as active
        if (categoriesData.length > 0 && !activeTab) {
          setActiveTab(categoriesData[0].key);
        }

        setError(null);
      } catch (err) {
        setError("Failed to load data");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
      return (
        item.textContent?.Discounts &&
        item.textContent?.Discounts.text.trim() !== ""
      );
    }

    // Otherwise filter by category key
    const category = categories.find((cat) => cat.key === activeTab);
    return category && item.categoryId === category.id;
  });

  const handleCardClick = (id: number, categoryId: number) => {
    const category = categories.find((cat) => cat.id === categoryId);
    if (category) {
      navigate(`/${category.key}/${id}`);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">{t("common.loading")}</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

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
                onClick={() => handleCardClick(item.id, item.categoryId)}
                className="cursor-pointer"
              >
                <ItemCard
                  name={item.name}
                  description={item.description}
                  image={
                    item.images?.[0] ||
                    "https://placehold.co/400x200/gray/white?text=No+Image"
                  }
                  category={
                    categories.find((cat) => cat.id === item.categoryId)?.key ||
                    ""
                  }
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
