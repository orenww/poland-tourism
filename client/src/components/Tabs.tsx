import { useTranslation } from "react-i18next";
import {
  MapPin,
  Compass,
  Route,
  Info,
  UtensilsCrossed,
  Hotel,
  Clock,
  Navigation,
  Lightbulb,
  MapIcon,
  DollarSign,
  Calendar,
  ShoppingBag,
  Tag,
} from "lucide-react";
import { JSX } from "react";

interface TabsProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  const { t } = useTranslation();

  const getTranslatedTabName = (tab: string) => {
    const tabMap: { [key: string]: string } = {
      // Home page tabs (lowercase from API)
      locations: t("home.tabs.locations"),
      attractions: t("home.tabs.attractions"),
      routes: t("home.tabs.routes"),
      benefits: t("home.tabs.benefits"),
      // Home page tabs (capitalized)
      Locations: t("home.tabs.locations"),
      Attractions: t("home.tabs.attractions"),
      Routes: t("home.tabs.routes"),
      Benefits: t("home.tabs.benefits"),
      // Detail page tabs - Locations
      Overview: t("detail.tabs.Overview"),
      Restaurants: t("detail.tabs.Restaurants"),
      Hotels: t("detail.tabs.Hotels"),
      Shopping: t("detail.tabs.Shopping"),
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

  const getTabIcon = (tab: string) => {
    const iconMap: { [key: string]: JSX.Element } = {
      // Home page tabs (lowercase)
      locations: <MapPin size={18} />,
      attractions: <Compass size={18} />,
      routes: <Route size={18} />,
      benefits: <Tag size={18} />,
      // Home page tabs (capitalized)
      Locations: <MapPin size={18} />,
      Attractions: <Compass size={18} />,
      Routes: <Route size={18} />,
      Benefits: <Tag size={18} />,
      // Detail page tabs
      Overview: <Info size={18} />,
      Restaurants: <UtensilsCrossed size={18} />,
      Hotels: <Hotel size={18} />,
      Shopping: <ShoppingBag size={18} />,
      Practical_Info: <Info size={18} />,
      Hours_Prices: <Clock size={18} />,
      How_To_Get_There: <Navigation size={18} />,
      Tips: <Lightbulb size={18} />,
      Itinerary: <Calendar size={18} />,
      Map: <MapIcon size={18} />,
      Budget: <DollarSign size={18} />,
    };
    return iconMap[tab];
  };

  return (
    <div className="mb-8">
      <div className="flex gap-1 border-b-2 border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`px-6 py-3 font-semibold transition-all duration-200 border-b-2 flex items-center gap-2 ${
              activeTab === tab
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {getTabIcon(tab)}
            {getTranslatedTabName(tab)}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Tabs;
