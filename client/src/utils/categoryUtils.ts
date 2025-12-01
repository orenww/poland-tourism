export function getTextContentFieldsForCategory(category: string): string[] {
  switch (category.toLowerCase()) {
    case "locations":
      return ["Overview", "Practical_Info", "Benefits"];
    case "attractions":
      return [
        "Overview",
        "Hours_Prices",
        "How_To_Get_There",
        "Tips",
        "Benefits",
      ];
    case "routes":
      return ["Itinerary", "Map", "Budget", "Tips", "Benefits"];
    default:
      return ["Overview", "Benefits"];
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
