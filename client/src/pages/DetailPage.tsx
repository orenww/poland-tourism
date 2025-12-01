import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { itemsService, Item } from "../services/items.service";
import { categoriesService, Category } from "../services/categories.service";
import Tabs from "../components/Tabs";
import Breadcrumbs from "../components/Breadcrumbs";
import ReactMarkdown from "react-markdown";
import {
  getStructuredSectionsForCategory,
  getTextContentFieldsForCategory,
} from "../utils/categoryUtils";

function DetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t, i18n } = useTranslation();

  const [item, setItem] = useState<Item | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nearbyAttractions, setNearbyAttractions] = useState<Item[]>([]);

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

  // Show Benefits tab if item has textContent.Benefits OR has SubItems with benefits
  const hasTextBenefits =
    item?.textContent?.Benefits?.text &&
    item.textContent.Benefits.text.trim() !== "";

  const hasSubItemBenefits = item?.subItems?.some((subItem) => subItem.benefit);

  const tabs =
    hasTextBenefits || hasSubItemBenefits
      ? [...allTabs]
      : allTabs.filter((tab) => tab !== "Benefits");

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

        // Fetch nearby attractions (items where nearLocationIds includes this item's id)
        if (itemData.category?.key === "locations") {
          const allItems = await itemsService.getAll();
          const nearby = allItems.filter((item) =>
            item.nearLocationIds?.includes(itemData.id)
          );
          setNearbyAttractions(nearby);
        }

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

  // Handle highlighting and scrolling to specific SubItem
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const highlightId = searchParams.get("highlight");

    if (highlightId) {
      // Try multiple times to find the element
      const tryHighlight = (attempt = 0) => {
        const element = document.getElementById(`subitem-${highlightId}`);

        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          element.classList.add("highlighted");

          // Add click listener to remove highlight
          setTimeout(() => {
            const clickHandler = () => {
              element.classList.remove("highlighted");
            };
            document.addEventListener("click", clickHandler, { once: true });
          }, 100);
        } else if (attempt < 5) {
          // Retry after a delay
          setTimeout(() => tryHighlight(attempt + 1), 200);
        }
      };

      // Start trying after a short delay
      setTimeout(() => tryHighlight(), 300);
    }
  }, [location.search, item, activeTab]);
  // Handle URL params for tab switching
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get("tab");

    if (tabParam && tabs.length > 0) {
      // Capitalize first letter to match tab format (hotels -> Hotels)
      const capitalizedTab =
        tabParam.charAt(0).toUpperCase() + tabParam.slice(1);

      if (tabs.includes(capitalizedTab)) {
        setActiveTab(capitalizedTab);
      }
    }
  }, [location.search, tabs]);

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
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={(newTab) => {
              setActiveTab(newTab);
              // Always clear URL params when user manually clicks a tab
              navigate(location.pathname, { replace: true });
            }}
          />
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
                          id={`subitem-${subItem.id}`}
                          className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow relative"
                        >
                          {/* Benefit badge - top right corner */}
                          {subItem.benefit && (
                            <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                              ⭐ Benefit
                            </span>
                          )}

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

                          {/* Benefit - if exists */}
                          {subItem.benefit && (
                            <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg">
                              <p className="text-green-800 text-sm">
                                🎁 <strong>Special Offer:</strong>{" "}
                                {subItem.benefit}
                              </p>
                            </div>
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
                  <div className="prose prose-lg max-w-none mb-4">
                    <ReactMarkdown>
                      {item.textContent[activeTab].text}
                    </ReactMarkdown>
                  </div>
                )}

                {/* FOR BENEFITS TAB - also show SubItems with benefits */}
                {activeTab === "Benefits" && item.subItems && (
                  <>
                    {["hotels", "restaurants", "attractions", "shopping"].map(
                      (sectionType) => {
                        const itemsWithBenefits = item.subItems?.filter(
                          (subItem) =>
                            subItem.sectionType === sectionType &&
                            subItem.benefit
                        );

                        if (
                          !itemsWithBenefits ||
                          itemsWithBenefits.length === 0
                        )
                          return null;

                        return (
                          <div key={sectionType} className="mt-6">
                            <h3 className="text-xl font-bold mb-4 capitalize">
                              {sectionType} with Special Offers
                            </h3>
                            <div className="space-y-4">
                              {itemsWithBenefits.map((subItem) => (
                                <div
                                  key={subItem.id}
                                  onClick={() => {
                                    // Update URL with tab and highlight parameters
                                    navigate(
                                      `${location.pathname}?tab=${sectionType}&highlight=${subItem.id}`
                                    );
                                  }}
                                  className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg cursor-pointer hover:bg-green-100 transition-colors"
                                >
                                  <h4 className="font-bold text-lg mb-2">
                                    {subItem.name}
                                  </h4>
                                  <p className="text-green-800">
                                    🎁 {subItem.benefit}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </>
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
                    item.textContent[activeTab].images.length === 0) &&
                  activeTab !== "Benefits" && (
                    <p className="text-gray-500">{t("detail.noContentYet")}</p>
                  )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Nearby Attractions - only for locations */}
      {item.category?.key === "locations" &&
        nearbyAttractions.length > 0 &&
        activeTab === "Overview" && (
          <div className="bg-white p-6 rounded-lg shadow-md mt-6">
            <h3 className="text-2xl font-bold mb-4">Nearby Attractions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nearbyAttractions.map((attraction) => (
                <div
                  key={attraction.id}
                  onClick={() =>
                    navigate(`/${attraction.category?.key}/${attraction.id}`)
                  } // CHANGE THIS LINE
                  className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  {attraction.images && attraction.images.length > 0 && (
                    <img
                      src={attraction.images[0]}
                      alt={attraction.name}
                      className="w-full h-48 object-cover rounded-lg mb-3"
                    />
                  )}
                  <h4 className="font-bold text-lg mb-2">{attraction.name}</h4>
                  <p className="text-gray-600 text-sm">
                    {attraction.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );
}

export default DetailPage;
