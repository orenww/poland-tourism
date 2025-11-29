import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { subItemsService, SubItem } from "../../services/subitems.service";
import { itemsService, Item } from "../../services/items.service";

function SubItemForm() {
  const { itemId, sectionType, subItemId } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const isEditMode = !!subItemId;

  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [hours, setHours] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");
  const [type, setType] = useState("");
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch the item
        if (itemId) {
          const itemData = await itemsService.getById(Number(itemId));
          setItem(itemData);
        }

        // If editing, fetch the subitem
        if (isEditMode && subItemId) {
          const subItemData = await subItemsService.getById(Number(subItemId));
          setName(subItemData.name);
          setDescription(subItemData.description);
          setAddress(subItemData.address || "");
          setWebsite(subItemData.website || "");
          setPriceRange(subItemData.priceRange || "");
          setHours(subItemData.hours || "");
          setTicketPrice(subItemData.ticketPrice || "");
          setType(subItemData.type || "");
          setImages(subItemData.images || []);
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
  }, [itemId, subItemId, isEditMode]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!itemId || !sectionType) return;

    const confirmed = window.confirm(
      `Are you sure you want to ${
        isEditMode ? "update" : "create"
      } this ${sectionType.slice(0, -1)}?`
    );
    if (!confirmed) return;

    try {
      setSaving(true);

      const subItemData = {
        itemId: Number(itemId),
        sectionType,
        name,
        description,
        address: address || undefined,
        website: website || undefined,
        priceRange: priceRange || undefined,
        hours: hours || undefined,
        ticketPrice: ticketPrice || undefined,
        type: type || undefined,
        images: images.length > 0 ? images : undefined,
      };

      if (isEditMode && subItemId) {
        await subItemsService.update(Number(subItemId), subItemData);
        alert("Updated successfully!");
      } else {
        await subItemsService.create(subItemData);
        alert("Created successfully!");
      }

      navigate(`/admin/item/${itemId}/subitems/${sectionType}`);
    } catch (err: any) {
      console.error("Error saving subitem:", err);
      alert("Failed to save: " + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    navigate(`/admin/item/${itemId}/subitems/${sectionType}`);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-600">{error || "Item not found"}</p>
      </div>
    );
  }

  return (
    <div
      className="bg-gray-50 min-h-screen py-8"
      dir={i18n.language === "he" ? "rtl" : "ltr"}
    >
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Breadcrumbs */}
        <div className="mb-4 text-sm text-gray-600">
          <button
            onClick={() => navigate("/admin")}
            className="hover:text-blue-600"
          >
            Admin
          </button>
          {" > "}
          <button
            onClick={() => navigate(`/admin/item/edit/${itemId}`)}
            className="hover:text-blue-600"
          >
            {item.name}
          </button>
          {" > "}
          <button
            onClick={() =>
              navigate(`/admin/item/${itemId}/subitems/${sectionType}`)
            }
            className="hover:text-blue-600 capitalize"
          >
            {sectionType}
          </button>
          {" > "}
          <span className="font-semibold">{isEditMode ? "Edit" : "Add"}</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {isEditMode
            ? `Edit ${sectionType?.slice(0, -1)}`
            : `Add ${sectionType?.slice(0, -1)}`}
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
              disabled={saving}
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
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={saving}
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={saving}
            />
          </div>

          {/* Website */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Website
            </label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={saving}
            />
          </div>

          {/* Conditional fields based on section type */}
          {(sectionType === "hotels" || sectionType === "restaurants") && (
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Price Range
              </label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={saving}
              >
                <option value="">Select...</option>
                <option value="$">$ - Budget</option>
                <option value="$$">$$ - Moderate</option>
                <option value="$$$">$$$ - Expensive</option>
                <option value="$$$$">$$$$ - Luxury</option>
              </select>
            </div>
          )}

          {sectionType === "attractions" && (
            <>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Hours
                </label>
                <input
                  type="text"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  placeholder="e.g., 9:00 AM - 5:00 PM"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={saving}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Ticket Price
                </label>
                <input
                  type="text"
                  value={ticketPrice}
                  onChange={(e) => setTicketPrice(e.target.value)}
                  placeholder="e.g., 50 PLN"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={saving}
                />
              </div>
            </>
          )}

          {sectionType === "shopping" && (
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={saving}
              >
                <option value="">Select...</option>
                <option value="Mall">Mall</option>
                <option value="Market">Market</option>
                <option value="Shopping Street">Shopping Street</option>
                <option value="Boutique">Boutique</option>
              </select>
            </div>
          )}

          {/* Images */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Images
            </label>

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
                      placeholder="Image URL"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setImages(images.filter((_, i) => i !== index))
                      }
                      disabled={saving}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => setImages([...images, ""])}
              disabled={saving}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300"
            >
              + Add Image
            </button>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
            >
              {saving ? "Saving..." : isEditMode ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SubItemForm;
