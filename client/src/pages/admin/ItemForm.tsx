import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { items } from "../../data/item";
import { getContentFieldsForCategory } from "../../utils/categoryUtils";

function ItemForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t, i18n } = useTranslation();

  const isEditMode = !!id;
  const existingItem = isEditMode ? items.find((item) => item.id === id) : null;

  // Form state
  const [name, setName] = useState(existingItem?.name || "");
  const [description, setDescription] = useState(
    existingItem?.description || ""
  );
  const [category, setCategory] = useState<string>(
    existingItem?.category || "Locations"
  );
  const [image, setImage] = useState(existingItem?.image || "");
  const [content, setContent] = useState(existingItem?.content || {});

  const contentFields = getContentFieldsForCategory(category);

  // When category changes, preserve existing content
  useEffect(() => {
    if (!isEditMode) {
      // Initialize empty content for new items
      const newContent: { [key: string]: string } = {};
      contentFields.forEach((field) => {
        newContent[field] = "";
      });
      setContent(newContent);
    }
  }, [category, isEditMode]);

  const handleContentChange = (field: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const message = isEditMode
      ? "Are you sure you want to update this item?"
      : "Are you sure you want to create this item?";

    const confirmed = window.confirm(message);

    if (!confirmed) {
      return; // User clicked Cancel - do nothing
    }

    // Mock save - just show alert for now
    const itemData = {
      id: isEditMode ? id : `item-${Date.now()}`,
      name,
      description,
      category,
      image,
      content,
    };

    console.log("Saving item:", itemData);
    alert(
      `Item ${
        isEditMode ? "updated" : "created"
      } successfully! (Mock - not actually saved)`
    );
    navigate("/admin");
  };

  const handleCancel = () => {
    navigate("/admin");
  };

  return (
    <div
      className="bg-gray-50 min-h-screen py-8"
      dir={i18n.language === "he" ? "rtl" : "ltr"}
    >
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {isEditMode ? "Edit Item" : "Add New Item"}
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md p-6 space-y-6"
        >
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              dir={i18n.language === "he" ? "rtl" : "ltr"}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              dir={i18n.language === "he" ? "rtl" : "ltr"}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="Locations">Locations</option>
              <option value="Attractions">Attractions</option>
              <option value="Routes">Routes</option>
            </select>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Image URL *
            </label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Content fields based on category */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Content Sections
            </h2>

            {contentFields.map((field) => (
              <div key={field} className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  {field}
                </label>
                <textarea
                  value={content[field] || ""}
                  onChange={(e) => handleContentChange(field, e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Enter ${field} content...`}
                  dir={i18n.language === "he" ? "rtl" : "ltr"}
                />
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isEditMode ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ItemForm;
