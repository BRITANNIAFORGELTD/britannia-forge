import { QuoteData, QuoteOption } from "@/types/quote";
import { apiRequest } from "./queryClient";

export interface PriceBreakdown {
  boilerPrice: number;
  boilerModel: string;
  labourPrice: number;
  sundryPrice: number;
  flueExtensionPrice: number;
  flueExtensionLength: string;
  megaflowPrice: number;
  condensatePumpPrice: number;
  thermostatPrice: number;
  parkingFee: number;
  parkingRequired: boolean;
  discountAmount: number;
  vatAmount: number;
  subtotal: number;
  totalPrice: number;
  waterFlowRate: number; // litres per minute
  components: Array<{
    name: string;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
}

export interface IntelligentQuoteOptions {
  standard: QuoteOption;
  premium: QuoteOption;
  luxury: QuoteOption;
  breakdown: PriceBreakdown;
  recommendedBoilerSize: number;
  boilerType: 'Combi' | 'System' | 'Regular';
}

// Advanced boiler sizing based on heat load calculation
export function calculateBoilerSize(bedrooms: string, bathrooms: string, occupants: string, propertyType: string): number {
  const bedroomCount = parseInt(bedrooms.replace('+', '')) || 1;
  const bathroomCount = parseInt(bathrooms.replace('+', '')) || 1;
  const occupantCount = parseInt(occupants.replace('+', '')) || 2;
  
  // Heat load calculation based on property type and room count
  let baseHeatLoad = 0;
  
  // Base heat load per room type
  if (propertyType === 'House') {
    baseHeatLoad = bedroomCount * 2.5 + bathroomCount * 3.5 + 8; // Living areas
  } else { // Flat
    baseHeatLoad = bedroomCount * 2.0 + bathroomCount * 3.0 + 6; // Typically better insulated
  }
  
  // Hot water demand calculation
  const hotWaterDemand = Math.max(
    occupantCount * 2, // 2kW per occupant minimum
    bathroomCount * 4  // 4kW per bathroom minimum
  );
  
  // Total system requirement
  const totalKwRequired = baseHeatLoad + hotWaterDemand;
  
  // Round up to nearest available boiler size
  if (totalKwRequired <= 24) return 24;
  if (totalKwRequired <= 28) return 28;
  if (totalKwRequired <= 32) return 32;
  if (totalKwRequired <= 36) return 36;
  if (totalKwRequired <= 42) return 42;
  
  // For very large properties, recommend system boiler
  return 42;
}

// Intelligent boiler type selection based on comprehensive property analysis
export function determineBoilerType(
  bedrooms: string, 
  bathrooms: string, 
  occupants: string,
  currentBoiler: string,
  propertyType: string
): 'Combi' | 'System' | 'Regular' {
  const bedroomCount = parseInt(bedrooms.replace('+', '')) || 1;
  const bathroomCount = parseInt(bathrooms.replace('+', '')) || 1;
  const occupantCount = parseInt(occupants.replace('+', '')) || 2;
  
  // Calculate hot water demand score
  const hotWaterDemandScore = (bathroomCount * 3) + (occupantCount * 2);
  
  // Calculate simultaneous usage probability
  const simultaneousUsage = bathroomCount > 1 && occupantCount > 2;
  
  // System boiler is recommended for:
  // - Properties with 2+ bathrooms AND 3+ occupants
  // - Properties with 3+ bathrooms regardless of occupants
  // - Large houses with high hot water demand
  if (bathroomCount >= 3 || 
      (bathroomCount >= 2 && occupantCount >= 3) ||
      (propertyType === 'House' && bedroomCount >= 4) ||
      hotWaterDemandScore >= 12) {
    return 'System';
  }
  
  // Regular boiler is recommended for:
  // - Properties with existing regular boiler setup
  // - Very large properties (4+ bed, 3+ bath)
  // - When cylinder already exists and is suitable
  if (currentBoiler.toLowerCase().includes('regular') ||
      currentBoiler.toLowerCase().includes('conventional') ||
      (bedroomCount >= 4 && bathroomCount >= 3)) {
    return 'Regular';
  }
  
  // Combi boiler is recommended for:
  // - Small to medium properties
  // - Single bathroom properties
  // - Properties where space saving is important (flats)
  // - Low to moderate hot water demand
  return 'Combi';
}

// Calculate cylinder capacity for system/regular boilers
export function calculateCylinderCapacity(bedrooms: string, bathrooms: string, occupants: string): number {
  const bedroomCount = parseInt(bedrooms.replace('+', '')) || 1;
  const bathroomCount = parseInt(bathrooms.replace('+', '')) || 1;
  const occupantCount = parseInt(occupants.replace('+', '')) || 2;
  
  // Base capacity calculation
  const baseCapacity = Math.max(
    occupantCount * 40, // 40L per occupant minimum
    bathroomCount * 60  // 60L per bathroom minimum
  );
  
  // Add buffer for peak demand
  const peakDemandBuffer = bathroomCount > 1 ? 60 : 30;
  const totalCapacity = baseCapacity + peakDemandBuffer;
  
  // Round to standard cylinder sizes
  if (totalCapacity <= 150) return 150;
  if (totalCapacity <= 180) return 180;
  if (totalCapacity <= 210) return 210;
  if (totalCapacity <= 250) return 250;
  if (totalCapacity <= 300) return 300;
  
  return 300; // Maximum standard size
}

// Calculate parking fees based on distance
export function calculateParkingFee(distance: string): number {
  const distanceNum = parseInt(distance);
  if (isNaN(distanceNum) || distanceNum <= 0) return 0;
  
  // £5 per meter beyond 10 meters
  if (distanceNum > 10) {
    return (distanceNum - 10) * 500; // 500 = £5 in pence
  }
  
  return 0;
}

// Calculate flue extension costs
export function calculateFlueExtension(extension: string): number {
  const extensionNum = parseInt(extension);
  if (isNaN(extensionNum) || extensionNum <= 0) return 0;
  
  // £80 per meter
  return extensionNum * 8000; // 8000 = £80 in pence
}

export async function calculateIntelligentQuote(quoteData: QuoteData): Promise<IntelligentQuoteOptions> {
  // Special handling for Unknown boiler type
  if (quoteData.currentBoiler === 'Unknown') {
    // Return a placeholder quote that indicates video call required
    return {
      standard: {
        tier: 'Standard',
        boilerMake: 'TBD',
        boilerModel: 'Video Call Required',
        warranty: 'TBD',
        basePrice: 0,
        isRecommended: false
      },
      premium: {
        tier: 'Premium',
        boilerMake: 'TBD',
        boilerModel: 'Video Call Required',
        warranty: 'TBD',
        basePrice: 0,
        isRecommended: false
      },
      luxury: {
        tier: 'Luxury',
        boilerMake: 'TBD',
        boilerModel: 'Video Call Required',
        warranty: 'TBD',
        basePrice: 0,
        isRecommended: false
      },
      breakdown: {
        boilerPrice: 0,
        boilerModel: 'Video Call Required',
        labourPrice: 0,
        sundryPrice: 0,
        flueExtensionPrice: 0,
        flueExtensionLength: 'None',
        megaflowPrice: 0,
        condensatePumpPrice: 0,
        thermostatPrice: 0,
        parkingFee: 0,
        parkingRequired: false,
        discountAmount: 0,
        vatAmount: 0,
        subtotal: 0,
        totalPrice: 0,
        waterFlowRate: 0,
        components: []
      },
      recommendedBoilerSize: 0,
      boilerType: 'Unknown' as any
    };
  }
  
  try {
    // Use new intelligent quote engine
    const response = await apiRequest("POST", "/api/calculate-intelligent-quote", {
      bedrooms: quoteData.bedrooms,
      bathrooms: quoteData.bathrooms,
      occupants: quoteData.occupants || "2",
      propertyType: quoteData.propertyType,
      currentBoiler: quoteData.currentBoiler,
      flueLocation: quoteData.flueLocation,
      drainNearby: quoteData.drainNearby,
      moveBoiler: quoteData.moveBoiler,
      postcode: quoteData.postcode
    });
    
    const intelligentResult = await response.json();
    
    // Transform the intelligent result to match the expected format
    return {
      standard: {
        tier: intelligentResult.quotes[0].tier,
        boilerMake: intelligentResult.quotes[0].boilerMake,
        boilerModel: intelligentResult.quotes[0].boilerModel,
        warranty: intelligentResult.quotes[0].warranty,
        basePrice: intelligentResult.quotes[0].basePrice,
        isRecommended: intelligentResult.quotes[0].isRecommended
      },
      premium: {
        tier: intelligentResult.quotes[1].tier,
        boilerMake: intelligentResult.quotes[1].boilerMake,
        boilerModel: intelligentResult.quotes[1].boilerModel,
        warranty: intelligentResult.quotes[1].warranty,
        basePrice: intelligentResult.quotes[1].basePrice,
        isRecommended: intelligentResult.quotes[1].isRecommended
      },
      luxury: {
        tier: intelligentResult.quotes[2].tier,
        boilerMake: intelligentResult.quotes[2].boilerMake,
        boilerModel: intelligentResult.quotes[2].boilerModel,
        warranty: intelligentResult.quotes[2].warranty,
        basePrice: intelligentResult.quotes[2].basePrice,
        isRecommended: intelligentResult.quotes[2].isRecommended
      },
      breakdown: {
        boilerPrice: intelligentResult.priceBreakdown.boilerPrice,
        boilerModel: `${intelligentResult.quotes[0].boilerMake} ${intelligentResult.quotes[0].boilerModel}`,
        labourPrice: intelligentResult.priceBreakdown.labourPrice,
        sundryPrice: intelligentResult.priceBreakdown.sundryPrice,
        flueExtensionPrice: intelligentResult.priceBreakdown.flueExtensionPrice,
        flueExtensionLength: intelligentResult.priceBreakdown.flueExtensionPrice > 0 ? `${quoteData.flueExtension || 0}m` : 'None',
        megaflowPrice: intelligentResult.priceBreakdown.cylinderPrice,
        condensatePumpPrice: intelligentResult.priceBreakdown.condensatePumpPrice,
        thermostatPrice: intelligentResult.priceBreakdown.thermostatPrice,
        parkingFee: intelligentResult.priceBreakdown.parkingFee,
        parkingRequired: intelligentResult.priceBreakdown.parkingFee > 0,
        discountAmount: 0,
        vatAmount: intelligentResult.priceBreakdown.vatAmount,
        subtotal: intelligentResult.priceBreakdown.subtotal,
        totalPrice: intelligentResult.priceBreakdown.totalPrice,
        waterFlowRate: intelligentResult.quotes[0].flowRate,
        components: [
          {
            name: `${intelligentResult.quotes[0].boilerMake} ${intelligentResult.quotes[0].boilerModel}`,
            description: `${intelligentResult.quotes[0].boilerType} boiler with ${intelligentResult.quotes[0].kWOutput}kW output, ${intelligentResult.quotes[0].warranty} warranty`,
            quantity: 1,
            unitPrice: intelligentResult.priceBreakdown.boilerPrice,
            totalPrice: intelligentResult.priceBreakdown.boilerPrice
          },
          {
            name: "Professional Installation",
            description: intelligentResult.analysis.jobType,
            quantity: 1,
            unitPrice: intelligentResult.priceBreakdown.labourPrice,
            totalPrice: intelligentResult.priceBreakdown.labourPrice
          },
          {
            name: "System Chemicals & Filter",
            description: "Fernox TF1 filter, inhibitor, and cleaner",
            quantity: 1,
            unitPrice: intelligentResult.priceBreakdown.sundryPrice,
            totalPrice: intelligentResult.priceBreakdown.sundryPrice
          }
        ]
      },
      recommendedBoilerSize: intelligentResult.analysis.recommendedBoilerSize,
      boilerType: intelligentResult.analysis.recommendedBoilerType
    };
    
  } catch (error) {
    console.error('Error with intelligent quote engine, falling back to legacy system:', error);
    
    try {
      // Fallback to legacy system
      const [boilersRes, labourRes, sundriesRes] = await Promise.all([
        apiRequest("GET", "/api/boilers"),
        apiRequest("GET", "/api/labour-costs"),
        apiRequest("GET", "/api/sundries")
      ]);
      
      const boilers = await boilersRes.json();
      const labourCosts = await labourRes.json();
      const sundries = await sundriesRes.json();
      
      // Calculate intelligent boiler sizing with advanced logic
      const recommendedSize = calculateBoilerSize(
        quoteData.bedrooms, 
        quoteData.bathrooms, 
        quoteData.occupants || "2",
        quoteData.propertyType
      );
      
      const boilerType = determineBoilerType(
        quoteData.bedrooms, 
        quoteData.bathrooms, 
        quoteData.occupants || "2",
        quoteData.currentBoiler,
        quoteData.propertyType
      );
      
      // Calculate cylinder capacity for system/regular boilers
      const cylinderCapacity = (boilerType === 'System' || boilerType === 'Regular') ? 
        calculateCylinderCapacity(quoteData.bedrooms, quoteData.bathrooms, quoteData.occupants || "2") : 0;
      
      // Filter boilers by type and size with intelligent matching
      const suitableBoilers = boilers.filter((boiler: any) => {
        // Must match boiler type
        if (boiler.boilerType !== boilerType) return false;
        
        // For combi boilers, match DHW output closely
        if (boilerType === 'Combi') {
          return boiler.dhwKw >= recommendedSize && boiler.dhwKw <= (recommendedSize + 6);
        }
        
        // For system/regular boilers, focus on heating output
        return boiler.dhwKw >= (recommendedSize - 2) && boiler.dhwKw <= (recommendedSize + 4);
      });
      
      // Group by tier
      const budgetBoilers = suitableBoilers.filter((b: any) => b.tier === 'Budget');
      const midRangeBoilers = suitableBoilers.filter((b: any) => b.tier === 'Mid-Range');
      const premiumBoilers = suitableBoilers.filter((b: any) => b.tier === 'Premium');
      
      // Select best boiler for each tier
      const standardBoiler = budgetBoilers[0] || midRangeBoilers[0] || suitableBoilers[0];
      const premiumBoiler = midRangeBoilers[0] || premiumBoilers[0] || suitableBoilers[0];
      const luxuryBoiler = premiumBoilers[0] || suitableBoilers[0];
      
      // Get labour costs for the job type
      const jobType = boilerType === 'Combi' ? 'Combi Boiler Replacement (like-for-like)' : 
                     boilerType === 'System' ? 'System Boiler Replacement (like-for-like)' : 
                     'Conventional Boiler Replacement (like-for-like)';
      
      const standardLabour = labourCosts.find((l: any) => l.jobType === jobType && l.tier === 'Standard')?.price || 135000;
      const premiumLabour = labourCosts.find((l: any) => l.jobType === jobType && l.tier === 'Premium')?.price || 160000;
      
      // Calculate additional costs
      const flueExtensionPrice = calculateFlueExtension(quoteData.flueExtension || "0");
      const parkingFee = calculateParkingFee(quoteData.parkingDistance || "0");
      
      // Calculate water flow rate based on boiler type and size
      const waterFlowRate = boilerType === 'Combi' ? 
        (recommendedSize <= 24 ? 10 : recommendedSize <= 28 ? 12 : 14) : 
        (boilerType === 'System' ? 20 : 15);
      
      // Calculate cylinder cost for System/Regular boilers based on calculated capacity
      const cylinderPrice = (boilerType === 'System' || boilerType === 'Regular') ? 
        (cylinderCapacity <= 180 ? 75000 : 
         cylinderCapacity <= 210 ? 85000 : 
         cylinderCapacity <= 250 ? 95000 : 110000) : 0; // £750-£1100 based on size
      
      // Calculate condensate pump cost if required
      const condensatePumpPrice = quoteData.drainNearby === 'no' || quoteData.drainNearby === false ? 25000 : 0; // £250
      
      // Calculate thermostat upgrade cost
      const thermostatPrice = quoteData.thermostatUpgrade === 'Yes' ? 15000 : 0; // £150
      
      // Basic sundry costs (filter, chemicals, etc.)
      const basicSundries = 5000; // £50 in basic sundries
      const premiumSundries = 10000; // £100 in premium sundries
      
      // Calculate quotes for each tier with job type specific pricing
      const jobTypeMultiplier = boilerType === 'Combi' ? 1.0 : 
                                boilerType === 'System' ? 1.3 : 1.5; // Regular boilers are most complex
      
      const standardSubtotal = (standardBoiler?.supplyPrice || 120000) + 
                              Math.round(standardLabour * jobTypeMultiplier) + 
                              basicSundries + flueExtensionPrice + cylinderPrice + 
                              condensatePumpPrice + thermostatPrice;
      
      const premiumSubtotal = (premiumBoiler?.supplyPrice || 145000) + 
                             Math.round(premiumLabour * jobTypeMultiplier) + 
                             basicSundries + flueExtensionPrice + cylinderPrice + 
                             condensatePumpPrice + thermostatPrice;
      
      const luxurySubtotal = (luxuryBoiler?.supplyPrice || 170000) + 
                            Math.round(premiumLabour * jobTypeMultiplier) + 
                            premiumSundries + flueExtensionPrice + cylinderPrice + 
                            condensatePumpPrice + thermostatPrice;
      
      // Add VAT (20%)
      const standardVat = Math.round(standardSubtotal * 0.2);
      const premiumVat = Math.round(premiumSubtotal * 0.2);
      const luxuryVat = Math.round(luxurySubtotal * 0.2);
      
      const standardWithVat = standardSubtotal + standardVat;
      const premiumWithVat = premiumSubtotal + premiumVat;
      const luxuryWithVat = luxurySubtotal + luxuryVat;
      
      const standardOption: QuoteOption = {
        tier: "Standard",
        boilerMake: standardBoiler?.make || "Baxi",
        boilerModel: standardBoiler?.model || "800 Combi 2 24kW",
        warranty: `${standardBoiler?.warrantyYears || 10} years`,
        basePrice: standardWithVat,
        isRecommended: true
      };
      
      const premiumOption: QuoteOption = {
        tier: "Premium",
        boilerMake: premiumBoiler?.make || "Ideal",
        boilerModel: premiumBoiler?.model || "Logic Max Combi2 C24",
        warranty: `${premiumBoiler?.warrantyYears || 10} years`,
        basePrice: premiumWithVat,
        isRecommended: false
      };
      
      const luxuryOption: QuoteOption = {
        tier: "Luxury",
        boilerMake: luxuryBoiler?.make || "Vaillant",
        boilerModel: luxuryBoiler?.model || "EcoTec Pro 28kW",
        warranty: `${luxuryBoiler?.warrantyYears || 12} years`,
        basePrice: luxuryWithVat,
        isRecommended: false
      };
      
      // Build components breakdown for standard option
      const components = [
        {
          name: `${standardBoiler?.make || "Baxi"} ${standardBoiler?.model || "800 Combi 2 24kW"}`,
          description: `${boilerType} boiler with ${recommendedSize}kW output, ${standardBoiler?.warrantyYears || 10} year warranty`,
          quantity: 1,
          unitPrice: standardBoiler?.supplyPrice || 120000,
          totalPrice: standardBoiler?.supplyPrice || 120000
        },
        {
          name: "Professional Installation",
          description: `${jobType} with system flush and commissioning`,
          quantity: 1,
          unitPrice: standardLabour,
          totalPrice: standardLabour
        },
        {
          name: "System Chemicals & Filter",
          description: "Fernox TF1 filter, inhibitor, and cleaner",
          quantity: 1,
          unitPrice: basicSundries,
          totalPrice: basicSundries
        }
      ];
      
      if (flueExtensionPrice > 0) {
        components.push({
          name: "Flue Extension",
          description: `${quoteData.flueExtension}m flue extension kit`,
          quantity: 1,
          unitPrice: flueExtensionPrice,
          totalPrice: flueExtensionPrice
        });
      }
      
      if (cylinderPrice > 0) {
        components.push({
          name: "Unvented Hot Water Cylinder",
          description: `${cylinderCapacity}L ${boilerType === 'System' ? 'indirect' : 'direct'} cylinder with expansion vessel`,
          quantity: 1,
          unitPrice: cylinderPrice,
          totalPrice: cylinderPrice
        });
      }
      
      if (condensatePumpPrice > 0) {
        components.push({
          name: "Condensate Pump",
          description: "Required due to lack of nearby drain",
          quantity: 1,
          unitPrice: condensatePumpPrice,
          totalPrice: condensatePumpPrice
        });
      }
      
      if (thermostatPrice > 0) {
        components.push({
          name: "Hive Smart Thermostat",
          description: "Smart thermostat upgrade with app control",
          quantity: 1,
          unitPrice: thermostatPrice,
          totalPrice: thermostatPrice
        });
      }
      
      const breakdown: PriceBreakdown = {
        boilerPrice: standardBoiler?.supplyPrice || 120000,
        boilerModel: `${standardBoiler?.make || "Baxi"} ${standardBoiler?.model || "800 Combi 2 24kW"}`,
        labourPrice: standardLabour,
        sundryPrice: basicSundries,
        flueExtensionPrice,
        flueExtensionLength: flueExtensionPrice > 0 ? `${quoteData.flueExtension}m` : 'None',
        megaflowPrice: cylinderPrice,
        condensatePumpPrice,
        thermostatPrice,
        parkingFee,
        parkingRequired: parkingFee > 0,
        discountAmount: 0,
        vatAmount: standardVat,
        subtotal: standardSubtotal,
        totalPrice: standardWithVat,
        waterFlowRate,
        components
      };
      
      return {
        standard: standardOption,
        premium: premiumOption,
        luxury: luxuryOption,
        breakdown,
        recommendedBoilerSize: recommendedSize,
        boilerType
      };
      
    } catch (error) {
      console.error('Error calculating quote:', error);
      
      // Fallback to basic calculation
      const basePrice = 250000; // £2,500 base
      const flueExtensionPrice = calculateFlueExtension(quoteData.flueExtension);
      const parkingFee = calculateParkingFee(quoteData.parkingDistance);
      
      const standardTotal = basePrice + flueExtensionPrice + parkingFee;
      const premiumTotal = Math.round(standardTotal * 1.2);
      const luxuryTotal = Math.round(standardTotal * 1.5);
      
      return {
        standard: {
          tier: "Standard",
          boilerMake: "Baxi",
          boilerModel: "800 Combi 2 24kW",
          warranty: "10 years",
          basePrice: standardTotal,
          isRecommended: true
        },
        premium: {
          tier: "Premium", 
          boilerMake: "Ideal",
          boilerModel: "Logic Max Combi2 C24",
          warranty: "10 years",
          basePrice: premiumTotal,
          isRecommended: false
        },
        luxury: {
          tier: "Luxury",
          boilerMake: "Vaillant", 
          boilerModel: "EcoTec Pro 28kW",
          warranty: "12 years",
          basePrice: luxuryTotal,
          isRecommended: false
        },
        breakdown: {
          boilerPrice: 120000,
          boilerModel: "Baxi 800 Combi 2 24kW",
          labourPrice: 135000,
          sundryPrice: 5000,
          flueExtensionPrice,
          flueExtensionLength: flueExtensionPrice > 0 ? `${quoteData.flueExtension}m` : 'None',
          megaflowPrice: 0,
          condensatePumpPrice: 0,
          thermostatPrice: 0,
          parkingFee,
          parkingRequired: parkingFee > 0,
          discountAmount: 0,
          vatAmount: Math.round(basePrice * 0.2),
          subtotal: basePrice,
          totalPrice: standardTotal,
          waterFlowRate: 10,
          components: [
            {
              name: "Baxi 800 Combi 2 24kW",
              description: "Combi boiler with 24kW output, 10 year warranty",
              quantity: 1,
              unitPrice: 120000,
              totalPrice: 120000
            },
            {
              name: "Professional Installation",
              description: "Standard installation with system flush",
              quantity: 1,
              unitPrice: 135000,
              totalPrice: 135000
            },
            {
              name: "System Chemicals & Filter",
              description: "Basic system protection",
              quantity: 1,
              unitPrice: 5000,
              totalPrice: 5000
            }
          ]
        },
        recommendedBoilerSize: calculateBoilerSize(quoteData.bedrooms, quoteData.bathrooms, quoteData.occupants || "2", quoteData.propertyType),
        boilerType: determineBoilerType(
          quoteData.bedrooms, 
          quoteData.bathrooms, 
          quoteData.occupants || "2",
          quoteData.currentBoiler,
          quoteData.propertyType
        )
      };
    }
  }
}

export async function saveQuote(quoteData: QuoteData) {
  const response = await apiRequest("POST", "/api/quotes", quoteData);
  return response.json();
}