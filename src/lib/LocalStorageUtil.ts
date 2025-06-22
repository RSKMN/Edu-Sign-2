export interface NFT {
  id: string;
  name: string;
  description: string;
  image: string;
  createdAt: string;
}

const WALLET_KEY = 'edusign_wallet';
const DARK_MODE_KEY = 'edusign_dark_mode';

// Predefined NFTs for first-time users
const INITIAL_NFTS: NFT[] = [
  {
    id: 'edusign_001',
    name: 'Python Fundamentals Badge',
    description: 'Awarded for completing the comprehensive Python Fundamentals course on EduSign',
    image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=300&h=300&fit=crop&crop=center',
    createdAt: new Date('2025-01-15T10:30:00.000Z').toISOString()
  },
  {
    id: 'edusign_002',
    name: 'Java OOP Certification',
    description: 'Certified mastery of Object-Oriented Programming principles in Java',
    image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=300&h=300&fit=crop&crop=center',
    createdAt: new Date('2025-02-20T14:15:00.000Z').toISOString()
  },
  {
    id: 'edusign_003',
    name: 'Web Dev Bootcamp Completion',
    description: 'Successfully completed the full-stack web development bootcamp program',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&h=300&fit=crop&crop=center',
    createdAt: new Date('2025-03-10T16:45:00.000Z').toISOString()
  }
];

// Generate unique ID for new NFTs
export const generateNFTId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `edusign_${timestamp}_${random}`;
};

// Get all NFTs from localStorage
export const getNFTs = (): NFT[] => {
  try {
    const stored = localStorage.getItem(WALLET_KEY);
    if (!stored) {
      // First time user - initialize with predefined NFTs
      localStorage.setItem(WALLET_KEY, JSON.stringify(INITIAL_NFTS));
      return INITIAL_NFTS;
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error reading NFTs from localStorage:', error);
    return [];
  }
};

// Add new NFT to localStorage
export const addNFT = (nft: Omit<NFT, 'id' | 'createdAt'>): NFT => {
  try {
    const existingNFTs = getNFTs();
    const newNFT: NFT = {
      ...nft,
      id: generateNFTId(),
      createdAt: new Date().toISOString()
    };
    
    const updatedNFTs = [...existingNFTs, newNFT];
    localStorage.setItem(WALLET_KEY, JSON.stringify(updatedNFTs));
    
    return newNFT;
  } catch (error) {
    console.error('Error adding NFT to localStorage:', error);
    throw new Error('Failed to mint NFT');
  }
};

// Update existing NFT
export const updateNFT = (id: string, updates: Partial<Pick<NFT, 'name' | 'description' | 'image'>>): NFT | null => {
  try {
    const existingNFTs = getNFTs();
    const nftIndex = existingNFTs.findIndex(nft => nft.id === id);
    
    if (nftIndex === -1) {
      return null;
    }
    
    const updatedNFT = { ...existingNFTs[nftIndex], ...updates };
    const updatedNFTs = [...existingNFTs];
    updatedNFTs[nftIndex] = updatedNFT;
    
    localStorage.setItem(WALLET_KEY, JSON.stringify(updatedNFTs));
    return updatedNFT;
  } catch (error) {
    console.error('Error updating NFT:', error);
    return null;
  }
};

// Delete NFT from localStorage
export const deleteNFT = (id: string): boolean => {
  try {
    const existingNFTs = getNFTs();
    const filteredNFTs = existingNFTs.filter(nft => nft.id !== id);
    
    if (filteredNFTs.length === existingNFTs.length) {
      return false; // NFT not found
    }
    
    localStorage.setItem(WALLET_KEY, JSON.stringify(filteredNFTs));
    return true;
  } catch (error) {
    console.error('Error deleting NFT:', error);
    return false;
  }
};

// Clear all NFTs (for testing purposes)
export const clearWallet = (): void => {
  try {
    localStorage.removeItem(WALLET_KEY);
  } catch (error) {
    console.error('Error clearing wallet:', error);
  }
};

// Dark mode utilities
export const getDarkMode = (): boolean => {
  try {
    const stored = localStorage.getItem(DARK_MODE_KEY);
    return stored ? JSON.parse(stored) : false;
  } catch (error) {
    console.error('Error reading dark mode preference:', error);
    return false;
  }
};

export const setDarkMode = (isDark: boolean): void => {
  try {
    localStorage.setItem(DARK_MODE_KEY, JSON.stringify(isDark));
  } catch (error) {
    console.error('Error saving dark mode preference:', error);
  }
};

// Simulate blockchain minting delay
export const simulateMinting = (duration: number = 1500): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, duration));
};