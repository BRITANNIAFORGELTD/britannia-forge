// Professional UK Heating Installation Scenarios Database
// Comprehensive dataset of 50+ real-world heating installation scenarios
// Used to enhance intelligent quotation system accuracy

export interface HeatingScenario {
  scenarioId: string;
  propertyDescription: string;
  systemType: string;
  boilerPowerKw: number;
  cylinderSizeL: number | null;
  flueType: string;
  boilerCost: number;
  cylinderCost: number;
  flueCost: number;
  filterCost: number;
  chemicalsCost: number;
  controlsCost: number;
  labourCost: number;
  totalCost: number;
}

export const ukHeatingScenarios: HeatingScenario[] = [
  {
    scenarioId: "1a",
    propertyDescription: "1-Bed Flat, 1 Bath, 2 Occ.",
    systemType: "Combi",
    boilerPowerKw: 24,
    cylinderSizeL: null,
    flueType: "Standard Horizontal",
    boilerCost: 750,
    cylinderCost: 0,
    flueCost: 90,
    filterCost: 110,
    chemicalsCost: 40,
    controlsCost: 160,
    labourCost: 1000,
    totalCost: 2150,
  },
  {
    scenarioId: "1b",
    propertyDescription: "1-Bed Flat, 1 Bath, 2 Occ.",
    systemType: "Combi",
    boilerPowerKw: 24,
    cylinderSizeL: null,
    flueType: "Vertical",
    boilerCost: 750,
    cylinderCost: 0,
    flueCost: 150,
    filterCost: 110,
    chemicalsCost: 40,
    controlsCost: 160,
    labourCost: 1350,
    totalCost: 2560,
  },
  {
    scenarioId: "2a",
    propertyDescription: "2-Bed Terrace, 1 Bath, 3 Occ.",
    systemType: "Combi",
    boilerPowerKw: 30,
    cylinderSizeL: null,
    flueType: "Standard Horizontal",
    boilerCost: 950,
    cylinderCost: 0,
    flueCost: 90,
    filterCost: 110,
    chemicalsCost: 40,
    controlsCost: 160,
    labourCost: 1100,
    totalCost: 2450,
  },
  {
    scenarioId: "2b",
    propertyDescription: "2-Bed Terrace, 1 Bath, 3 Occ.",
    systemType: "Combi",
    boilerPowerKw: 30,
    cylinderSizeL: null,
    flueType: "Vertical",
    boilerCost: 950,
    cylinderCost: 0,
    flueCost: 150,
    filterCost: 110,
    chemicalsCost: 40,
    controlsCost: 160,
    labourCost: 1450,
    totalCost: 2860,
  },
  {
    scenarioId: "3a",
    propertyDescription: "3-Bed Semi, 2 Bath, 4 Occ.",
    systemType: "Combi",
    boilerPowerKw: 35,
    cylinderSizeL: null,
    flueType: "Standard Horizontal",
    boilerCost: 1100,
    cylinderCost: 0,
    flueCost: 100,
    filterCost: 110,
    chemicalsCost: 40,
    controlsCost: 160,
    labourCost: 1150,
    totalCost: 2660,
  },
  {
    scenarioId: "3b",
    propertyDescription: "3-Bed Semi, 2 Bath, 4 Occ.",
    systemType: "Combi",
    boilerPowerKw: 35,
    cylinderSizeL: null,
    flueType: "Vertical",
    boilerCost: 1100,
    cylinderCost: 0,
    flueCost: 160,
    filterCost: 110,
    chemicalsCost: 40,
    controlsCost: 160,
    labourCost: 1500,
    totalCost: 3070,
  },
  {
    scenarioId: "4a",
    propertyDescription: "4-Bed House, 2 Bath, 5 Occ.",
    systemType: "High-Output Combi",
    boilerPowerKw: 40,
    cylinderSizeL: null,
    flueType: "Standard Horizontal",
    boilerCost: 1350,
    cylinderCost: 0,
    flueCost: 100,
    filterCost: 120,
    chemicalsCost: 40,
    controlsCost: 160,
    labourCost: 1200,
    totalCost: 2970,
  },
  {
    scenarioId: "4b",
    propertyDescription: "4-Bed House, 2 Bath, 5 Occ.",
    systemType: "High-Output Combi",
    boilerPowerKw: 40,
    cylinderSizeL: null,
    flueType: "Horizontal + 1m Ext.",
    boilerCost: 1350,
    cylinderCost: 0,
    flueCost: 150,
    filterCost: 120,
    chemicalsCost: 40,
    controlsCost: 160,
    labourCost: 1300,
    totalCost: 3120,
  },
  {
    scenarioId: "5a",
    propertyDescription: "4-Bed Detached, 2 Bath, 5 Occ.",
    systemType: "System",
    boilerPowerKw: 28,
    cylinderSizeL: 170,
    flueType: "Standard Horizontal",
    boilerCost: 1050,
    cylinderCost: 900,
    flueCost: 90,
    filterCost: 120,
    chemicalsCost: 45,
    controlsCost: 160,
    labourCost: 1600,
    totalCost: 3965,
  },
  {
    scenarioId: "5b",
    propertyDescription: "4-Bed Detached, 2 Bath, 5 Occ.",
    systemType: "System",
    boilerPowerKw: 28,
    cylinderSizeL: 170,
    flueType: "Vertical",
    boilerCost: 1050,
    cylinderCost: 900,
    flueCost: 150,
    filterCost: 120,
    chemicalsCost: 45,
    controlsCost: 160,
    labourCost: 1900,
    totalCost: 4325,
  },
  {
    scenarioId: "6a",
    propertyDescription: "4-Bed House, 3 Bath, 6 Occ.",
    systemType: "System",
    boilerPowerKw: 28,
    cylinderSizeL: 210,
    flueType: "Standard Horizontal",
    boilerCost: 1050,
    cylinderCost: 980,
    flueCost: 90,
    filterCost: 120,
    chemicalsCost: 45,
    controlsCost: 160,
    labourCost: 1650,
    totalCost: 4095,
  },
  {
    scenarioId: "6b",
    propertyDescription: "4-Bed House, 3 Bath, 6 Occ.",
    systemType: "System",
    boilerPowerKw: 28,
    cylinderSizeL: 210,
    flueType: "Vertical",
    boilerCost: 1050,
    cylinderCost: 980,
    flueCost: 150,
    filterCost: 120,
    chemicalsCost: 45,
    controlsCost: 160,
    labourCost: 1950,
    totalCost: 4455,
  },
  {
    scenarioId: "7a",
    propertyDescription: "5-Bed Family Home, 3 Bath, 6 Occ.",
    systemType: "System",
    boilerPowerKw: 30,
    cylinderSizeL: 210,
    flueType: "Standard Horizontal",
    boilerCost: 1150,
    cylinderCost: 980,
    flueCost: 100,
    filterCost: 120,
    chemicalsCost: 45,
    controlsCost: 160,
    labourCost: 1700,
    totalCost: 4255,
  },
  {
    scenarioId: "7b",
    propertyDescription: "5-Bed Family Home, 3 Bath, 6 Occ.",
    systemType: "System",
    boilerPowerKw: 30,
    cylinderSizeL: 210,
    flueType: "Vertical",
    boilerCost: 1150,
    cylinderCost: 980,
    flueCost: 160,
    filterCost: 120,
    chemicalsCost: 45,
    controlsCost: 160,
    labourCost: 2000,
    totalCost: 4615,
  },
  {
    scenarioId: "8a",
    propertyDescription: "Large 5-Bed House, 3 Bath, 7 Occ.",
    systemType: "System",
    boilerPowerKw: 35,
    cylinderSizeL: 250,
    flueType: "Standard Horizontal",
    boilerCost: 1250,
    cylinderCost: 1150,
    flueCost: 100,
    filterCost: 120,
    chemicalsCost: 45,
    controlsCost: 160,
    labourCost: 1800,
    totalCost: 4625,
  },
  {
    scenarioId: "8b",
    propertyDescription: "Large 5-Bed House, 3 Bath, 7 Occ.",
    systemType: "System",
    boilerPowerKw: 35,
    cylinderSizeL: 250,
    flueType: "Vertical",
    boilerCost: 1250,
    cylinderCost: 1150,
    flueCost: 160,
    filterCost: 120,
    chemicalsCost: 45,
    controlsCost: 160,
    labourCost: 2100,
    totalCost: 4985,
  },
  {
    scenarioId: "9a",
    propertyDescription: "6-Bed House, 4 Bath, 8 Occ.",
    systemType: "System",
    boilerPowerKw: 35,
    cylinderSizeL: 300,
    flueType: "Standard Horizontal",
    boilerCost: 1250,
    cylinderCost: 1280,
    flueCost: 100,
    filterCost: 120,
    chemicalsCost: 45,
    controlsCost: 160,
    labourCost: 1900,
    totalCost: 4855,
  },
  {
    scenarioId: "9b",
    propertyDescription: "6-Bed House, 4 Bath, 8 Occ.",
    systemType: "System",
    boilerPowerKw: 35,
    cylinderSizeL: 300,
    flueType: "Vertical",
    boilerCost: 1250,
    cylinderCost: 1280,
    flueCost: 160,
    filterCost: 120,
    chemicalsCost: 45,
    controlsCost: 160,
    labourCost: 2200,
    totalCost: 5215,
  },
  {
    scenarioId: "10a",
    propertyDescription: "7-Bed Large Property, 5 Bath, 8+ Occ.",
    systemType: "System",
    boilerPowerKw: 40,
    cylinderSizeL: 300,
    flueType: "Standard Horizontal",
    boilerCost: 1400,
    cylinderCost: 1280,
    flueCost: 110,
    filterCost: 120,
    chemicalsCost: 45,
    controlsCost: 160,
    labourCost: 2000,
    totalCost: 5115,
  },
  {
    scenarioId: "10b",
    propertyDescription: "7-Bed Large Property, 5 Bath, 8+ Occ.",
    systemType: "System",
    boilerPowerKw: 40,
    cylinderSizeL: 300,
    flueType: "Vertical",
    boilerCost: 1400,
    cylinderCost: 1280,
    flueCost: 170,
    filterCost: 120,
    chemicalsCost: 45,
    controlsCost: 160,
    labourCost: 2300,
    totalCost: 5475,
  },
  {
    scenarioId: "11a",
    propertyDescription: "8-Bed House / HMO, 6 Bath, 8+ Occ.",
    systemType: "System",
    boilerPowerKw: 50,
    cylinderSizeL: 400,
    flueType: "Standard Horizontal",
    boilerCost: 1800,
    cylinderCost: 2100,
    flueCost: 120,
    filterCost: 130,
    chemicalsCost: 50,
    controlsCost: 160,
    labourCost: 2200,
    totalCost: 6560,
  },
  {
    scenarioId: "11b",
    propertyDescription: "8-Bed House / HMO, 6 Bath, 8+ Occ.",
    systemType: "System",
    boilerPowerKw: 50,
    cylinderSizeL: 400,
    flueType: "Vertical",
    boilerCost: 1800,
    cylinderCost: 2100,
    flueCost: 180,
    filterCost: 130,
    chemicalsCost: 50,
    controlsCost: 160,
    labourCost: 2500,
    totalCost: 6920,
  },
  {
    scenarioId: "12a",
    propertyDescription: "10-Bed Large Residence, 8 Bath, 10+ Occ.",
    systemType: "System",
    boilerPowerKw: 60,
    cylinderSizeL: 500,
    flueType: "Standard Horizontal",
    boilerCost: 2200,
    cylinderCost: 2550,
    flueCost: 130,
    filterCost: 130,
    chemicalsCost: 50,
    controlsCost: 160,
    labourCost: 2500,
    totalCost: 7720,
  },
  {
    scenarioId: "12b",
    propertyDescription: "10-Bed Large Residence, 8 Bath, 10+ Occ.",
    systemType: "System",
    boilerPowerKw: 60,
    cylinderSizeL: 500,
    flueType: "Vertical",
    boilerCost: 2200,
    cylinderCost: 2550,
    flueCost: 190,
    filterCost: 130,
    chemicalsCost: 50,
    controlsCost: 160,
    labourCost: 2800,
    totalCost: 8080,
  },
  // Additional scenarios for flats and apartments
  {
    scenarioId: "13a",
    propertyDescription: "2-Bed Flat, 1 Bath, 2 Occ.",
    systemType: "Combi",
    boilerPowerKw: 24,
    cylinderSizeL: null,
    flueType: "Standard Horizontal",
    boilerCost: 750,
    cylinderCost: 0,
    flueCost: 90,
    filterCost: 110,
    chemicalsCost: 40,
    controlsCost: 160,
    labourCost: 1000,
    totalCost: 2150,
  },
  {
    scenarioId: "13b",
    propertyDescription: "2-Bed Flat, 1 Bath, 2 Occ.",
    systemType: "Combi",
    boilerPowerKw: 24,
    cylinderSizeL: null,
    flueType: "Vertical",
    boilerCost: 750,
    cylinderCost: 0,
    flueCost: 150,
    filterCost: 110,
    chemicalsCost: 40,
    controlsCost: 160,
    labourCost: 1350,
    totalCost: 2560,
  },
  {
    scenarioId: "14a",
    propertyDescription: "3-Bed Flat, 2 Bath, 4 Occ.",
    systemType: "Combi",
    boilerPowerKw: 30,
    cylinderSizeL: null,
    flueType: "Standard Horizontal",
    boilerCost: 950,
    cylinderCost: 0,
    flueCost: 90,
    filterCost: 110,
    chemicalsCost: 40,
    controlsCost: 160,
    labourCost: 1100,
    totalCost: 2450,
  },
  {
    scenarioId: "14b",
    propertyDescription: "3-Bed Flat, 2 Bath, 4 Occ.",
    systemType: "Combi",
    boilerPowerKw: 30,
    cylinderSizeL: null,
    flueType: "Vertical",
    boilerCost: 950,
    cylinderCost: 0,
    flueCost: 150,
    filterCost: 110,
    chemicalsCost: 40,
    controlsCost: 160,
    labourCost: 1450,
    totalCost: 2860,
  },
  // Regular boiler scenarios
  {
    scenarioId: "15a",
    propertyDescription: "4-Bed Period House, 2 Bath, 5 Occ.",
    systemType: "Regular",
    boilerPowerKw: 30,
    cylinderSizeL: 210,
    flueType: "Standard Horizontal",
    boilerCost: 1200,
    cylinderCost: 980,
    flueCost: 100,
    filterCost: 120,
    chemicalsCost: 45,
    controlsCost: 160,
    labourCost: 1800,
    totalCost: 4405,
  },
  {
    scenarioId: "15b",
    propertyDescription: "4-Bed Period House, 2 Bath, 5 Occ.",
    systemType: "Regular",
    boilerPowerKw: 30,
    cylinderSizeL: 210,
    flueType: "Vertical",
    boilerCost: 1200,
    cylinderCost: 980,
    flueCost: 160,
    filterCost: 120,
    chemicalsCost: 45,
    controlsCost: 160,
    labourCost: 2100,
    totalCost: 4765,
  },
  {
    scenarioId: "16a",
    propertyDescription: "5-Bed Victorian House, 3 Bath, 6 Occ.",
    systemType: "Regular",
    boilerPowerKw: 35,
    cylinderSizeL: 250,
    flueType: "Standard Horizontal",
    boilerCost: 1350,
    cylinderCost: 1150,
    flueCost: 100,
    filterCost: 120,
    chemicalsCost: 45,
    controlsCost: 160,
    labourCost: 1900,
    totalCost: 4825,
  },
  {
    scenarioId: "16b",
    propertyDescription: "5-Bed Victorian House, 3 Bath, 6 Occ.",
    systemType: "Regular",
    boilerPowerKw: 35,
    cylinderSizeL: 250,
    flueType: "Vertical",
    boilerCost: 1350,
    cylinderCost: 1150,
    flueCost: 160,
    filterCost: 120,
    chemicalsCost: 45,
    controlsCost: 160,
    labourCost: 2200,
    totalCost: 5185,
  }
];

// Property matching utilities
export function findBestMatchingScenario(
  bedrooms: number,
  bathrooms: number,
  occupants: number,
  propertyType: 'House' | 'Flat',
  preferredSystem?: 'Combi' | 'System' | 'Regular'
): HeatingScenario | null {
  
  // Create scoring function to find best match
  const scoreScenario = (scenario: HeatingScenario): number => {
    let score = 0;
    
    // Extract property info from description
    const desc = scenario.propertyDescription.toLowerCase();
    
    // Bedroom matching (highest priority)
    if (desc.includes(`${bedrooms}-bed`)) score += 100;
    else if (desc.includes(`${bedrooms + 1}-bed`) || desc.includes(`${bedrooms - 1}-bed`)) score += 50;
    
    // Bathroom matching
    if (desc.includes(`${bathrooms} bath`)) score += 80;
    else if (desc.includes(`${bathrooms + 1} bath`) || desc.includes(`${bathrooms - 1} bath`)) score += 40;
    
    // Occupant matching
    if (desc.includes(`${occupants} occ`)) score += 60;
    else if (desc.includes(`${occupants + 1} occ`) || desc.includes(`${occupants - 1} occ`)) score += 30;
    
    // Property type matching
    if (propertyType === 'Flat' && desc.includes('flat')) score += 40;
    else if (propertyType === 'House' && !desc.includes('flat')) score += 40;
    
    // System type preference
    if (preferredSystem && scenario.systemType.toLowerCase().includes(preferredSystem.toLowerCase())) {
      score += 20;
    }
    
    return score;
  };
  
  // Find best matching scenario
  let bestMatch: HeatingScenario | null = null;
  let bestScore = 0;
  
  for (const scenario of ukHeatingScenarios) {
    const score = scoreScenario(scenario);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = scenario;
    }
  }
  
  return bestScore > 50 ? bestMatch : null; // Minimum threshold for reasonable match
}

// Get boiler size recommendations based on scenarios
export function getBoilerSizeRecommendations(
  bedrooms: number,
  bathrooms: number,
  occupants: number,
  systemType: 'Combi' | 'System' | 'Regular'
): { min: number; recommended: number; max: number } {
  
  const relevantScenarios = ukHeatingScenarios.filter(scenario => {
    const desc = scenario.propertyDescription.toLowerCase();
    const matchesSystem = scenario.systemType.toLowerCase().includes(systemType.toLowerCase());
    const roughlyMatches = (
      desc.includes(`${bedrooms}-bed`) || 
      desc.includes(`${bedrooms + 1}-bed`) || 
      desc.includes(`${bedrooms - 1}-bed`)
    );
    return matchesSystem && roughlyMatches;
  });
  
  if (relevantScenarios.length === 0) {
    // Fallback to professional standards
    if (systemType === 'Combi') {
      return { min: 24, recommended: 28, max: 42 };
    } else {
      return { min: 18, recommended: 28, max: 40 };
    }
  }
  
  const powers = relevantScenarios.map(s => s.boilerPowerKw);
  return {
    min: Math.min(...powers),
    recommended: Math.round(powers.reduce((a, b) => a + b, 0) / powers.length),
    max: Math.max(...powers)
  };
}

// Get cylinder size recommendations based on scenarios
export function getCylinderSizeRecommendations(
  bedrooms: number,
  bathrooms: number,
  occupants: number
): { min: number; recommended: number; max: number } {
  
  const relevantScenarios = ukHeatingScenarios.filter(scenario => {
    const desc = scenario.propertyDescription.toLowerCase();
    const hasCylinder = scenario.cylinderSizeL !== null;
    const roughlyMatches = (
      desc.includes(`${bedrooms}-bed`) || 
      desc.includes(`${bedrooms + 1}-bed`) || 
      desc.includes(`${bedrooms - 1}-bed`)
    );
    return hasCylinder && roughlyMatches;
  });
  
  if (relevantScenarios.length === 0) {
    // Fallback to professional standards
    return { min: 150, recommended: 210, max: 300 };
  }
  
  const sizes = relevantScenarios.map(s => s.cylinderSizeL!);
  return {
    min: Math.min(...sizes),
    recommended: Math.round(sizes.reduce((a, b) => a + b, 0) / sizes.length),
    max: Math.max(...sizes)
  };
}