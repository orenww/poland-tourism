import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { itemsService, Item } from "../services/items.service";
import { categoriesService, Category } from "../services/categories.service";
import Tabs from "../components/Tabs";
import Breadcrumbs from "../components/Breadcrumbs";
import {
  getStructuredSectionsForCategory,
  getTextContentFieldsForCategory,
} from "../utils/categoryUtils";

function DetailPage() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();

  const [item, setItem] = useState<Item | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get text-only tabs
  const textTabs = category
    ? getTextContentFieldsForCategory(category.key)
    : ["Overview"];

  // Get structured tabs
  const structuredTabs = category
    ? getStructuredSectionsForCategory(category.key)
    : [];

  // Combine all tabs
  const allTabs = [...textTabs, ...structuredTabs];

  // Add "Discounts" tab if item has discount content
  const tabs =
    item?.textContent?.Discounts?.text &&
    item.textContent.Discounts.text.trim() !== ""
      ? [...allTabs]
      : allTabs.filter((tab) => tab !== "Discounts");

  const [activeTab, setActiveTab] = useState(tabs[0]);

  // Fetch item and category on mount
  useEffect(() => {
    async function fetchData() {
      if (!id) return;

      try {
        setLoading(true);

        // Fetch item
        const itemData = await itemsService.getById(Number(id));
        setItem(itemData);

        // Fetch all categories to get the category details
        const categoriesData = await categoriesService.getAll();
        const itemCategory = categoriesData.find(
          (cat) => cat.id === itemData.categoryId
        );
        setCategory(itemCategory || null);

        setError(null);
      } catch (err) {
        console.error("Error fetching item:", err);
        setError(t("detail.notFound") || "Item not found");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id, t]);

  // Update active tab when tabs change
  useEffect(() => {
    if (tabs.length > 0 && !tabs.includes(activeTab)) {
      setActiveTab(tabs[0]);
    }
  }, [tabs, activeTab]);

  // Update page title
  useEffect(() => {
    if (item) {
      document.title = `${item.name} | ${t("header.title")}`;
    }
  }, [item, t]);

  if (loading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        dir={i18n.language === "he" ? "rtl" : "ltr"}
      >
        <p className="text-gray-600">{t("common.loading")}</p>
      </div>
    );
  }

  if (error || !item || !category) {
    return (
      <div
        className="container mx-auto px-4 py-8"
        dir={i18n.language === "he" ? "rtl" : "ltr"}
      >
        <h1 className="text-3xl font-bold text-red-600">
          {error || t("detail.notFound")}
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
        <Breadcrumbs category={category.key} itemName={item.name} />

        <h1 className="text-3xl font-bold text-gray-800 mb-3">{item.name}</h1>
        <p className="text-lg text-gray-600 mb-6">{item.description}</p>

        {/* Main images gallery */}
        {item.images && item.images.length > 0 && (
          <div className="mb-6">
            {item.images.length === 1 ? (
              <img
                src={item.images[0]}
                alt={item.name}
                className="w-full h-96 object-cover rounded-lg shadow-md"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {item.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${item.name} ${index + 1}`}
                    className="w-full h-64 object-cover rounded-lg shadow-md"
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <div>
          <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="bg-white p-6 rounded-lg shadow-md">
            {/* Check if this is a structured section */}
            {structuredTabs.includes(activeTab) ? (
              // Display SubItems as cards
              <div>
                <h3 className="text-xl font-bold mb-4">{activeTab}</h3>
                {item.subItems &&
                item.subItems.filter(
                  (subItem) =>
                    subItem.sectionType.toLowerCase() ===
                    activeTab.toLowerCase()
                ).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {item.subItems
                      .filter(
                        (subItem) =>
                          subItem.sectionType.toLowerCase() ===
                          activeTab.toLowerCase()
                      )
                      .map((subItem) => (
                        <div
                          key={subItem.id}
                          className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                        >
                          {/* SubItem image */}
                          {subItem.images && subItem.images.length > 0 && (
                            <img
                              src={subItem.images[0]}
                              alt={subItem.name}
                              className="w-full h-48 object-cover rounded-lg mb-3"
                            />
                          )}

                          {/* SubItem info */}
                          <h4 className="font-bold text-lg mb-2">
                            {subItem.name}
                          </h4>
                          <p className="text-gray-600 text-sm mb-2">
                            {subItem.description}
                          </p>

                          {/* Optional fields */}
                          {subItem.address && (
                            <p className="text-gray-500 text-sm mb-1">
                              📍 {subItem.address}
                            </p>
                          )}
                          {subItem.priceRange && (
                            <p className="text-gray-500 text-sm mb-1">
                              💰 {subItem.priceRange}
                            </p>
                          )}
                          {subItem.hours && (
                            <p className="text-gray-500 text-sm mb-1">
                              🕐 {subItem.hours}
                            </p>
                          )}
                          {subItem.ticketPrice && (
                            <p className="text-gray-500 text-sm mb-1">
                              🎫 {subItem.ticketPrice}
                            </p>
                          )}
                          {subItem.type && (
                            <p className="text-gray-500 text-sm mb-1">
                              🏷️ {subItem.type}
                            </p>
                          )}
                          {subItem.website && (
                            <a
                              href={subItem.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-sm block mt-2"
                            >
                              {t("detail.visitWebsite")} →
                            </a>
                          )}
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-500">
                    {t("detail.noItemsYet", { items: activeTab.toLowerCase() })}
                  </p>
                )}
              </div>
            ) : (
              // Display text content
              <div>
                {item.textContent?.[activeTab]?.text && (
                  <p className="text-gray-700 whitespace-pre-line mb-4">
                    {item.textContent[activeTab].text}
                  </p>
                )}

                {item.textContent?.[activeTab]?.images &&
                  item.textContent[activeTab].images.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {item.textContent[activeTab].images.map(
                        (img: string, index: number) => (
                          <img
                            key={index}
                            src={img}
                            alt={`${item.name} - ${activeTab} ${index + 1}`}
                            className="w-full h-64 object-cover rounded-lg"
                          />
                        )
                      )}
                    </div>
                  )}

                {!item.textContent?.[activeTab]?.text &&
                  (!item.textContent?.[activeTab]?.images ||
                    item.textContent[activeTab].images.length === 0) && (
                    <p className="text-gray-500">{t("detail.noContentYet")}</p>
                  )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailPage;
