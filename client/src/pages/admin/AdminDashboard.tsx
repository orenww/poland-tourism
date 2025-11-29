import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { itemsService, Item } from "../../services/items.service";
import { categoriesService, Category } from "../../services/categories.service";

interface AdminDashboardProps {
  onLogout: () => void;
}

function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch items and categories on mount
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [itemsData, categoriesData] = await Promise.all([
          itemsService.getAll(),
          categoriesService.getAll(),
        ]);
        setItems(itemsData);
        setCategories(categoriesData);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load items");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  async function handleDelete(itemId: number, itemName: string) {
    const confirmed = window.confirm(
      t("admin.dashboard.deleteConfirm", { name: itemName })
    );

    if (!confirmed) return;

    try {
      await itemsService.delete(itemId);
      // Remove from local state
      setItems(items.filter((item) => item.id !== itemId));
      alert(t("admin.dashboard.deleteSuccess"));
    } catch (err) {
      console.error("Error deleting item:", err);
      alert(t("admin.dashboard.deleteFailed"));
    }
  }

  function getCategoryName(categoryId: number): string {
    return categories.find((cat) => cat.id === categoryId)?.key || "";
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">{t("common.loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600">{t("admin.dashboard.loadFailed")}</p>
      </div>
    );
  }

  return (
    <div
      className="container mx-auto px-4 py-8"
      dir={i18n.language === "he" ? "rtl" : "ltr"}
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          {t("admin.dashboard.title")}
        </h1>
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          {t("admin.dashboard.logout")}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {t("admin.dashboard.allItems")}
          </h2>
          <button
            onClick={() => navigate("/admin/item/new")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            + {t("admin.dashboard.addNew")}
          </button>
        </div>

        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center gap-4">
                <img
                  src={
                    item.images?.[0] ||
                    "https://placehold.co/64x64/gray/white?text=No+Image"
                  }
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-500">
                    {getCategoryName(item.categoryId)}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/admin/item/edit/${item.id}`)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t("admin.dashboard.edit")}
                </button>
                <button
                  onClick={() => handleDelete(item.id, item.name)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  {t("admin.dashboard.delete")}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
