import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

interface BreadcrumbsProps {
  category: string;
  itemName: string;
}

export default function Breadcrumbs({ category, itemName }: BreadcrumbsProps) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const getCategoryTranslation = (cat: string) => {
    const categoryMap: { [key: string]: string } = {
      Locations: t("home.tabs.locations"),
      Attractions: t("home.tabs.attractions"),
      Routes: t("home.tabs.routes"),
    };
    return categoryMap[cat] || cat;
  };

  const handleCategoryClick = () => {
    navigate("/", { state: { activeTab: category } });
  };

  return (
    <div
      className="flex items-center gap-2 text-sm text-gray-600 mb-4"
      dir={i18n.language === "he" ? "rtl" : "ltr"}
    >
      <button
        onClick={() => navigate("/")}
        className="hover:text-blue-600 transition-colors"
      >
        {t("header.title")}
      </button>
      <ChevronRight
        size={16}
        className={i18n.language === "he" ? "rotate-180" : ""}
      />
      <button
        onClick={handleCategoryClick}
        className="text-gray-800 font-semibold hover:text-blue-600 transition-colors"
      >
        {getCategoryTranslation(category)}
      </button>
      <ChevronRight
        size={16}
        className={i18n.language === "he" ? "rotate-180" : ""}
      />
      <span className="text-gray-800 font-semibold">{itemName}</span>
    </div>
  );
}
