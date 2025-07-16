export interface QuoteData {
  // Step 1: Property Details
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
  occupants: string;
  postcode: string;
  currentBoiler: string; // 'Combi', 'System', 'Regular', 'Electric', 'Unknown'
  cylinderLocation?: string;
  flueLocation: string;
  flueExtension: string;
  drainNearby: boolean;
  moveBoiler: boolean;
  parkingSituation: string;
  parkingDistance: string;
  floorLevel?: string;
  hasLift?: boolean;
  
  // Step 2: Photos
  photos: string[];
  
  // Step 3: Package Selection
  selectedPackage?: string;
  thermostatUpgrade?: string;
  
  // Step 4: Customer Details
  customerDetails: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postcode: string;
    preferredDate: string;
  };
  
  // Step 5: Multiple appointment options
  secondaryDate?: string;
  tertiaryDate?: string;
  
  // Step 5: Payment
  paymentMethod: string;
  agreedToTerms: boolean;
  smsUpdates: boolean;
  
  // Calculated
  totalPrice?: number;
  quotes?: QuoteOption[];
  
  // Intelligent Quote Engine Results
  intelligentQuote?: any; // Store the full intelligent quote response
  
  // Special handling for Unknown boiler type
  requiresVideoCall?: boolean;
  videoCallScheduled?: boolean;
  additionalPhotosRequired?: boolean;
}

export interface QuoteOption {
  tier: string;
  boilerMake: string;
  boilerModel: string;
  warranty: string;
  basePrice: number;
  isRecommended: boolean;
}

export interface PhotoRequirement {
  id: string;
  title: string;
  description: string;
  mandatory: boolean;
  condition?: string;
  uploaded?: boolean;
}
