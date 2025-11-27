import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  title: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

function Header({ title, searchQuery, onSearchChange }: HeaderProps) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  return (
    <header
      className="bg-blue-600 text-white p-6 shadow-lg"
      dir={i18n.language === "he" ? "rtl" : "ltr"}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1
            className="text-4xl font-bold cursor-pointer hover:text-blue-100 transition-colors"
            onClick={() => navigate("/")}
          >
            {t("header.title")}
          </h1>

          <button
            onClick={() =>
              i18n.changeLanguage(i18n.language === "en" ? "he" : "en")
            }
            className="px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            {i18n.language === "en" ? "עברית" : "English"}
          </button>
        </div>
        <div className="relative">
          <input
            className={`w-full py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
              i18n.language === "he" ? "pr-10 pl-4" : "pl-4 pr-10"
            }`}
            type="text"
            placeholder={t("header.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            dir={i18n.language === "he" ? "rtl" : "ltr"}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className={`absolute ${
                i18n.language === "he" ? "left-3" : "right-3"
              } top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700`}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
