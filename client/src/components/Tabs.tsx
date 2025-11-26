import { useTranslation } from "react-i18next";

interface TabsProps {
  tabs: string[]; // Accept tabs as prop instead of hardcodin
  activeTab: string;
  onTabChange: (tab: string) => void;
}

function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  const { t } = useTranslation();

  const getTranslatedTabName = (tab: string) => {
    // Map English tab keys to translation keys
    const tabMap: { [key: string]: string } = {
      // Home page tabs
      Locations: t("home.tabs.locations"),
      Attractions: t("home.tabs.attractions"),
      Routes: t("home.tabs.routes"),
      // Detail page tabs - Locations
      Overview: t("detail.tabs.Overview"),
      Restaurants: t("detail.tabs.Restaurants"),
      Hotels: t("detail.tabs.Hotels"),
      Practical_Info: t("detail.tabs.Practical_Info"),
      // Detail page tabs - Attractions
      Hours_Prices: t("detail.tabs.Hours_Prices"),
      How_To_Get_There: t("detail.tabs.How_To_Get_There"),
      Tips: t("detail.tabs.Tips"),
      // Detail page tabs - Routes
      Itinerary: t("detail.tabs.Itinerary"),
      Map: t("detail.tabs.Map"),
      Budget: t("detail.tabs.Budget"),
    };
    return tabMap[tab] || tab;
  };

  return (
    <div className="flex border-b border-gray-300 mb-8">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === tab
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          {getTranslatedTabName(tab)}
        </button>
      ))}
    </div>
  );
}

export default Tabs;
