import React from 'react';
import { LucideIcon } from 'lucide-react';
import { ChevronRight } from 'lucide-react';

interface CategoryItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  image: string;
  onClick: () => void;
  isSelected?: boolean;
  hasSubmenu?: boolean;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  icon: Icon,
  title,
  description,
  image,
  onClick,
  isSelected,
  hasSubmenu
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div className="relative group">
      <button
        className={`w-full p-4 rounded-lg transition-all duration-200 flex items-center gap-4 ${
          isSelected 
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
            : 'hover:bg-gray-50 bg-white'
        }`}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Icon container */}
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
          isSelected ? 'bg-white/20' : 'bg-gray-100'
        }`}>
          <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-gray-700'}`} />
        </div>

        {/* Text content */}
        <div className="flex-1 text-left">
          <div className="font-medium">{title}</div>
          <div className={`text-sm ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
            {description}
          </div>
        </div>

        {/* Chevron for submenus */}
        {hasSubmenu && (
          <ChevronRight className={`w-5 h-5 transition-transform ${
            isSelected ? 'text-white rotate-90' : 'text-gray-400 group-hover:text-gray-600'
          }`} />
        )}
      </button>

      {/* Preview card on hover */}
      {isHovered && !isSelected && (
        <div className="absolute left-full ml-2 top-0 w-80 bg-white rounded-lg shadow-xl z-50 overflow-hidden">
          <img 
            src={image} 
            alt={title}
            className="w-full h-48 object-cover"
          />
          <div className="p-4 space-y-2">
            <h3 className="font-medium text-lg">{title}</h3>
            <p className="text-gray-600">{description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryItem;