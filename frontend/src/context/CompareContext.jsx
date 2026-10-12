import React, { createContext, useContext, useState } from 'react';
const CompareContext = createContext(undefined);
export const CompareProvider = ({ children }) => {
    const [compareList, setCompareList] = useState([]);
    const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
    const addToCompare = (provider) => {
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
    const removeFromCompare = (providerId) => {
        setCompareList((prev) => prev.filter((p) => p.provider_id !== providerId));
    };
    const clearCompare = () => {
        setCompareList([]);
    };
    const isComparing = (providerId) => {
        return compareList.some((p) => p.provider_id === providerId);
    };
    return (<CompareContext.Provider value={{
            compareList,
            addToCompare,
            removeFromCompare,
            clearCompare,
            isComparing,
            isCompareModalOpen,
            setIsCompareModalOpen,
        }}>
      {children}
    </CompareContext.Provider>);
};
export const useCompare = () => {
    const context = useContext(CompareContext);
    if (!context) {
        throw new Error('useCompare must be used within a CompareProvider');
    }
    return context;
};
