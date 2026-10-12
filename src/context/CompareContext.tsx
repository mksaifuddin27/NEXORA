import React, { createContext, useContext, useState } from 'react';
import { Provider } from '../types';

interface CompareContextType {
  compareList: Provider[];
  addToCompare: (provider: Provider) => boolean;
  removeFromCompare: (providerId: number) => void;
  clearCompare: () => void;
  isComparing: (providerId: number) => boolean;
  isCompareModalOpen: boolean;
  setIsCompareModalOpen: (open: boolean) => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [compareList, setCompareList] = useState<Provider[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);

  const addToCompare = (provider: Provider): boolean => {
    if (compareList.some((p) => p.provider_id === provider.provider_id)) {
      return false;
    }
    if (compareList.length >= 4) {
      alert('You can compare a maximum of 4 providers at once.');
      return false;
    }
    setCompareList((prev) => [...prev, provider]);
    return true;
  };

  const removeFromCompare = (providerId: number) => {
    setCompareList((prev) => prev.filter((p) => p.provider_id !== providerId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const isComparing = (providerId: number) => {
    return compareList.some((p) => p.provider_id === providerId);
  };

  return (
    <CompareContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isComparing,
        isCompareModalOpen,
        setIsCompareModalOpen,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};
