import React, { useState } from 'react';
import { Calendar, Edit3, Trash2, ExternalLink } from 'lucide-react';
import { NFT } from '../lib/localStorageUtil';

interface NFTCardProps {
  nft: NFT;
  onEdit?: (nft: NFT) => void;
  onDelete?: (id: string) => void;
}

const NFTCard: React.FC<NFTCardProps> = ({ nft, onEdit, onDelete }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const fallbackImage = "https://images.unsplash.com/photo-1547954575-855750c57bd3?w=300&h=300&fit=crop&crop=center";

  return (
    <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group animate-pop-in">
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100 dark:from-secondary-700 dark:to-secondary-600">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        )}
        
        <img
          src={imageError ? fallbackImage : nft.image}
          alt={nft.name}
          className={`w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 ${
            imageLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
        
        {/* Action Buttons Overlay */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {onEdit && (
            <button
              onClick={() => onEdit(nft)}
              className="p-2 bg-white/90 dark:bg-secondary-800/90 rounded-lg hover:bg-white dark:hover:bg-secondary-800 transition-colors shadow-md"
              title="Edit NFT"
            >
              <Edit3 className="w-4 h-4 text-secondary-700 dark:text-secondary-300" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(nft.id)}
              className="p-2 bg-white/90 dark:bg-secondary-800/90 rounded-lg hover:bg-white dark:hover:bg-secondary-800 transition-colors shadow-md"
              title="Delete NFT"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          )}
        </div>

        {/* NFT ID Badge */}
        <div className="absolute bottom-3 left-3">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/90 dark:bg-secondary-800/90 text-secondary-700 dark:text-secondary-300 backdrop-blur-sm">
            #{nft.id.split('_').pop()?.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-lg font-bold text-secondary-900 dark:text-white line-clamp-2 flex-1">
            {nft.name}
          </h3>
          <ExternalLink className="w-5 h-5 text-secondary-400 flex-shrink-0 mt-0.5" />
        </div>

        <p className="text-secondary-600 dark:text-secondary-300 text-sm mb-4 line-clamp-3">
          {nft.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-secondary-100 dark:border-secondary-700">
          <div className="flex items-center gap-2 text-xs text-secondary-500 dark:text-secondary-400">
            <Calendar className="w-4 h-4" />
            <span>Minted {formatDate(nft.createdAt)}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-600 dark:text-green-400 font-medium">Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTCard;