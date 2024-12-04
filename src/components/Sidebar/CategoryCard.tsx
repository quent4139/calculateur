import React from 'react';
import { LucideIcon } from 'lucide-react';

interface CategoryCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  image: string;
  onClick: () => void;
  isSelected?: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  icon: Icon,
  title,
  description,
  image,
  onClick,
  isSelected
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div className="relative">
      <button
        className={`w-full p-3 rounded-lg transition-all duration-200 ${
          isSelected 
            ? 'bg-blue-100 border-2 border-blue-500' 
            : 'hover:bg-gray-100 border border-gray-200'
        }`}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
            <Icon className="w-5 h-5" />
          </div>
          <span className="font-medium">{title}</span>
        </div>
      </button>

      {/* Info card on hover */}
      {isHovered && (
        <div className="absolute left-full ml-2 top-0 w-64 bg-white rounded-lg shadow-xl z-50 overflow-hidden">
          <img 
            src={image} 
            alt={title}
            className="w-full h-32 object-cover"
          />
          <div className="p-3 space-y-2">
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryCard;