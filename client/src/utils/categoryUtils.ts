export function getTextContentFieldsForCategory(category: string): string[] {
  switch (category.toLowerCase()) {
    case "locations":
      return ["Overview", "Practical_Info", "Discounts"];
    case "attractions":
      return [
        "Overview",
        "Hours_Prices",
        "How_To_Get_There",
        "Tips",
        "Discounts",
      ];
    case "routes":
      return ["Itinerary", "Map", "Budget", "Tips", "Discounts"];
    default:
      return ["Overview", "Discounts"];
  }
}

export function getStructuredSectionsForCategory(category: string): string[] {
  switch (category.toLowerCase()) {
    case "locations":
      return ["Hotels", "Restaurants", "Attractions", "Shopping"];
    case "attractions":
      return []; // Attractions don't have structured sub-sections
    case "routes":
      return []; // Routes don't have structured sub-sections (for now)
    default:
      return [];
  }
}
