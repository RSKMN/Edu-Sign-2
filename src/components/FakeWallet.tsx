import React, { useState, useEffect } from 'react';
import { Plus, Wallet, Trophy, Moon, Sun, Trash2 } from 'lucide-react';
import NFTCard from '../../../NFTCard';
import MintForm from './MintForm';
import { NFT, getNFTs, addNFT, updateNFT, deleteNFT, simulateMinting, clearWallet, getDarkMode, setDarkMode } from '../lib/LocalStorageUtil';

const FakeWallet: React.FC = () => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMintFormOpen, setIsMintFormOpen] = useState(false);
  const [editingNFT, setEditingNFT] = useState<NFT | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    // Load NFTs and dark mode preference
    const loadData = () => {
      const storedNFTs = getNFTs();
      const darkMode = getDarkMode();
      
      setNfts(storedNFTs);
      setIsDarkMode(darkMode);
      
      // Apply dark mode to document
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      setIsLoading(false);
    };

    loadData();
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleMintNFT = async (data: { name: string; description: string; image: string }) => {
    await simulateMinting();
    
    if (editingNFT) {
      // Update existing NFT
      const updatedNFT = updateNFT(editingNFT.id, data);
      if (updatedNFT) {
        setNfts(prev => prev.map(nft => nft.id === editingNFT.id ? updatedNFT : nft));
      }
      setEditingNFT(null);
    } else {
      // Create new NFT
      const newNFT = addNFT(data);
      setNfts(prev => [...prev, newNFT]);
    }
  };

  const handleEditNFT = (nft: NFT) => {
    setEditingNFT(nft);
    setIsMintFormOpen(true);
  };

  const handleDeleteNFT = (id: string) => {
    setShowDeleteConfirm(id);
  };

  const confirmDelete = (id: string) => {
    if (deleteNFT(id)) {
      setNfts(prev => prev.filter(nft => nft.id !== id));
    }
    setShowDeleteConfirm(null);
  };

  const handleClearWallet = () => {
    if (window.confirm('Are you sure you want to clear all NFTs? This action cannot be undone.')) {
      clearWallet();
      setNfts([]);
    }
  };

  const openMintForm = () => {
    setEditingNFT(null);
    setIsMintFormOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-secondary-900 dark:to-secondary-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600 dark:text-secondary-400">Loading your wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-secondary-900 dark:to-secondary-800 transition-all duration-500">
      {/* Header */}
      <header className="bg-white/80 dark:bg-secondary-800/80 backdrop-blur-md border-b border-secondary-200 dark:border-secondary-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-600 rounded-xl">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-secondary-900 dark:text-white">EduSign</h1>
                <p className="text-xs text-secondary-500 dark:text-secondary-400">NFT Badge Platform</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-secondary-100 dark:bg-secondary-700 rounded-lg">
                <Wallet className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
                <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                  {nfts.length} Badge{nfts.length !== 1 ? 's' : ''}
                </span>
              </div>

              <button
                onClick={toggleDarkMode}
                className="p-2 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg transition-colors"
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
                ) : (
                  <Moon className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
                )}
              </button>

              <button
                onClick={openMintForm}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Mint Badge</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Section */}
        <div className="mb-8">
          <div className="bg-white/60 dark:bg-secondary-800/60 backdrop-blur-sm rounded-2xl p-6 border border-secondary-200 dark:border-secondary-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">
                  Your Achievement Wallet
                </h2>
                <p className="text-secondary-600 dark:text-secondary-400">
                  {nfts.length === 0
                    ? 'Start your learning journey by minting your first badge!'
                    : `You've earned ${nfts.length} achievement badge${nfts.length !== 1 ? 's' : ''}. Keep learning!`
                  }
                </p>
              </div>
              {nfts.length > 0 && (
                <button
                  onClick={handleClearWallet}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Clear all badges"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Clear All</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* NFT Grid */}
        {nfts.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white/60 dark:bg-secondary-800/60 backdrop-blur-sm rounded-2xl p-12 border border-secondary-200 dark:border-secondary-700 max-w-lg mx-auto">
              <Trophy className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
                No Badges Yet
              </h3>
              <p className="text-secondary-600 dark:text-secondary-400 mb-6">
                Start building your achievement collection by minting your first educational badge!
              </p>
              <button
                onClick={openMintForm}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium"
              >
                <Plus className="w-5 h-5" />
                Mint Your First Badge
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {nfts.map((nft) => (
              <NFTCard
                key={nft.id}
                nft={nft}
                onEdit={handleEditNFT}
                onDelete={handleDeleteNFT}
              />
            ))}
          </div>
        )}
      </main>

      {/* Mint Form Modal */}
      <MintForm
        isOpen={isMintFormOpen}
        onClose={() => {
          setIsMintFormOpen(false);
          setEditingNFT(null);
        }}
        onMint={handleMintNFT}
        editingNFT={editingNFT}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-2xl p-6 max-w-md w-full animate-pop-in">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
              Delete Badge?
            </h3>
            <p className="text-secondary-600 dark:text-secondary-400 mb-6">
              Are you sure you want to delete this badge? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-secondary-300 dark:border-secondary-600 text-secondary-700 dark:text-secondary-300 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(showDeleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FakeWallet;
