import { useState, useEffect } from 'react';
import { QuoteData } from '@/types/quote';

const initialQuoteData: QuoteData = {
  propertyType: '',
  bedrooms: '',
  bathrooms: '',
  occupants: '',
  postcode: '',
  currentBoiler: '',
  cylinderLocation: '',
  flueLocation: '',
  flueExtension: '',
  drainNearby: false,
  moveBoiler: false,
  parkingSituation: '',
  parkingDistance: '',
  floorLevel: '',
  hasLift: false,
  photos: [],
  selectedPackage: '',
  thermostatUpgrade: '',
  customerDetails: {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postcode: '',
    preferredDate: ''
  },
  paymentMethod: '',
  agreedToTerms: false,
  smsUpdates: false,
  totalPrice: 0,
  quotes: [],
  
  // Intelligent Quote Engine Results
  intelligentQuote: undefined,
  
  // Special handling for Unknown boiler type
  requiresVideoCall: false,
  videoCallScheduled: false,
  additionalPhotosRequired: false
};

export function useQuoteData() {
  const [quoteData, setQuoteData] = useState<QuoteData>(() => {
    const saved = localStorage.getItem('quoteData');
    return saved ? JSON.parse(saved) : initialQuoteData;
  });

  const updateQuoteData = (updates: Partial<QuoteData>) => {
    setQuoteData(prev => ({ ...prev, ...updates }));
  };

  const resetQuoteData = () => {
    setQuoteData(initialQuoteData);
    localStorage.removeItem('quoteData');
  };

  useEffect(() => {
    localStorage.setItem('quoteData', JSON.stringify(quoteData));
  }, [quoteData]);

  return {
    quoteData,
    updateQuoteData,
    resetQuoteData
  };
}
