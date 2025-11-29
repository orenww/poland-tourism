import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { itemsService } from "../../services/items.service";
import { categoriesService, Category } from "../../services/categories.service";
import { getTextContentFieldsForCategory } from "../../utils/categoryUtils";

function ItemForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t, i18n } = useTranslation();

  const isEditMode = !!id;

  // State
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [images, setImages] = useState<string[]>([]); // Changed from image
  const [textContent, setTextContent] = useState<Record<string, any>>({});

  // Get content fields for selected category
  const selectedCategory = categories.find((cat) => cat.id === categoryId);
  const contentFields = selectedCategory
    ? getTextContentFieldsForCategory(selectedCategory.key)
    : [];

  // Fetch categories and item (if editing) on mount
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch categories
        const categoriesData = await categoriesService.getAll();
        setCategories(categoriesData);

        // If editing, fetch the item
        if (isEditMode && id) {
          const itemData = await itemsService.getById(Number(id));
          setName(itemData.name);
          setDescription(itemData.description);
          setCategoryId(itemData.categoryId);
          setImages(itemData.images || []); // Changed from setImage
          setTextContent(itemData.textContent || {});
        } else {
          // New item - set first category as default
          if (categoriesData.length > 0) {
            setCategoryId(categoriesData[0].id);
          }
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [isEditMode, id]);

  // When category changes, initialize empty content for new items
  useEffect(() => {
    if (!isEditMode && categoryId) {
      const newContent: Record<string, any> = {};
      contentFields.forEach((field) => {
        newContent[field] = {
          text: "",
          images: [],
        };
      });
      setTextContent(newContent);
    }
  }, [categoryId, isEditMode]);

  function handleContentTextChange(field: string, value: string) {
    setTextContent((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        text: value,
        images: prev[field]?.images || [],
      },
    }));
  }

  function handleContentImagesChange(field: string, images: string[]) {
    setTextContent((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        text: prev[field]?.text || "",
        images: images,
      },
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!categoryId) {
      alert(t("admin.itemForm.selectCategory"));
      return;
    }

    const message = isEditMode
      ? t("admin.itemForm.confirmUpdate")
      : t("admin.itemForm.confirmCreate");

    const confirmed = window.confirm(message);
    if (!confirmed) return;

    try {
      setSaving(true);

      const itemData = {
        name,
        description,
        categoryId,
        images: images.length > 0 ? images : undefined,
        textContent,
      };

      if (isEditMode && id) {
        await itemsService.update(Number(id), itemData);
        alert(t("admin.itemForm.updateSuccess"));
      } else {
        await itemsService.create(itemData);
        alert(t("admin.itemForm.createSuccess"));
      }

      navigate("/admin");
    } catch (err: any) {
      console.error("Error saving item:", err);
      alert(
        t("admin.itemForm.saveFailed", { error: err.response?.data?.message || err.message })
      );
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    navigate("/admin");
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
        <p className="text-red-600">{t("admin.itemForm.loadFailed")}</p>
      </div>
    );
  }

  return (
    <div
      className="bg-gray-50 min-h-screen py-8"
      dir={i18n.language === "he" ? "rtl" : "ltr"}
    >
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {isEditMode ? t("admin.itemForm.titleEdit") : t("admin.itemForm.titleNew")}
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md p-6 space-y-6"
        >
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              {t("common.name")} {t("common.required")}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={saving}
              dir={i18n.language === "he" ? "rtl" : "ltr"}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              {t("common.description")} {t("common.required")}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={saving}
              dir={i18n.language === "he" ? "rtl" : "ltr"}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              {t("common.category")} {t("common.required")}
            </label>
            <select
              value={categoryId || ""}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={saving}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.key}
                </option>
              ))}
            </select>
          </div>
          {/* Main Images */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              {t("common.mainImages")}
            </label>

            {/* Display existing images */}
            {images.length > 0 && (
              <div className="mb-3 space-y-2">
                {images.map((img, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="url"
                      value={img}
                      onChange={(e) => {
                        const newImages = [...images];
                        newImages[index] = e.target.value;
                        setImages(newImages);
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={saving}
                      placeholder={t("common.imageUrl")}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setImages(images.filter((_, i) => i !== index))
                      }
                      disabled={saving}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300"
                    >
                      {t("common.remove")}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add new image button */}
            <button
              type="button"
              onClick={() => setImages([...images, ""])}
              disabled={saving}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300"
            >
              + {t("common.addImage")}
            </button>
          </div>
          {/* Content fields based on category */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {t("admin.itemForm.contentSections")}
            </h2>

            {contentFields.map((field) => {
              const fieldContent = textContent[field] || {
                text: "",
                images: [],
              };
              const fieldImages = fieldContent.images || [];

              return (
                <div
                  key={field}
                  className="mb-6 p-4 border border-gray-200 rounded-lg"
                >
                  <h3 className="font-semibold text-gray-800 mb-3">{field}</h3>

                  {/* Text content */}
                  <div className="mb-3">
                    <label className="block text-gray-700 text-sm mb-2">
                      {t("common.text")}
                    </label>
                    <textarea
                      value={fieldContent.text || ""}
                      onChange={(e) =>
                        handleContentTextChange(field, e.target.value)
                      }
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={t("admin.itemForm.enterText", { field })}
                      disabled={saving}
                      dir={i18n.language === "he" ? "rtl" : "ltr"}
                    />
                  </div>

                  {/* Images for this section */}
                  <div>
                    <label className="block text-gray-700 text-sm mb-2">
                      {t("common.images")}
                    </label>

                    {fieldImages.length > 0 && (
                      <div className="mb-2 space-y-2">
                        {fieldImages.map((img: string, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <input
                              type="url"
                              value={img}
                              onChange={(e) => {
                                const newImages = [...fieldImages];
                                newImages[index] = e.target.value;
                                handleContentImagesChange(field, newImages);
                              }}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              disabled={saving}
                              placeholder={t("common.imageUrl")}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newImages = fieldImages.filter(
                                  (_: string, i: number) => i !== index
                                );
                                handleContentImagesChange(field, newImages);
                              }}
                              disabled={saving}
                              className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 text-sm"
                            >
                              {t("common.remove")}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        handleContentImagesChange(field, [...fieldImages, ""])
                      }
                      disabled={saving}
                      className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 text-sm"
                    >
                      + {t("common.addImage")}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:bg-gray-300"
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
            >
              {saving ? t("common.saving") : isEditMode ? t("common.update") : t("common.create")}
            </button>
          </div>
        </form>
        {/* Manage SubItems - only show in edit mode and for locations */}
        {isEditMode && selectedCategory?.key === "locations" && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {t("admin.itemForm.manageStructured")}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                type="button"
                onClick={() => navigate(`/admin/item/${id}/subitems/hotels`)}
                className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                🏨 {t("admin.itemForm.manageHotels")}
              </button>
              <button
                type="button"
                onClick={() =>
                  navigate(`/admin/item/${id}/subitems/restaurants`)
                }
                className="px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                🍴 {t("admin.itemForm.manageRestaurants")}
              </button>
              <button
                type="button"
                onClick={() =>
                  navigate(`/admin/item/${id}/subitems/attractions`)
                }
                className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                🎭 {t("admin.itemForm.manageAttractions")}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/admin/item/${id}/subitems/shopping`)}
                className="px-4 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
              >
                🛍️ {t("admin.itemForm.manageShopping")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ItemForm;
