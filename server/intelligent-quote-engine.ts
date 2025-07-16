// Intelligent Quote Engine - Advanced Boiler Sizing & System Selection
// Based on comprehensive property analysis and heat load calculations

import { storage } from './storage';
import { 
  ukHeatingScenarios, 
  findBestMatchingScenario, 
  getBoilerSizeRecommendations, 
  getCylinderSizeRecommendations,
  HeatingScenario 
} from './uk-heating-scenarios';
import { 
  boilerConversionScenarios, 
  findBestConversionScenario, 
  getConversionRecommendations 
} from './boiler-conversion-scenarios';

export interface PropertyAnalysis {
  bedrooms: string;
  bathrooms: string;
  occupants: string;
  propertyType: string;
  currentBoiler: string;
  flueLocation?: string;
  drainNearby?: string;
  moveBoiler?: string;
  postcode: string;
}

export interface IntelligentQuoteResult {
  quotes: Array<{
    tier: string;
    boilerMake: string;
    boilerModel: string;
    boilerType: string;
    warranty: string;
    basePrice: number;
    isRecommended: boolean;
    kWOutput: number;
    flowRate: number;
    efficiency: string;
  }>;
  analysis: {
    recommendedBoilerSize: number;
    recommendedBoilerType: 'Combi' | 'System' | 'Regular';
    cylinderCapacity?: number;
    heatLoadCalculation: number;
    hotWaterDemand: number;
    simultaneousUsageScore: number;
    propertyComplexity: 'Simple' | 'Medium' | 'Complex';
    jobType: string;
    installationMultiplier: number;
  };
  priceBreakdown: {
    boilerPrice: number;
    labourPrice: number;
    cylinderPrice: number;
    sundryPrice: number;
    flueExtensionPrice: number;
    condensatePumpPrice: number;
    thermostatPrice: number;
    parkingFee: number;
    accessFee: number;
    locationMultiplier: number;
    subtotal: number;
    vatAmount: number;
    totalPrice: number;
  };
  recommendations: {
    systemExplanation: string;
    whyThisBoiler: string;
    alternativeOptions: string[];
    installationNotes: string[];
  };
}

// Professional heat load calculation following London market standards
export function calculateHeatLoad(analysis: PropertyAnalysis): number {
  const bedroomCount = parseInt(analysis.bedrooms.replace('+', '')) || 1;
  const bathroomCount = parseInt(analysis.bathrooms.replace('+', '')) || 1;
  const occupantCount = parseInt(analysis.occupants.replace('+', '')) || 2;
  
  // Professional radiator count estimation based on London property analysis
  // Each bedroom: 1 radiator
  // Each bathroom: 1 towel rail/panel radiator  
  // Living areas: 2-3 radiators (living room, kitchen, dining room)
  // Hallways: 1 radiator for houses, 0.5 for flats
  // Conservatory/utility: Additional if large property
  
  let radiatorCount = bedroomCount + bathroomCount;
  
  if (analysis.propertyType === 'House') {
    // Houses typically have more living spaces
    radiatorCount += 3; // Living room, kitchen, dining room
    radiatorCount += 1; // Hallway
    
    // Large houses may have additional spaces
    if (bedroomCount >= 4) radiatorCount += 1; // Study/utility
    if (bedroomCount >= 5) radiatorCount += 1; // Conservatory/additional reception
  } else {
    // Flats typically have fewer living spaces
    radiatorCount += 2; // Living room, kitchen
    radiatorCount += 0.5; // Hallway (smaller)
  }
  
  // Professional heat loss calculation per radiator
  // Based on London property standards: 1.5-2.5kW per radiator
  let heatLoad = 0;
  
  if (analysis.propertyType === 'House') {
    // Houses: higher heat loss due to external walls, larger rooms
    heatLoad = radiatorCount * 2.0;
    
    // Additional heat loss for larger properties
    if (bedroomCount >= 4) heatLoad += 3; // Additional heat loss
    if (bedroomCount >= 5) heatLoad += 5; // Significant additional loss
  } else {
    // Flats: better insulated, shared walls reduce heat loss
    heatLoad = radiatorCount * 1.7;
  }
  
  // Apply minimum heat load standards for safety margins
  const minHeatLoadByProperty = {
    1: 12, // 1 bedroom minimum
    2: 18, // 2 bedroom minimum  
    3: 24, // 3 bedroom minimum
    4: 30, // 4 bedroom minimum
    5: 36  // 5+ bedroom minimum
  };
  
  const minHeatLoad = minHeatLoadByProperty[Math.min(bedroomCount, 5)] || 36;
  heatLoad = Math.max(heatLoad, minHeatLoad);
  
  return Math.round(heatLoad);
}

// Calculate hot water demand based on usage patterns
export function calculateHotWaterDemand(analysis: PropertyAnalysis): number {
  const bathroomCount = parseInt(analysis.bathrooms.replace('+', '')) || 1;
  const occupantCount = parseInt(analysis.occupants.replace('+', '')) || 2;
  
  // Calculate based on peak simultaneous usage
  // Each bathroom can use 8-12L/min, each person needs 2-3L/min for washing
  const peakBathroomDemand = bathroomCount * 10; // L/min
  const peakPersonalDemand = occupantCount * 2.5; // L/min
  
  // Convert to kW demand (rough conversion: 1L/min ≈ 2.5kW for heating)
  const totalLitersPerMinute = Math.max(peakBathroomDemand, peakPersonalDemand);
  const hotWaterDemand = totalLitersPerMinute * 2.5;
  
  // Add buffer for simultaneous usage in multi-bathroom properties
  const simultaneousUsageBuffer = bathroomCount > 1 ? 
    Math.min(bathroomCount * 2, 8) : 0;
  
  return Math.round(hotWaterDemand + simultaneousUsageBuffer);
}

// Enhanced Genius Boiler Type Selection - Critical System Logic with User Preference
export function determineOptimalBoilerType(analysis: PropertyAnalysis): 'Combi' | 'System' | 'Regular' {
  const bedroomCount = parseInt(analysis.bedrooms.replace('+', '')) || 1;
  const bathroomCount = parseInt(analysis.bathrooms.replace('+', '')) || 1;
  const occupantCount = parseInt(analysis.occupants.replace('+', '')) || 2;
  
  // RESPECT USER PREFERENCE: If user has Combi and wants to keep it, try to accommodate
  const currentBoilerType = analysis.currentBoiler.toLowerCase();
  const userPrefersCombi = currentBoilerType.includes('combi');
  
  // GENIUS SYSTEM CORE LOGIC: Hot Water Demand Score
  // This is the critical calculation that determines system suitability
  // Each bathroom/shower adds significant simultaneous demand
  const demandScore = bathroomCount + (bathroomCount * 0.5); // Account for likely shower usage
  
  // COMBI TIPPING POINT: Professional UK Standards
  // Based on simultaneous hot water usage capability
  // Score > 2: Combi becomes professionally unsound recommendation
  const COMBI_TIPPING_POINT = 2;
  
  console.log(`🔥 GENIUS SYSTEM ANALYSIS:`, {
    bedrooms: bedroomCount,
    bathrooms: bathroomCount,
    occupants: occupantCount,
    demandScore,
    tippingPoint: COMBI_TIPPING_POINT,
    userPrefersCombi
  });
  
  // MANDATORY SYSTEM BOILER CONDITIONS (Only for extreme cases)
  // These scenarios absolutely require System boiler for professional standards
  
  // 1. Extreme bathroom count (6+ bathrooms = automatic system)
  if (bathroomCount >= 6) {
    console.log(`🚨 MANDATORY SYSTEM: 6+ bathrooms detected (${bathroomCount})`);
    return 'System';
  }
  
  // 2. Very large house with high occupancy (likely simultaneous usage)
  if (bedroomCount >= 6 && occupantCount >= 6) {
    console.log(`🚨 MANDATORY SYSTEM: Very large house (${bedroomCount} bed) with high occupancy (${occupantCount} people)`);
    return 'System';
  }
  
  // USER PREFERENCE CONSIDERATION: Try to accommodate user's existing system preference
  if (userPrefersCombi) {
    // Allow high-output combi for challenging scenarios if user prefers it
    if (bathroomCount >= 3 && bathroomCount <= 4) {
      console.log(`⚠️  HIGH-OUTPUT COMBI: User prefers Combi, recommending 35-42kW high-output combi for ${bathroomCount} bathrooms`);
      return 'Combi';
    }
    
    // Allow combi for smaller properties regardless of bathroom count
    if (bedroomCount <= 2) {
      console.log(`✅ COMBI SUITABLE: User prefers Combi, small property (${bedroomCount} bed, ${bathroomCount} bath)`);
      return 'Combi';
    }
    
    // For medium properties, still allow combi if user prefers it
    if (bedroomCount <= 3 && bathroomCount <= 3) {
      console.log(`✅ COMBI PREFERENCE: User prefers Combi, medium property (${bedroomCount} bed, ${bathroomCount} bath)`);
      return 'Combi';
    }
  }
  
  // COMBI SUITABILITY ASSESSMENT
  // Only recommend combi if genuinely suitable
  
  // 1 Bathroom properties: Generally suitable for combi
  if (bathroomCount === 1) {
    // Exception: Very large single bathroom properties  
    if (bedroomCount >= 5 && occupantCount >= 5) {
      console.log(`⚠️  SYSTEM RECOMMENDED: Large single bathroom property with high occupancy`);
      return 'System';
    }
    console.log(`✅ COMBI SUITABLE: Single bathroom property`);
    return 'Combi';
  }
  
  // 2 Bathrooms: Critical assessment zone
  if (bathroomCount === 2) {
    // High likelihood of simultaneous usage scenarios
    const simultaneousUsageLikely = (
      occupantCount >= 4 || // Family with teenagers/children
      (occupantCount >= 3 && bedroomCount >= 3) || // Multi-generational household
      (bedroomCount >= 4) // Large house implies high usage patterns
    );
    
    if (simultaneousUsageLikely) {
      console.log(`⚠️  SYSTEM RECOMMENDED: 2 bathrooms with high simultaneous usage likelihood`);
      return 'System';
    } else {
      // High-power combi can handle 2 bathrooms with careful sizing
      console.log(`✅ HIGH-POWER COMBI: 2 bathrooms with low simultaneous usage`);
      return 'Combi';
    }
  }
  
  // LEGACY SYSTEM CONSIDERATIONS
  // Respect existing infrastructure where appropriate
  if (
    analysis.currentBoiler.toLowerCase().includes('regular') ||
    analysis.currentBoiler.toLowerCase().includes('conventional') ||
    analysis.currentBoiler.toLowerCase().includes('heat only')
  ) {
    // Large properties with existing regular systems
    if (bathroomCount >= 2 || bedroomCount >= 4) {
      console.log(`🔧 REGULAR SYSTEM: Maintaining existing regular system for large property`);
      return 'Regular';
    }
  }
  
  // PREMIUM PROPERTY CONSIDERATIONS
  // Very large properties require maximum capacity
  if (bedroomCount >= 5 && bathroomCount >= 3) {
    console.log(`🏰 REGULAR SYSTEM: Premium property requires maximum capacity`);
    return 'Regular';
  }
  
  // DEFAULT FALLBACK
  console.log(`✅ DEFAULT COMBI: Standard small property`);
  return 'Combi';
}

// Enhanced boiler sizing using conversion scenarios + UK heating database + professional standards
export function calculateOptimalBoilerSize(analysis: PropertyAnalysis): number {
  const heatLoad = calculateHeatLoad(analysis);
  const hotWaterDemand = calculateHotWaterDemand(analysis);
  const boilerType = determineOptimalBoilerType(analysis);
  const bedroomCount = parseInt(analysis.bedrooms.replace('+', '')) || 1;
  const bathroomCount = parseInt(analysis.bathrooms.replace('+', '')) || 1;
  const occupantCount = parseInt(analysis.occupants.replace('+', '')) || 2;
  
  console.log(`🔧 BOILER SIZING ANALYSIS:`, {
    heatLoad,
    hotWaterDemand,
    boilerType,
    bedrooms: bedroomCount,
    bathrooms: bathroomCount,
    occupants: occupantCount
  });
  
  // PRIORITY 1: Check conversion scenarios database for proven sizing
  const conversionRecommendation = getConversionRecommendations(
    bedroomCount,
    bathroomCount,
    occupantCount,
    analysis.currentBoiler
  );
  
  if (conversionRecommendation.matchedScenario) {
    console.log(`✅ CONVERSION SCENARIO MATCH:`, {
      scenario: conversionRecommendation.matchedScenario.id,
      system: conversionRecommendation.recommendedSystem,
      size: conversionRecommendation.boilerSize,
      cylinder: conversionRecommendation.cylinderSize
    });
    return conversionRecommendation.boilerSize;
  }
  
  // PRIORITY 2: Try UK heating scenarios database for fallback
  const bestMatch = findBestMatchingScenario(
    bedroomCount,
    bathroomCount,
    occupantCount,
    analysis.propertyType as 'House' | 'Flat',
    boilerType
  );
  
  if (bestMatch) {
    // Use real-world scenario data as primary recommendation
    return bestMatch.boilerPowerKw;
  }
  
  // Fallback to professional standards with scenario-based recommendations
  const sizeRecommendations = getBoilerSizeRecommendations(
    bedroomCount,
    bathroomCount,
    occupantCount,
    boilerType
  );
  
  let recommendedSize = sizeRecommendations.recommended;
  
  // Apply professional London market adjustments
  if (boilerType === 'Combi') {
    // Combi boilers: DHW output is critical for performance
    if (bedroomCount <= 2 && bathroomCount <= 1) {
      // 1-2 Bedroom Flat/House (Up to 10 radiators, 1 bathroom)
      recommendedSize = Math.max(24, Math.min(27, Math.max(recommendedSize, heatLoad + 6)));
    } else if (bedroomCount <= 3 && bathroomCount <= 2) {
      // 2-3 Bedroom House (10-15 radiators, 1-2 bathrooms)
      recommendedSize = Math.max(28, Math.min(34, Math.max(recommendedSize, heatLoad + 8)));
    } else {
      // 4+ Bedroom House (15-20 radiators, 2+ bathrooms)
      recommendedSize = Math.max(35, Math.min(42, Math.max(recommendedSize, heatLoad + 10)));
    }
    
    // Ensure adequate DHW performance for multiple bathrooms
    if (bathroomCount >= 2) {
      recommendedSize = Math.max(recommendedSize, 32);
    }
    
  } else if (boilerType === 'System' || boilerType === 'Regular') {
    // System/Regular boilers: CH output is primary requirement
    if (bedroomCount <= 2) {
      // 1-2 Bedroom properties  
      recommendedSize = Math.max(18, Math.min(30, Math.max(recommendedSize, heatLoad + 2)));
    } else if (bedroomCount <= 3) {
      // 2-3 Bedroom properties
      recommendedSize = Math.max(24, Math.min(35, Math.max(recommendedSize, heatLoad + 3)));
    } else {
      // 4+ Bedroom properties
      recommendedSize = Math.max(28, Math.min(50, Math.max(recommendedSize, heatLoad + 4)));
    }
    
    // Ensure adequate heating for larger properties
    if (bedroomCount >= 4) {
      recommendedSize = Math.max(recommendedSize, 28);
    }
    if (bedroomCount >= 5) {
      recommendedSize = Math.max(recommendedSize, 30);
    }
  }
  
  // Round to nearest standard boiler size
  if (recommendedSize <= 24) return 24;
  if (recommendedSize <= 28) return 28;
  if (recommendedSize <= 30) return 30;
  if (recommendedSize <= 32) return 32;
  if (recommendedSize <= 35) return 35;
  if (recommendedSize <= 40) return 40;
  if (recommendedSize <= 42) return 42;
  if (recommendedSize <= 50) return 50;
  
  return 50; // Maximum for large properties
}

// Enhanced cylinder sizing using conversion scenarios + UK heating database + professional standards
export function calculateCylinderCapacity(analysis: PropertyAnalysis): number {
  const boilerType = determineOptimalBoilerType(analysis);
  
  if (boilerType === 'Combi') return 0;
  
  const bedroomCount = parseInt(analysis.bedrooms.replace('+', '')) || 1;
  const bathroomCount = parseInt(analysis.bathrooms.replace('+', '')) || 1;
  const occupantCount = parseInt(analysis.occupants.replace('+', '')) || 2;
  
  console.log(`🏺 CYLINDER SIZING ANALYSIS:`, {
    bedrooms: bedroomCount,
    bathrooms: bathroomCount,
    occupants: occupantCount,
    boilerType
  });
  
  // PRIORITY 1: Check conversion scenarios for proven cylinder sizing
  const conversionRecommendation = getConversionRecommendations(
    bedroomCount,
    bathroomCount,
    occupantCount,
    analysis.currentBoiler
  );
  
  if (conversionRecommendation.cylinderSize) {
    console.log(`✅ CONVERSION SCENARIO CYLINDER:`, {
      size: conversionRecommendation.cylinderSize,
      reasoning: conversionRecommendation.reasoning
    });
    return conversionRecommendation.cylinderSize;
  }
  
  // PRIORITY 2: Try UK heating scenarios database
  const bestMatch = findBestMatchingScenario(
    bedroomCount,
    bathroomCount,
    occupantCount,
    analysis.propertyType as 'House' | 'Flat',
    boilerType
  );
  
  if (bestMatch && bestMatch.cylinderSizeL) {
    console.log(`✅ UK SCENARIO CYLINDER:`, {
      size: bestMatch.cylinderSizeL,
      scenario: bestMatch.scenarioId
    });
    return bestMatch.cylinderSizeL;
  }
  
  // Fallback to professional standards with scenario-based recommendations
  const sizeRecommendations = getCylinderSizeRecommendations(
    bedroomCount,
    bathroomCount,
    occupantCount
  );
  
  let recommendedCapacity = sizeRecommendations.recommended;
  
  // Apply professional London market adjustments
  // Rule of thumb: 35-45 litres per person + bathroom demand
  
  // Size by property profile (from London market analysis)
  if (bedroomCount <= 1 && bathroomCount <= 1) {
    // 1 Bed / 1 Bath: 1-2 People  
    recommendedCapacity = Math.max(120, Math.min(150, Math.max(recommendedCapacity, occupantCount * 45 + bathroomCount * 30)));
  } else if (bedroomCount <= 2 && bathroomCount <= 1) {
    // 2 Beds / 1 Bath: 2-3 People
    recommendedCapacity = Math.max(150, Math.min(180, Math.max(recommendedCapacity, occupantCount * 42 + bathroomCount * 35)));
  } else if (bedroomCount <= 3 && bathroomCount <= 2) {
    // 3 Beds / 2 Baths: 3-4 People
    recommendedCapacity = Math.max(180, Math.min(250, Math.max(recommendedCapacity, occupantCount * 40 + bathroomCount * 40)));
  } else if (bedroomCount <= 4 && bathroomCount <= 2) {
    // 4 Beds / 2 Baths: 4-5 People
    recommendedCapacity = Math.max(210, Math.min(300, Math.max(recommendedCapacity, occupantCount * 38 + bathroomCount * 45)));
  } else {
    // 5+ Beds / 3+ Baths: 5+ People
    recommendedCapacity = Math.max(300, Math.max(recommendedCapacity, occupantCount * 35 + bathroomCount * 50));
  }
  
  // Additional capacity for simultaneous usage in multi-bathroom properties
  if (bathroomCount >= 2) {
    const simultaneousBuffer = Math.min(bathroomCount * 30, 90);
    recommendedCapacity += simultaneousBuffer;
  }
  
  // Peak demand buffer for larger households
  if (occupantCount >= 4) {
    const peakBuffer = Math.min((occupantCount - 3) * 20, 60);
    recommendedCapacity += peakBuffer;
  }
  
  // Round to standard UK cylinder sizes
  if (recommendedCapacity <= 125) return 120;
  if (recommendedCapacity <= 145) return 150;
  if (recommendedCapacity <= 165) return 170;
  if (recommendedCapacity <= 195) return 210;
  if (recommendedCapacity <= 235) return 250;
  if (recommendedCapacity <= 285) return 300;
  if (recommendedCapacity <= 335) return 350;
  if (recommendedCapacity <= 435) return 400;
  
  return 500; // Maximum for large properties
}

// Determine job complexity and installation multiplier
export function calculateJobComplexity(analysis: PropertyAnalysis): {
  complexity: 'Simple' | 'Medium' | 'Complex';
  multiplier: number;
  jobType: string;
} {
  const currentBoilerType = analysis.currentBoiler.toLowerCase();
  const recommendedType = determineOptimalBoilerType(analysis);
  
  let complexity: 'Simple' | 'Medium' | 'Complex' = 'Simple';
  let multiplier = 1.0;
  let jobType = '';
  
  // Same boiler type replacement
  if (
    (currentBoilerType.includes('combi') && recommendedType === 'Combi') ||
    (currentBoilerType.includes('system') && recommendedType === 'System') ||
    (currentBoilerType.includes('regular') && recommendedType === 'Regular')
  ) {
    complexity = 'Simple';
    multiplier = 1.0;
    jobType = `${recommendedType} Boiler Replacement (Like-for-Like)`;
  }
  // Combi to System conversion
  else if (currentBoilerType.includes('combi') && recommendedType === 'System') {
    complexity = 'Medium';
    multiplier = 1.3;
    jobType = 'Combi to System Boiler Conversion';
  }
  // System to Combi conversion
  else if (currentBoilerType.includes('system') && recommendedType === 'Combi') {
    complexity = 'Medium';
    multiplier = 1.3;
    jobType = 'System to Combi Boiler Conversion';
  }
  // Regular to Combi conversion
  else if (currentBoilerType.includes('regular') && recommendedType === 'Combi') {
    complexity = 'Complex';
    multiplier = 1.7;
    jobType = 'Regular to Combi Boiler Conversion';
  }
  // Regular to System conversion
  else if (currentBoilerType.includes('regular') && recommendedType === 'System') {
    complexity = 'Medium';
    multiplier = 1.2;
    jobType = 'Regular to System Boiler Conversion';
  }
  // Unknown boiler type
  else {
    complexity = 'Medium';
    multiplier = 1.4;
    jobType = 'Boiler Replacement (Survey Required)';
  }
  
  return { complexity, multiplier, jobType };
}

// Main intelligent quote calculation function
export async function calculateIntelligentQuote(analysis: PropertyAnalysis): Promise<IntelligentQuoteResult> {
  try {
    // Get pricing data from database
    const [boilers, labourCosts, sundries, locations] = await Promise.all([
      storage.getBoilers(),
      storage.getLabourCosts(),
      storage.getSundries(),
      storage.getLocations()
    ]);
    
    // Calculate system requirements
    const recommendedSize = calculateOptimalBoilerSize(analysis);
    const recommendedType = determineOptimalBoilerType(analysis);
    const cylinderCapacity = calculateCylinderCapacity(analysis);
    const heatLoad = calculateHeatLoad(analysis);
    const hotWaterDemand = calculateHotWaterDemand(analysis);
    const jobComplexity = calculateJobComplexity(analysis);
    
    // Calculate simultaneous usage score
    const bathroomCount = parseInt(analysis.bathrooms.replace('+', '')) || 1;
    const occupantCount = parseInt(analysis.occupants.replace('+', '')) || 2;
    const simultaneousUsageScore = bathroomCount > 1 && occupantCount > 2 ? 
      (bathroomCount * occupantCount) : 0;
    
    // Filter suitable boilers
    const suitableBoilers = boilers.filter(boiler => {
      if (boiler.boilerType !== recommendedType) return false;
      
      // For combi boilers, match DHW output closely
      if (recommendedType === 'Combi') {
        return boiler.dhwKw >= recommendedSize && boiler.dhwKw <= (recommendedSize + 6);
      }
      
      // For system/regular boilers, focus on heating output
      return boiler.dhwKw >= (recommendedSize - 3) && boiler.dhwKw <= (recommendedSize + 5);
    });
    
    // Group by tier and select best options
    const budgetBoilers = suitableBoilers.filter(b => b.tier === 'Budget');
    const midRangeBoilers = suitableBoilers.filter(b => b.tier === 'Mid-Range');
    const premiumBoilers = suitableBoilers.filter(b => b.tier === 'Premium');
    
    const standardBoiler = budgetBoilers[0] || midRangeBoilers[0] || suitableBoilers[0];
    const premiumBoiler = midRangeBoilers[0] || premiumBoilers[0] || suitableBoilers[0];
    const luxuryBoiler = premiumBoilers[0] || suitableBoilers[0];
    
    // Get location multiplier
    const locationData = await storage.getLocationByPostcode(analysis.postcode);
    const locationMultiplier = locationData?.priceMultiplier || 1.0;
    
    // Get labour costs
    const labourCost = await storage.getLabourCostByType(jobComplexity.jobType, 'Standard');
    const premiumLabourCost = await storage.getLabourCostByType(jobComplexity.jobType, 'Premium');
    
    const baseLabourPrice = labourCost?.price || 135000; // £1,350 default
    const premiumLabourPrice = premiumLabourCost?.price || 160000; // £1,600 default
    
    // Professional cylinder pricing based on London market rates
    const cylinderPrice = cylinderCapacity > 0 ? 
      (cylinderCapacity <= 150 ? 110000 : // £1,100 for 120-150L
       cylinderCapacity <= 180 ? 140000 : // £1,400 for 180L  
       cylinderCapacity <= 210 ? 170000 : // £1,700 for 210L
       cylinderCapacity <= 250 ? 200000 : // £2,000 for 250L
       cylinderCapacity <= 300 ? 230000 : // £2,300 for 300L
       270000) : 0; // £2,700 for 350L
    
    // Professional sundries based on London market standards
    const magneticSystemFilter = 15000; // £150 - Essential for warranty
    const chemicalFlush = 12000; // £120 - BS 7593:2019 requirement
    const flueKit = 10000; // £100 - Professional flue components
    const smartThermostat = 20000; // £200 - Boiler Plus compliance
    const trvs = 8000; // £80 - Thermostatic radiator valves
    const condensatePumpPrice = analysis.drainNearby === 'No' ? 25000 : 0;
    
    const basicSundries = magneticSystemFilter + chemicalFlush + flueKit + trvs;
    const premiumSundries = basicSundries + smartThermostat;
    
    // Calculate final prices with all multipliers
    const standardLabourFinal = Math.round(baseLabourPrice * jobComplexity.multiplier * Number(locationMultiplier));
    const premiumLabourFinal = Math.round(premiumLabourPrice * jobComplexity.multiplier * Number(locationMultiplier));
    
    const standardSubtotal = (standardBoiler?.supplyPrice || 120000) + standardLabourFinal + 
                           basicSundries + cylinderPrice + condensatePumpPrice;
    const premiumSubtotal = (premiumBoiler?.supplyPrice || 150000) + premiumLabourFinal + 
                          basicSundries + cylinderPrice + condensatePumpPrice;
    const luxurySubtotal = (luxuryBoiler?.supplyPrice || 180000) + premiumLabourFinal + 
                         premiumSundries + cylinderPrice + condensatePumpPrice;
    
    // Add VAT
    const standardVat = Math.round(standardSubtotal * 0.2);
    const premiumVat = Math.round(premiumSubtotal * 0.2);
    const luxuryVat = Math.round(luxurySubtotal * 0.2);
    
    // Build quote results
    const quotes = [
      {
        tier: 'Standard',
        boilerMake: standardBoiler?.make || 'Baxi',
        boilerModel: standardBoiler?.model || '800 Combi 2 24kW',
        boilerType: recommendedType,
        warranty: `${standardBoiler?.warrantyYears || 10} years`,
        basePrice: standardSubtotal + standardVat,
        isRecommended: true,
        kWOutput: standardBoiler?.dhwKw || recommendedSize,
        flowRate: standardBoiler?.flowRateLpm || (recommendedType === 'Combi' ? 12 : 20),
        efficiency: standardBoiler?.efficiencyRating || 'A'
      },
      {
        tier: 'Premium',
        boilerMake: premiumBoiler?.make || 'Ideal',
        boilerModel: premiumBoiler?.model || 'Logic Max Combi2 C28',
        boilerType: recommendedType,
        warranty: `${premiumBoiler?.warrantyYears || 10} years`,
        basePrice: premiumSubtotal + premiumVat,
        isRecommended: false,
        kWOutput: premiumBoiler?.dhwKw || recommendedSize,
        flowRate: premiumBoiler?.flowRateLpm || (recommendedType === 'Combi' ? 14 : 22),
        efficiency: premiumBoiler?.efficiencyRating || 'A'
      },
      {
        tier: 'Luxury',
        boilerMake: luxuryBoiler?.make || 'Vaillant',
        boilerModel: luxuryBoiler?.model || 'EcoTec Pro 32kW',
        boilerType: recommendedType,
        warranty: `${luxuryBoiler?.warrantyYears || 12} years`,
        basePrice: luxurySubtotal + luxuryVat,
        isRecommended: false,
        kWOutput: luxuryBoiler?.dhwKw || recommendedSize,
        flowRate: luxuryBoiler?.flowRateLpm || (recommendedType === 'Combi' ? 16 : 24),
        efficiency: luxuryBoiler?.efficiencyRating || 'A'
      }
    ];
    
    // Generate system explanations
    const systemExplanation = generateSystemExplanation(recommendedType, recommendedSize, cylinderCapacity, analysis);
    const whyThisBoiler = generateBoilerExplanation(recommendedType, recommendedSize, heatLoad, hotWaterDemand);
    const alternativeOptions = generateAlternativeOptions(recommendedType, analysis);
    const installationNotes = generateInstallationNotes(jobComplexity, analysis);
    
    return {
      quotes,
      analysis: {
        recommendedBoilerSize: recommendedSize,
        recommendedBoilerType: recommendedType,
        cylinderCapacity,
        heatLoadCalculation: heatLoad,
        hotWaterDemand,
        simultaneousUsageScore,
        propertyComplexity: jobComplexity.complexity,
        jobType: jobComplexity.jobType,
        installationMultiplier: jobComplexity.multiplier
      },
      priceBreakdown: {
        boilerPrice: standardBoiler?.supplyPrice || 120000,
        labourPrice: standardLabourFinal,
        cylinderPrice,
        sundryPrice: basicSundries,
        flueExtensionPrice: 0,
        condensatePumpPrice,
        thermostatPrice: 0,
        parkingFee: 0,
        accessFee: 0,
        locationMultiplier: Number(locationMultiplier),
        subtotal: standardSubtotal,
        vatAmount: standardVat,
        totalPrice: standardSubtotal + standardVat
      },
      recommendations: {
        systemExplanation,
        whyThisBoiler,
        alternativeOptions,
        installationNotes
      }
    };
    
  } catch (error) {
    console.error('Error calculating intelligent quote:', error);
    throw new Error('Failed to calculate intelligent quote');
  }
}

// Helper functions for generating explanations
function generateSystemExplanation(boilerType: string, size: number, cylinderCapacity: number, analysis: PropertyAnalysis): string {
  const bedrooms = analysis.bedrooms;
  const bathrooms = parseInt(analysis.bathrooms.replace('+', '')) || 1;
  const occupants = parseInt(analysis.occupants.replace('+', '')) || 2;
  const bedroomCount = parseInt(analysis.bedrooms.replace('+', '')) || 1;
  const bathroomCount = parseInt(analysis.bathrooms.replace('+', '')) || 1;
  const occupantCount = parseInt(analysis.occupants.replace('+', '')) || 2;
  
  // Try to find matching scenario for enhanced explanation
  const bestMatch = findBestMatchingScenario(
    bedroomCount,
    bathroomCount,
    occupantCount,
    analysis.propertyType as 'House' | 'Flat',
    boilerType as 'Combi' | 'System' | 'Regular'
  );
  
  if (boilerType === 'Combi') {
    let explanation = `A ${size}kW combi boiler is ideal for your ${analysis.propertyType.toLowerCase()} with ${bedrooms} bedroom(s) and ${bathrooms} bathroom(s). It provides instant hot water without needing a separate cylinder, saving space and installation costs.`;
    
    if (bestMatch) {
      explanation += ` This specification matches proven installations in similar ${bestMatch.propertyDescription.toLowerCase()} properties across the UK.`;
    }
    
    return explanation;
  } else if (boilerType === 'System') {
    let explanation = `A ${size}kW system boiler with ${cylinderCapacity}L cylinder is recommended for your property with ${bathrooms} bathroom(s) and ${occupants} occupant(s). This provides excellent hot water pressure and flow rates for simultaneous use across multiple outlets.`;
    
    if (bestMatch) {
      explanation += ` This configuration matches proven installations in similar ${bestMatch.propertyDescription.toLowerCase()} properties across the UK.`;
    }
    
    return explanation;
  } else {
    let explanation = `A ${size}kW regular boiler with ${cylinderCapacity}L cylinder maintains your existing system configuration while providing reliable heating and hot water for your ${bedrooms} bedroom ${analysis.propertyType.toLowerCase()}.`;
    
    if (bestMatch) {
      explanation += ` This specification is based on successful installations in comparable ${bestMatch.propertyDescription.toLowerCase()} properties.`;
    }
    
    return explanation;
  }
}

function generateBoilerExplanation(boilerType: string, size: number, heatLoad: number, hotWaterDemand: number): string {
  const scenarios = ukHeatingScenarios.filter(s => s.boilerPowerKw === size && s.systemType.toLowerCase().includes(boilerType.toLowerCase()));
  
  let explanation = `This ${size}kW ${boilerType.toLowerCase()} boiler is sized based on your calculated heat load of ${heatLoad}kW and hot water demand of ${hotWaterDemand}kW. The selected output ensures efficient operation while meeting peak demand periods.`;
  
  if (scenarios.length > 0) {
    explanation += ` This boiler size is proven effective across ${scenarios.length} similar UK property installations.`;
  }
  
  return explanation;
}

function generateAlternativeOptions(boilerType: string, analysis: PropertyAnalysis): string[] {
  const alternatives = [];
  const bedroomCount = parseInt(analysis.bedrooms.replace('+', '')) || 1;
  const bathroomCount = parseInt(analysis.bathrooms.replace('+', '')) || 1;
  const occupantCount = parseInt(analysis.occupants.replace('+', '')) || 2;
  
  // Find alternative scenarios based on property profile
  const alternativeScenarios = ukHeatingScenarios.filter(scenario => {
    const desc = scenario.propertyDescription.toLowerCase();
    const roughMatch = desc.includes(`${bedroomCount}-bed`) || desc.includes(`${bedroomCount + 1}-bed`) || desc.includes(`${bedroomCount - 1}-bed`);
    const differentSystem = !scenario.systemType.toLowerCase().includes(boilerType.toLowerCase());
    return roughMatch && differentSystem;
  });
  
  if (boilerType === 'Combi') {
    alternatives.push('System boiler with cylinder for higher flow rates');
    alternatives.push('Electric shower installation for additional hot water');
    
    // Add specific alternative based on scenarios
    const systemAlternatives = alternativeScenarios.filter(s => s.systemType.toLowerCase().includes('system'));
    if (systemAlternatives.length > 0) {
      const avgPower = Math.round(systemAlternatives.reduce((sum, s) => sum + s.boilerPowerKw, 0) / systemAlternatives.length);
      alternatives.push(`${avgPower}kW system boiler based on similar UK installations`);
    }
  } else if (boilerType === 'System') {
    alternatives.push('High-output combi boiler for space saving');
    alternatives.push('Larger cylinder for extended hot water storage');
    
    // Add specific alternative based on scenarios
    const combiAlternatives = alternativeScenarios.filter(s => s.systemType.toLowerCase().includes('combi'));
    if (combiAlternatives.length > 0) {
      const avgPower = Math.round(combiAlternatives.reduce((sum, s) => sum + s.boilerPowerKw, 0) / combiAlternatives.length);
      alternatives.push(`${avgPower}kW combi boiler based on similar UK installations`);
    }
  } else {
    alternatives.push('System boiler conversion for improved efficiency');
    alternatives.push('Combi boiler conversion for space saving');
  }
  
  return alternatives;
}

function generateInstallationNotes(jobComplexity: { complexity: string; multiplier: number; jobType: string }, analysis: PropertyAnalysis): string[] {
  const notes = [];
  
  if (jobComplexity.complexity === 'Complex') {
    notes.push('Complex installation requiring pipework modifications');
    notes.push('Additional time required for system conversion');
  }
  
  if (analysis.drainNearby === 'No') {
    notes.push('Condensate pump required due to lack of nearby drain');
  }
  
  if (analysis.moveBoiler === 'Yes') {
    notes.push('Boiler relocation will require additional pipework and gas supply modifications');
  }
  
  // Add professional parking note for paid parking areas
  if (analysis.parkingSituation && analysis.parkingSituation.toLowerCase().includes('paid')) {
    notes.push('PARKING ARRANGEMENTS: This property is located in a paid parking area. Parking costs are not included in the quotation. Our engineer will work with you to arrange suitable parking - either through provision of a visitor parking permit or by calculating the required parking duration. You can choose to provide the parking ticket directly or reimburse the engineer for parking costs incurred. This flexible arrangement ensures fairness for all parties while maintaining competitive pricing.');
  }
  
  notes.push('All work completed to Gas Safe standards with certification');
  notes.push('System commissioning and performance testing included');
  
  return notes;
}