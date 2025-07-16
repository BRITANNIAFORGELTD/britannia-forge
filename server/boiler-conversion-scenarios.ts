// Boiler Conversion Scenarios Database
// Professional UK heating installation patterns for intelligent quotation accuracy

export interface BoilerConversionScenario {
  id: string;
  propertyDescription: string;
  occupants: string;
  currentSystem: string;
  recommendation: string;
  recommendedSpecification: string;
  flowRateLPM?: number;
  kWOutput?: number;
  cylinderSize?: number;
  reasoning: string;
}

export const boilerConversionScenarios: BoilerConversionScenario[] = [
  {
    id: "1",
    propertyDescription: "1-bedroom flat, 1 bathroom (with shower)",
    occupants: "1-2 adults",
    currentSystem: "Old system boiler with a 120L vented cylinder",
    recommendation: "Combi Boiler Conversion",
    recommendedSpecification: "24-28kW Combi, ~10-12 LPM flow rate",
    flowRateLPM: 12,
    kWOutput: 26,
    reasoning: "Single bathroom, low occupancy - combi ideal for space saving and efficiency"
  },
  {
    id: "2",
    propertyDescription: "2-bedroom terraced house, 1 bathroom",
    occupants: "2-3 people",
    currentSystem: "Conventional boiler with tanks in loft and cylinder",
    recommendation: "Combi Boiler Conversion",
    recommendedSpecification: "30kW Combi, ~12-13 LPM flow rate",
    flowRateLPM: 13,
    kWOutput: 30,
    reasoning: "Single bathroom household - combi provides good performance and removes loft tanks"
  },
  {
    id: "3",
    propertyDescription: "2-bedroom apartment with no existing gas boiler",
    occupants: "2 adults",
    currentSystem: "Electric storage heaters and standalone immersion cylinder",
    recommendation: "New Gas Combi Boiler Installation",
    recommendedSpecification: "30kW Combi, ~12-13 LPM flow rate",
    flowRateLPM: 13,
    kWOutput: 30,
    reasoning: "New gas installation - combi provides instant heating and hot water"
  },
  {
    id: "4",
    propertyDescription: "3-bedroom semi-detached house, 1 main bathroom",
    occupants: "A family of 3-4",
    currentSystem: "Old system boiler and a vented cylinder",
    recommendation: "Combi Boiler Conversion",
    recommendedSpecification: "32-35kW Combi, ~13-15 LPM flow rate",
    flowRateLPM: 14,
    kWOutput: 34,
    reasoning: "Single bathroom family home - high-power combi handles increased demand"
  },
  {
    id: "5",
    propertyDescription: "3-bedroom house, 1 main bathroom (mixer), 1 ensuite (electric)",
    occupants: "A family of 4",
    currentSystem: "Conventional boiler with cylinder",
    recommendation: "Combi Boiler Conversion",
    recommendedSpecification: "35kW Combi, ~14-15 LPM flow rate",
    flowRateLPM: 15,
    kWOutput: 35,
    reasoning: "Two bathrooms but only one on gas - powerful combi can handle main bathroom demand"
  },
  {
    id: "6",
    propertyDescription: "2-bedroom bungalow, 1 bathroom",
    occupants: "An elderly couple",
    currentSystem: "Old floor-standing regular boiler with cylinder",
    recommendation: "Combi Boiler Conversion",
    recommendedSpecification: "28-30kW Combi, ~12 LPM flow rate",
    flowRateLPM: 12,
    kWOutput: 29,
    reasoning: "Low occupancy, single bathroom - combi ideal for simplicity and efficiency"
  },
  {
    id: "7",
    propertyDescription: "2-bedroom rental property, 1 bathroom",
    occupants: "Tenants",
    currentSystem: "Inefficient system boiler and cylinder",
    recommendation: "Combi Boiler Conversion",
    recommendedSpecification: "Budget-tier 28kW Combi, ~11-12 LPM flow rate",
    flowRateLPM: 12,
    kWOutput: 28,
    reasoning: "Rental property - cost-effective combi solution with reliable performance"
  },
  {
    id: "8",
    propertyDescription: "3-bedroom house, 2 mixer showers",
    occupants: "A family of 4",
    currentSystem: "System boiler and vented cylinder",
    recommendation: "System Boiler Upgrade Strongly Advised",
    recommendedSpecification: "24kW System Boiler with 170L unvented cylinder",
    kWOutput: 24,
    cylinderSize: 170,
    reasoning: "Multiple mixer showers require simultaneous hot water - system boiler essential"
  },
  {
    id: "9",
    propertyDescription: "4-bedroom house, 1 bath, 1 ensuite",
    occupants: "A family of 5 who value good water pressure",
    currentSystem: "Old conventional boiler",
    recommendation: "System Boiler Upgrade",
    recommendedSpecification: "28kW System Boiler with 210L unvented cylinder",
    kWOutput: 28,
    cylinderSize: 210,
    reasoning: "Multiple bathrooms, large family - system boiler provides consistent pressure and flow"
  },
  {
    id: "10",
    propertyDescription: "3-bedroom apartment, 1 luxury bathroom with 'rainfall' shower",
    occupants: "2 adults",
    currentSystem: "Electric immersion cylinder",
    recommendation: "System Boiler Installation",
    recommendedSpecification: "24kW System Boiler with 150L-170L unvented cylinder",
    kWOutput: 24,
    cylinderSize: 160,
    reasoning: "Luxury bathroom with high-flow shower head requires stored hot water system"
  },
  {
    id: "11",
    propertyDescription: "3-bedroom house, 1 bathroom, with plans to add an ensuite",
    occupants: "A young couple",
    currentSystem: "Old system boiler and cylinder",
    recommendation: "System Boiler Upgrade",
    recommendedSpecification: "24kW System Boiler with 170L unvented cylinder",
    kWOutput: 24,
    cylinderSize: 170,
    reasoning: "Future-proofing for additional bathroom - system boiler handles expansion"
  },
  {
    id: "12",
    propertyDescription: "2-bedroom cottage with low mains water pressure",
    occupants: "2 adults",
    currentSystem: "Conventional boiler with loft tanks",
    recommendation: "System Boiler Upgrade",
    recommendedSpecification: "24kW System Boiler with 150L unvented cylinder",
    kWOutput: 24,
    cylinderSize: 150,
    reasoning: "Low mains pressure - unvented cylinder provides improved flow and pressure"
  },
  {
    id: "13",
    propertyDescription: "4-Bed, 2-Bath, 1-Ensuite House",
    occupants: "Large family",
    currentSystem: "Various existing systems",
    recommendation: "System Boiler Upgrade",
    recommendedSpecification: "28kW System Boiler with 210L cylinder",
    kWOutput: 28,
    cylinderSize: 210,
    reasoning: "Multiple bathrooms in large house - system boiler mandatory for simultaneous use"
  },
  {
    id: "14",
    propertyDescription: "5-Bed, 3-Bath Family Home",
    occupants: "Large family",
    currentSystem: "Various existing systems",
    recommendation: "System Boiler Upgrade",
    recommendedSpecification: "32kW System Boiler with 250L cylinder",
    kWOutput: 32,
    cylinderSize: 250,
    reasoning: "3+ bathrooms require system boiler - large cylinder for high occupancy"
  },
  {
    id: "15",
    propertyDescription: "Property with 3+ Mixer Showers",
    occupants: "Various",
    currentSystem: "Various existing systems",
    recommendation: "System Boiler Upgrade",
    recommendedSpecification: "32kW System Boiler with 300L cylinder",
    kWOutput: 32,
    cylinderSize: 300,
    reasoning: "Multiple mixer showers - only system boiler can provide adequate simultaneous flow"
  },
  {
    id: "16",
    propertyDescription: "Large House with Slow-Filling Baths",
    occupants: "Various",
    currentSystem: "Inadequate existing system",
    recommendation: "System Boiler Upgrade",
    recommendedSpecification: "32kW System Boiler with 250L+ cylinder",
    kWOutput: 32,
    cylinderSize: 250,
    reasoning: "Large bath capacity requires substantial stored hot water volume"
  },
  {
    id: "17",
    propertyDescription: "6-Bed House with High Occupancy",
    occupants: "Large household",
    currentSystem: "Various existing systems",
    recommendation: "System Boiler Upgrade",
    recommendedSpecification: "36kW System Boiler with 300L cylinder",
    kWOutput: 36,
    cylinderSize: 300,
    reasoning: "High occupancy requires maximum hot water storage and rapid recovery"
  },
  {
    id: "18",
    propertyDescription: "Home with Body-Jet Shower System",
    occupants: "Various",
    currentSystem: "Inadequate existing system",
    recommendation: "System Boiler Upgrade",
    recommendedSpecification: "32kW System Boiler with 300L cylinder",
    kWOutput: 32,
    cylinderSize: 300,
    reasoning: "Body-jet systems require high flow rates - only achievable with stored hot water"
  },
  {
    id: "19",
    propertyDescription: "Small Guesthouse/HMO",
    occupants: "Multiple tenants",
    currentSystem: "Various existing systems",
    recommendation: "System Boiler Upgrade",
    recommendedSpecification: "28kW System Boiler with 300L+ cylinder",
    kWOutput: 28,
    cylinderSize: 300,
    reasoning: "Multiple occupants with unpredictable usage patterns - large storage essential"
  },
  {
    id: "20",
    propertyDescription: "Property with multiple 'rainfall' showers",
    occupants: "Various",
    currentSystem: "Inadequate existing system",
    recommendation: "System Boiler Upgrade",
    recommendedSpecification: "32kW System Boiler with 300L+ cylinder",
    kWOutput: 32,
    cylinderSize: 300,
    reasoning: "Multiple high-flow shower heads - requires substantial stored hot water"
  }
];

// Enhanced scenario matching with detailed reasoning
export function findBestConversionScenario(
  bedrooms: number,
  bathrooms: number,
  occupants: number,
  currentSystem: string = "existing"
): BoilerConversionScenario | null {
  
  // Score scenarios based on property characteristics
  const scoreScenario = (scenario: BoilerConversionScenario): number => {
    let score = 0;
    
    // Extract numbers from property description
    const descBedrooms = extractNumber(scenario.propertyDescription, /(\d+)-bedroom/);
    const descBathrooms = extractNumber(scenario.propertyDescription, /(\d+)\s+bath/);
    const descOccupants = extractOccupantsFromDescription(scenario.occupants);
    
    // Bedroom matching (high weight)
    if (descBedrooms) {
      score += bedrooms === descBedrooms ? 30 : Math.max(0, 20 - Math.abs(bedrooms - descBedrooms) * 5);
    }
    
    // Bathroom matching (critical weight)
    if (descBathrooms) {
      score += bathrooms === descBathrooms ? 40 : Math.max(0, 30 - Math.abs(bathrooms - descBathrooms) * 10);
    }
    
    // Occupant matching (moderate weight)
    if (descOccupants) {
      score += occupants === descOccupants ? 20 : Math.max(0, 15 - Math.abs(occupants - descOccupants) * 3);
    }
    
    // System type matching (lower weight)
    if (currentSystem.toLowerCase().includes('combi') && scenario.currentSystem.toLowerCase().includes('combi')) {
      score += 5;
    } else if (currentSystem.toLowerCase().includes('system') && scenario.currentSystem.toLowerCase().includes('system')) {
      score += 5;
    }
    
    return score;
  };
  
  // Find best matching scenario
  const scoredScenarios = boilerConversionScenarios.map(scenario => ({
    scenario,
    score: scoreScenario(scenario)
  }));
  
  scoredScenarios.sort((a, b) => b.score - a.score);
  
  return scoredScenarios.length > 0 ? scoredScenarios[0].scenario : null;
}

// Helper function to extract numbers from text
function extractNumber(text: string, regex: RegExp): number | null {
  const match = text.match(regex);
  return match ? parseInt(match[1]) : null;
}

// Helper function to extract occupant count from description
function extractOccupantsFromDescription(description: string): number | null {
  // Extract numbers from occupant descriptions
  if (description.includes('1-2')) return 1.5;
  if (description.includes('2-3')) return 2.5;
  if (description.includes('3-4')) return 3.5;
  if (description.includes('family of 4')) return 4;
  if (description.includes('family of 5')) return 5;
  if (description.includes('couple')) return 2;
  if (description.includes('adults')) {
    const match = description.match(/(\d+)\s+adults/);
    return match ? parseInt(match[1]) : null;
  }
  return null;
}

// Get conversion recommendations based on scenario matching
export function getConversionRecommendations(
  bedrooms: number,
  bathrooms: number,
  occupants: number,
  currentSystem: string = "existing"
): {
  recommendedSystem: 'Combi' | 'System' | 'Regular';
  boilerSize: number;
  cylinderSize?: number;
  reasoning: string;
  matchedScenario?: BoilerConversionScenario;
} {
  
  const bestMatch = findBestConversionScenario(bedrooms, bathrooms, occupants, currentSystem);
  
  if (bestMatch) {
    const systemType = bestMatch.recommendation.includes('System') ? 'System' : 
                      bestMatch.recommendation.includes('Regular') ? 'Regular' : 'Combi';
    
    return {
      recommendedSystem: systemType,
      boilerSize: bestMatch.kWOutput || 30,
      cylinderSize: bestMatch.cylinderSize,
      reasoning: bestMatch.reasoning,
      matchedScenario: bestMatch
    };
  }
  
  // Fallback logic if no perfect match
  if (bathrooms >= 3) {
    return {
      recommendedSystem: 'System',
      boilerSize: 32,
      cylinderSize: 250,
      reasoning: "3+ bathrooms require system boiler for simultaneous hot water usage"
    };
  } else if (bathrooms === 2 && (bedrooms >= 4 || occupants >= 4)) {
    return {
      recommendedSystem: 'System',
      boilerSize: 28,
      cylinderSize: 210,
      reasoning: "Large 2-bathroom property with high occupancy - system boiler recommended"
    };
  } else {
    return {
      recommendedSystem: 'Combi',
      boilerSize: bathrooms === 2 ? 35 : 30,
      reasoning: "Single or low-demand bathroom setup - combi boiler suitable"
    };
  }
}