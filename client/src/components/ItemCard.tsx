interface ItemCardProps {
  name: string;
  description: string;
  image: string;
  category?: string;
  showCategory?: boolean;
}

function ItemCard({
  name,
  description,
  image,
  category,
  showCategory,
}: ItemCardProps) {
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
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300">
      <div className="relative">
        <img src={image} alt={name} className="w-full h-32 object-cover" />
        {showCategory && category && (
          <span
            className={`absolute top-3 right-3 ${getCategoryColor(
              category
            )} text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md`}
          >
            {category}
          </span>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
          {name}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
          {description}
        </p>
      </div>
    </div>
  );
}

export default ItemCard;
