export function getContentFieldsForCategory(category: string): string[] {
  switch (category) {
    case "Locations":
      return [
        "Overview",
        "Restaurants",
        "Hotels",
        "Attractions",
        "Practical_Info",
        "Discounts",
      ];
    case "Attractions":
      return [
        "Overview",
        "Hours_Prices",
        "How_To_Get_There",
        "Tips",
        "Discounts",
      ];
    case "Routes":
      return ["Itinerary", "Map", "Budget", "Tips", "Discounts"];
    default:
      return ["Overview", "Discounts"];
  }
}
