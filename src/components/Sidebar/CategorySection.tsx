import React from 'react';
import { LucideIcon, ChevronDown } from 'lucide-react';

interface CategorySectionProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle: () => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  icon: Icon,
  title,
  description,
  children,
  isOpen,
  onToggle
}) => {
  return (
    <div className={`rounded-xl transition-all duration-300 ${
      isOpen ? 'bg-white shadow-lg' : 'bg-transparent'
    }`}>
      <button
        className={`w-full p-4 rounded-xl transition-all duration-200 ${
          isOpen 
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' 
            : 'hover:bg-white/80 bg-white'
        }`}
        onClick={onToggle}
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isOpen ? 'bg-white/20' : 'bg-gray-100'
          }`}>
            <Icon className={`w-6 h-6 ${isOpen ? 'text-white' : 'text-gray-700'}`} />
          </div>
          
          <div className="flex-1 text-left">
            <div className="font-medium">{title}</div>
            <div className={`text-sm ${isOpen ? 'text-white/80' : 'text-gray-500'}`}>
              {description}
            </div>
          </div>

          <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-white' : 'text-gray-400'
          }`} />
        </div>
      </button>

      {isOpen && (
        <div className="p-4 space-y-3 bg-white/50 rounded-b-xl backdrop-blur-sm">
          {children}
        </div>
      )}
    </div>
  );
};

export default CategorySection;