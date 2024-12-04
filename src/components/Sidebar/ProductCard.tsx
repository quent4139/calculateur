import React from 'react';
import { ExternalLink } from 'lucide-react';
import { PRODUCT_LINKS } from '../../config/productLinks';

interface ProductCardProps {
  title: string;
  type: string;
  image: string;
  onClick: () => void;
  dimensions?: string;
  places?: number;
  isSelected?: boolean;
  inDevelopment?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  type,
  image,
  onClick,
  dimensions,
  places,
  isSelected,
  inDevelopment
}) => {
  const handleExternalLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = PRODUCT_LINKS[type as keyof typeof PRODUCT_LINKS];
    if (link) {
      window.open(link, '_blank');
    }
  };

  return (
    <div
      className={`w-full rounded-lg overflow-hidden transition-all duration-200 ${
        isSelected 
          ? 'ring-2 ring-blue-500 bg-blue-50' 
          : 'hover:bg-gray-50 bg-white'
      } ${inDevelopment ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <div 
        className="cursor-pointer"
        onClick={inDevelopment ? undefined : onClick}
      >
        <div className="aspect-video w-full relative overflow-hidden">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover"
          />
          {inDevelopment && (
            <div className="absolute inset-0 bg-yellow-500/20 flex items-center justify-center">
              <span className="bg-yellow-500 text-white px-2 py-1 rounded text-sm font-medium">
                En développement
              </span>
            </div>
          )}
        </div>
        
        <div className="p-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-gray-900">{title}</h3>
            <div
              onClick={handleExternalLinkClick}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </div>
          </div>
          
          {(dimensions || places) && (
            <div className="flex items-center gap-3 pt-2 text-sm">
              {dimensions && (
                <span className="bg-gray-100 px-2 py-1 rounded">
                  {dimensions}
                </span>
              )}
              {places && (
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  {places} places
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;