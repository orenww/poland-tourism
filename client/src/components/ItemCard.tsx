interface ItemCardProps {
  //   id: number;
  name: string;
  description: string;
  image: string;
  category?: string; // Optional - only show when provided
  showCategory?: boolean; // Control whether to display it
}

function ItemCard({
  name,
  description,
  image,
  category,
  showCategory,
}: ItemCardProps) {
  // TODO: When adding English support, use getLocalizedContent(item.name, language)
  // TODO: When adding English support, use getLocalizedContent(item.description, language)

  // Category badge colors
  const getCategoryColor = (cat?: string) => {
    switch (cat) {
      case "Locations":
        return "bg-blue-500";
      case "Attractions":
        return "bg-purple-500";
      case "Routes":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img src={image} alt={name} className="w-full h-48 object-cover" />
        {showCategory && category && (
          <span
            className={`absolute top-2 right-2 ${getCategoryColor(
              category
            )} text-white text-xs font-semibold px-3 py-1 rounded-full`}
          >
            {category}
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{name}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}

export default ItemCard;
