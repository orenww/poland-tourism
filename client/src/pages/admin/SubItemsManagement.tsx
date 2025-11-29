import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { subItemsService, SubItem } from "../../services/subitems.service";
import { itemsService, Item } from "../../services/items.service";

function SubItemsManagement() {
  const { itemId, sectionType } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [item, setItem] = useState<Item | null>(null);
  const [subItems, setSubItems] = useState<SubItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!itemId) return;

      try {
        setLoading(true);

        // Fetch the item
        const itemData = await itemsService.getById(Number(itemId));
        setItem(itemData);

        // Fetch subitems for this item
        const subItemsData = await subItemsService.getByItem(Number(itemId));

        // Filter by section type
        const filtered = subItemsData.filter(
          (si) => si.sectionType.toLowerCase() === sectionType?.toLowerCase()
        );
        setSubItems(filtered);

        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [itemId, sectionType]);

  async function handleDelete(subItemId: number, subItemName: string) {
    const confirmed = window.confirm(
      t("admin.subItems.management.deleteConfirm", { name: subItemName })
    );

    if (!confirmed) return;

    try {
      await subItemsService.delete(subItemId);
      setSubItems(subItems.filter((si) => si.id !== subItemId));
      alert(t("admin.subItems.management.deleteSuccess"));
    } catch (err) {
      console.error("Error deleting subitem:", err);
      alert(t("admin.subItems.management.deleteFailed"));
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">{t("common.loading")}</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-600">
          {t("admin.subItems.management.itemNotFound")}
        </p>
      </div>
    );
  }

  return (
    <div
      className="container mx-auto px-4 py-8"
      dir={i18n.language === "he" ? "rtl" : "ltr"}
    >
      {/* Breadcrumbs */}
      <div className="mb-4 text-sm text-gray-600">
        <button
          onClick={() => navigate("/admin")}
          className="hover:text-blue-600"
        >
          {t("common.admin")}
        </button>
        {" > "}
        <button
          onClick={() => navigate(`/admin/item/edit/${itemId}`)}
          className="hover:text-blue-600"
        >
          {item.name}
        </button>
        {" > "}
        <span className="font-semibold capitalize">{sectionType}</span>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          {t("admin.subItems.management.title", {
            sectionType,
            itemName: item.name,
          })}
        </h1>
        <button
          onClick={() => navigate(`/admin/item/edit/${itemId}`)}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          ← {t("common.backToItem")}
        </button>
      </div>

      {/* Add button */}
      <div className="mb-6">
        <button
          onClick={() =>
            navigate(`/admin/item/${itemId}/subitems/${sectionType}/new`)
          }
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          +{" "}
          {t("admin.subItems.management.addButton", {
            sectionType: sectionType?.slice(0, -1),
          })}
        </button>
      </div>

      {/* SubItems list */}
      {subItems.length === 0 ? (
        <p className="text-gray-500">
          {t("admin.subItems.management.noItems", { sectionType })}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subItems.map((subItem) => (
            <div
              key={subItem.id}
              className="bg-white border rounded-lg p-4 shadow-sm"
            >
              {/* Image */}
              {subItem.images && subItem.images.length > 0 && (
                <img
                  src={subItem.images[0]}
                  alt={subItem.name}
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
              )}

              {/* Info */}
              <h3 className="font-bold text-lg mb-2">{subItem.name}</h3>
              <p className="text-gray-600 text-sm mb-2">
                {subItem.description.substring(0, 100)}...
              </p>

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() =>
                    navigate(
                      `/admin/item/${itemId}/subitems/${sectionType}/edit/${subItem.id}`
                    )
                  }
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {t("common.edit")}
                </button>
                <button
                  onClick={() => handleDelete(subItem.id, subItem.name)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  {t("common.delete")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SubItemsManagement;
