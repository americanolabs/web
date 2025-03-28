import { logger } from '@/utils/logger';
import React from 'react';

interface StorageItem {
  value: string;
  timestamp: number;
}

const useGenerateContent = () => {
  const [risk, setRisk] = React.useState<string | null>(null);
  const [riskSaved, setRiskSaved] = React.useState<string | null>(null);
  const [idProtocol, setIdProtocol] = React.useState<string | null>(null);
  const [idProtocolSaved, setIdProtocolSaved] = React.useState<string | null>(null);

  const setItemWithExpiry = (key: string, value: string) => {
    const item: StorageItem = {
      value,
      timestamp: new Date().getTime()
    };
    localStorage.setItem(key, JSON.stringify(item));
  };

  const getItemWithExpiry = (key: string): string | null => {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    try {
      const item: StorageItem = JSON.parse(itemStr);
      const now = new Date().getTime();
      const tenMinutes = 10 * 60 * 1000;

      if (now - item.timestamp > tenMinutes) {
        localStorage.removeItem(key);
        return null;
      }
      return item.value;
    } catch (error) {
      logger.error(`Error parsing localStorage item for key ${key}:`, error);
      localStorage.removeItem(key);
      return null;
    }
  };

  React.useEffect(() => {
    if (risk) {
      setItemWithExpiry("risk", risk);
    }
    
    if (idProtocol && idProtocol.trim() !== '') {
      setItemWithExpiry("idProtocol", idProtocol);
    }
  }, [risk, idProtocol]);

  React.useEffect(() => {
    const savedRisk = getItemWithExpiry("risk");
    if (savedRisk) {
      setRiskSaved(savedRisk);
    }

    const savedIdProtocol = getItemWithExpiry("idProtocol");
    if (savedIdProtocol) {
      setIdProtocolSaved(savedIdProtocol);
    }
  }, []);

  return { 
    risk, 
    setRisk, 
    idProtocol, 
    setIdProtocol, 
    riskSaved, 
    idProtocolSaved 
  };
};

export default useGenerateContent;