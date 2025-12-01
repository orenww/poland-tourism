import { useNavigate } from "react-router-dom";
import { Item } from "../services/items.service";

interface BenefitsAggregationProps {
  items: Item[];
}

function BenefitsAggregation({ items }: BenefitsAggregationProps) {
  const navigate = useNavigate();

  // Collect all SubItems with benefits, grouped by type
  const benefitsByType: Record<
    string,
    Array<{
      subItem: any;
      locationName: string;
      locationId: number;
      categoryKey: string;
    }>
  > = {
    hotels: [],
    restaurants: [],
    attractions: [],
    shopping: [],
  };

  // Collect general city benefits
  const cityBenefits: Array<{
    item: Item;
    categoryKey: string;
  }> = [];

  // Process all items
  items.forEach((item) => {
    // Collect SubItems with benefits
    if (item.subItems) {
      item.subItems.forEach((subItem) => {
        if (subItem.benefit) {
          const type = subItem.sectionType.toLowerCase();
          if (benefitsByType[type]) {
            benefitsByType[type].push({
              subItem,
              locationName: item.name,
              locationId: item.id,
              categoryKey: item.category?.key || "locations",
            });
          }
        }
      });
    }

    // Collect items with textContent.Benefits
    if (item.textContent?.Benefits?.text?.trim()) {
      cityBenefits.push({
        item,
        categoryKey: item.category?.key || "locations",
      });
    }
  });

  // Handle click on SubItem benefit
  const handleSubItemClick = (
    locationId: number,
    categoryKey: string,
    sectionType: string,
    subItemId: number
  ) => {
    navigate(
      `/${categoryKey}/${locationId}?tab=${sectionType}&highlight=${subItemId}`
    );
  };

  // Handle click on city benefit
  const handleCityClick = (itemId: number, categoryKey: string) => {
    navigate(`/${categoryKey}/${itemId}?tab=Benefits`);
  };

  return (
    <div className="space-y-12">
      {/* Hotels with benefits */}
      {benefitsByType.hotels.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">
            🏨 Hotels with Special Offers
          </h2>
          <div className="space-y-4">
            {benefitsByType.hotels.map(
              ({ subItem, locationName, locationId, categoryKey }) => (
                <div
                  key={subItem.id}
                  onClick={() =>
                    handleSubItemClick(
                      locationId,
                      categoryKey,
                      "hotels",
                      subItem.id
                    )
                  }
                  className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg cursor-pointer hover:bg-green-100 transition-colors"
                >
                  <h3 className="font-bold text-lg mb-1">
                    {subItem.name}{" "}
                    <span className="text-gray-500 text-sm">
                      ({locationName})
                    </span>
                  </h3>
                  <p className="text-green-800">🎁 {subItem.benefit}</p>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Restaurants with benefits */}
      {benefitsByType.restaurants.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">
            🍴 Restaurants with Special Offers
          </h2>
          <div className="space-y-4">
            {benefitsByType.restaurants.map(
              ({ subItem, locationName, locationId, categoryKey }) => (
                <div
                  key={subItem.id}
                  onClick={() =>
                    handleSubItemClick(
                      locationId,
                      categoryKey,
                      "restaurants",
                      subItem.id
                    )
                  }
                  className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg cursor-pointer hover:bg-green-100 transition-colors"
                >
                  <h3 className="font-bold text-lg mb-1">
                    {subItem.name}{" "}
                    <span className="text-gray-500 text-sm">
                      ({locationName})
                    </span>
                  </h3>
                  <p className="text-green-800">🎁 {subItem.benefit}</p>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Attractions with benefits */}
      {benefitsByType.attractions.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">
            🎭 Attractions with Special Offers
          </h2>
          <div className="space-y-4">
            {benefitsByType.attractions.map(
              ({ subItem, locationName, locationId, categoryKey }) => (
                <div
                  key={subItem.id}
                  onClick={() =>
                    handleSubItemClick(
                      locationId,
                      categoryKey,
                      "attractions",
                      subItem.id
                    )
                  }
                  className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg cursor-pointer hover:bg-green-100 transition-colors"
                >
                  <h3 className="font-bold text-lg mb-1">
                    {subItem.name}{" "}
                    <span className="text-gray-500 text-sm">
                      ({locationName})
                    </span>
                  </h3>
                  <p className="text-green-800">🎁 {subItem.benefit}</p>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Shopping with benefits */}
      {benefitsByType.shopping.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">
            🛍️ Shopping with Special Offers
          </h2>
          <div className="space-y-4">
            {benefitsByType.shopping.map(
              ({ subItem, locationName, locationId, categoryKey }) => (
                <div
                  key={subItem.id}
                  onClick={() =>
                    handleSubItemClick(
                      locationId,
                      categoryKey,
                      "shopping",
                      subItem.id
                    )
                  }
                  className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg cursor-pointer hover:bg-green-100 transition-colors"
                >
                  <h3 className="font-bold text-lg mb-1">
                    {subItem.name}{" "}
                    <span className="text-gray-500 text-sm">
                      ({locationName})
                    </span>
                  </h3>
                  <p className="text-green-800">🎁 {subItem.benefit}</p>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* General City Benefits */}
      {cityBenefits.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">📍 General City Benefits</h2>
          <div className="space-y-4">
            {cityBenefits.map(({ item, categoryKey }) => (
              <div
                key={item.id}
                onClick={() => handleCityClick(item.id, categoryKey)}
                className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg cursor-pointer hover:bg-blue-100 transition-colors"
              >
                <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                <p className="text-blue-800 line-clamp-2">
                  🎁 {item.textContent.Benefits.text.substring(0, 150)}...
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default BenefitsAggregation;
