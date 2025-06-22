import React, { useState } from 'react';
import { X, Zap, Upload, Sparkles } from 'lucide-react';

interface MintFormProps {
  isOpen: boolean;
  onClose: () => void;
  onMint: (data: { name: string; description: string; image: string }) => Promise<void>;
  editingNFT?: {
    id: string;
    name: string;
    description: string;
    image: string;
  } | null;
}

const MintForm: React.FC<MintFormProps> = ({ isOpen, onClose, onMint, editingNFT }) => {
  const [formData, setFormData] = useState({
    name: editingNFT?.name || '',
    description: editingNFT?.description || '',
    image: editingNFT?.image || ''
  });
  const [isMinting, setIsMinting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Suggested image URLs for quick selection
  const suggestedImages = [
    'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=300&h=300&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=300&h=300&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&h=300&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=300&h=300&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=300&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1607706189992-eae578626c86?w=300&h=300&fit=crop&crop=center'
  ];

  React.useEffect(() => {
    if (editingNFT) {
      setFormData({
        name: editingNFT.name,
        description: editingNFT.description,
        image: editingNFT.image
      });
    } else {
      setFormData({ name: '', description: '', image: '' });
    }
    setErrors({});
  }, [editingNFT, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Badge name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Badge name must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.image.trim()) {
      newErrors.image = 'Image URL is required';
    } else {
      try {
        new URL(formData.image);
      } catch {
        newErrors.image = 'Please enter a valid URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsMinting(true);
    try {
      await onMint(formData);
      setFormData({ name: '', description: '', image: '' });
      onClose();
    } catch (error) {
      console.error('Minting failed:', error);
    } finally {
      setIsMinting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const selectSuggestedImage = (imageUrl: string) => {
    handleInputChange('image', imageUrl);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-secondary-100 dark:border-secondary-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              {editingNFT ? <Upload className="w-6 h-6 text-primary-600" /> : <Zap className="w-6 h-6 text-primary-600" />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-secondary-900 dark:text-white">
                {editingNFT ? 'Edit Badge' : 'Mint New Badge'}
              </h2>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">
                {editingNFT ? 'Update your achievement badge' : 'Create a new achievement badge NFT'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg transition-colors"
            disabled={isMinting}
          >
            <X className="w-5 h-5 text-secondary-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Badge Name */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Badge Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                errors.name
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : 'border-secondary-300 dark:border-secondary-600 focus:border-primary-500 focus:ring-primary-200'
              } dark:bg-secondary-700 dark:text-white focus:outline-none focus:ring-2`}
              placeholder="e.g., React Mastery Certificate"
              disabled={isMinting}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${
                errors.description
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : 'border-secondary-300 dark:border-secondary-600 focus:border-primary-500 focus:ring-primary-200'
              } dark:bg-secondary-700 dark:text-white focus:outline-none focus:ring-2`}
              placeholder="Describe what this badge represents and how it was earned..."
              disabled={isMinting}
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Image URL
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => handleInputChange('image', e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                errors.image
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : 'border-secondary-300 dark:border-secondary-600 focus:border-primary-500 focus:ring-primary-200'
              } dark:bg-secondary-700 dark:text-white focus:outline-none focus:ring-2`}
              placeholder="https://example.com/badge-image.jpg"
              disabled={isMinting}
            />
            {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
            
            {/* Suggested Images */}
            <div className="mt-3">
              <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-2">Quick select:</p>
              <div className="grid grid-cols-6 gap-2">
                {suggestedImages.map((imageUrl, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => selectSuggestedImage(imageUrl)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                      formData.image === imageUrl
                        ? 'border-primary-500 ring-2 ring-primary-200'
                        : 'border-secondary-200 dark:border-secondary-600 hover:border-primary-300'
                    }`}
                    disabled={isMinting}
                  >
                    <img
                      src={imageUrl}
                      alt={`Suggested image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Image Preview */}
          {formData.image && (
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Preview
              </label>
              <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-secondary-200 dark:border-secondary-600">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1547954575-855750c57bd3?w=300&h=300&fit=crop&crop=center';
                  }}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-secondary-300 dark:border-secondary-600 text-secondary-700 dark:text-secondary-300 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors font-medium"
              disabled={isMinting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isMinting}
              className="flex-1 px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
            >
              {isMinting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {editingNFT ? 'Updating...' : 'Minting...'}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  {editingNFT ? 'Update Badge' : 'Mint Badge'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MintForm;