import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ArrowLeft, Star, Crown, Gem, Check } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { QuoteData, QuoteOption } from '@/types/quote';
import { calculateIntelligentQuote, IntelligentQuoteOptions } from '@/lib/quote-engine';
import { useToast } from '@/hooks/use-toast';
import { OrderSummary } from './order-summary';
import { generateQuoteDocument, downloadQuoteAsPDF } from '@/lib/quote-generator';

interface Step3Props {
  data: QuoteData;
  onUpdate: (updates: Partial<QuoteData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function Step3QuoteSelection({ data, onUpdate, onNext, onPrev }: Step3Props) {
  const [selectedPackage, setSelectedPackage] = useState(data.selectedPackage);
  const [selectedThermostat, setSelectedThermostat] = useState(data.thermostatUpgrade || 'standard');
  const [quotes, setQuotes] = useState<QuoteOption[]>(data.quotes || []);
  const [intelligentQuotes, setIntelligentQuotes] = useState<IntelligentQuoteOptions | null>(null);
  const [loading, setLoading] = useState(!data.intelligentQuote);
  const { toast } = useToast();

  // Load intelligent quotes on component mount
  useEffect(() => {
    // Skip if already have intelligentQuote or missing required data
    if (data.intelligentQuote || !data.bedrooms || !data.bathrooms) {
      setLoading(false);
      return;
    }

    const loadQuotes = async () => {
      try {
        setLoading(true);
        
        // Call the enhanced intelligent quote API
        const response = await fetch('/api/calculate-intelligent-quote', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bedrooms: data.bedrooms,
            bathrooms: data.bathrooms,
            occupants: data.occupants,
            propertyType: data.propertyType,
            currentBoiler: data.currentBoiler,
            postcode: data.postcode,
            flueLocation: data.flueLocation,
            flueExtension: data.flueExtension,
            drainNearby: data.drainNearby,
            moveBoiler: data.moveBoiler,
            parkingSituation: data.parkingSituation,
            parkingDistance: data.parkingDistance,
            floorLevel: data.floorLevel,
            hasLift: data.hasLift
          })
        });
        
        if (!response.ok) {
          throw new Error('Failed to calculate intelligent quote');
        }
        
        const intelligentQuotesData = await response.json();
        
        // Transform the API response to match the expected IntelligentQuoteOptions format
        const transformedQuotes = {
          standard: {
            tier: "Budget",
            boilerMake: intelligentQuotesData.quotes[0].boilerMake,
            boilerModel: intelligentQuotesData.quotes[0].boilerModel,
            warranty: intelligentQuotesData.quotes[0].warranty,
            basePrice: intelligentQuotesData.quotes[0].basePrice,
            isRecommended: intelligentQuotesData.quotes[0].isRecommended
          },
          premium: {
            tier: "Mid-Range",
            boilerMake: intelligentQuotesData.quotes[1].boilerMake,
            boilerModel: intelligentQuotesData.quotes[1].boilerModel,
            warranty: intelligentQuotesData.quotes[1].warranty,
            basePrice: intelligentQuotesData.quotes[1].basePrice,
            isRecommended: intelligentQuotesData.quotes[1].isRecommended
          },
          luxury: {
            tier: "Premium",
            boilerMake: intelligentQuotesData.quotes[2].boilerMake,
            boilerModel: intelligentQuotesData.quotes[2].boilerModel,
            warranty: intelligentQuotesData.quotes[2].warranty,
            basePrice: intelligentQuotesData.quotes[2].basePrice,
            isRecommended: intelligentQuotesData.quotes[2].isRecommended
          },
          breakdown: {
            boilerPrice: intelligentQuotesData.priceBreakdown.boilerPrice,
            boilerModel: intelligentQuotesData.quotes[0].boilerModel,
            labourPrice: intelligentQuotesData.priceBreakdown.labourPrice,
            sundryPrice: intelligentQuotesData.priceBreakdown.sundryPrice,
            flueExtensionPrice: intelligentQuotesData.priceBreakdown.flueExtensionPrice,
            flueExtensionLength: "Standard",
            megaflowPrice: intelligentQuotesData.priceBreakdown.cylinderPrice,
            condensatePumpPrice: intelligentQuotesData.priceBreakdown.condensatePumpPrice,
            thermostatPrice: intelligentQuotesData.priceBreakdown.thermostatPrice,
            parkingFee: intelligentQuotesData.priceBreakdown.parkingFee,
            parkingRequired: intelligentQuotesData.priceBreakdown.parkingFee > 0,
            discountAmount: 0,
            vatAmount: intelligentQuotesData.priceBreakdown.vatAmount,
            subtotal: intelligentQuotesData.priceBreakdown.subtotal,
            totalPrice: intelligentQuotesData.priceBreakdown.totalPrice,
            waterFlowRate: intelligentQuotesData.quotes[0].flowRate || 12,
            components: [
              {
                name: intelligentQuotesData.quotes[0].boilerModel,
                description: `${intelligentQuotesData.quotes[0].boilerType} boiler - ${intelligentQuotesData.quotes[0].kWOutput}kW`,
                quantity: 1,
                unitPrice: intelligentQuotesData.priceBreakdown.boilerPrice,
                totalPrice: intelligentQuotesData.priceBreakdown.boilerPrice
              },
              {
                name: "Professional Installation",
                description: "Full installation by Gas Safe registered engineer",
                quantity: 1,
                unitPrice: intelligentQuotesData.priceBreakdown.labourPrice,
                totalPrice: intelligentQuotesData.priceBreakdown.labourPrice
              },
              {
                name: "System Sundries",
                description: "Magnetic filter, system flush, TRVs, thermostat",
                quantity: 1,
                unitPrice: intelligentQuotesData.priceBreakdown.sundryPrice,
                totalPrice: intelligentQuotesData.priceBreakdown.sundryPrice
              }
            ],
            installationNotes: intelligentQuotesData.recommendations?.installationNotes || [],
            systemExplanation: intelligentQuotesData.recommendations?.systemExplanation || "",
            whyThisBoiler: intelligentQuotesData.recommendations?.whyThisBoiler || ""
          },
          recommendedBoilerSize: intelligentQuotesData.analysis.recommendedBoilerSize,
          boilerType: intelligentQuotesData.analysis.recommendedBoilerType
        };
        
        // Add cylinder component if present
        if (intelligentQuotesData.priceBreakdown.cylinderPrice > 0) {
          transformedQuotes.breakdown.components.push({
            name: "Hot Water Cylinder",
            description: `${intelligentQuotesData.analysis.cylinderCapacity}L Megaflo cylinder`,
            quantity: 1,
            unitPrice: intelligentQuotesData.priceBreakdown.cylinderPrice,
            totalPrice: intelligentQuotesData.priceBreakdown.cylinderPrice
          });
        }
        
        setIntelligentQuotes(transformedQuotes);
        
        // Convert to QuoteOption format from the enhanced API response with tier mapping
        const tierMapping = {
          'Standard': 'Budget',
          'Premium': 'Mid-Range',
          'Luxury': 'Premium'
        };
        
        const quoteOptions: QuoteOption[] = intelligentQuotesData.quotes.map((quote: any) => ({
          tier: (tierMapping as Record<string, string>)[quote.tier] || quote.tier,
          boilerMake: quote.boilerMake,
          boilerModel: quote.boilerModel,
          warranty: quote.warranty,
          basePrice: Math.round(quote.basePrice / 100), // Convert from pence to pounds
          isRecommended: quote.isRecommended
        }));
        
        setQuotes(quoteOptions);
        
        // Update the main quote data with intelligent quotes and full breakdown
        onUpdate({
          quotes: quoteOptions,
          intelligentQuote: intelligentQuotesData
        });
      } catch (error) {
        console.error('Error loading quotes:', error);
        toast({
          title: "Error Loading Quotes",
          description: "Please try again or contact support if the problem persists.",
          variant: "destructive",
        });
        
        // Fallback to basic quotes
        setQuotes([
          {
            tier: "Budget",
            boilerMake: "Baxi",
            boilerModel: "800 Combi 2 24kW",
            warranty: "10 years",
            basePrice: 2850,
            isRecommended: false
          },
          {
            tier: "Mid-Range",
            boilerMake: "Ideal",
            boilerModel: "Logic Max Combi2 C24",
            warranty: "10 years",
            basePrice: 3450,
            isRecommended: true
          },
          {
            tier: "Premium",
            boilerMake: "Vaillant",
            boilerModel: "EcoTec Pro 28kW",
            warranty: "12 years",
            basePrice: 4250,
            isRecommended: false
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadQuotes();
  }, []); // Run only once on mount

  const handlePackageSelect = (tier: string) => {
    setSelectedPackage(tier);
    const selectedQuote = quotes.find(q => q.tier === tier);
    if (selectedQuote) {
      onUpdate({ 
        selectedPackage: tier, 
        totalPrice: selectedQuote.basePrice + getThermostatPrice(selectedThermostat)
      });
    }
  };

  const handleThermostatSelect = (thermostat: string) => {
    setSelectedThermostat(thermostat);
    const selectedQuote = quotes.find(q => q.tier === selectedPackage);
    if (selectedQuote) {
      onUpdate({ 
        thermostatUpgrade: thermostat,
        totalPrice: selectedQuote.basePrice + getThermostatPrice(thermostat)
      });
    }
  };

  const getThermostatPrice = (thermostat: string) => {
    switch (thermostat) {
      case 'hive': return 150;
      case 'nest': return 199;
      default: return 0;
    }
  };

  const getPackageIcon = (tier: string) => {
    switch (tier) {
      case 'Budget': return <Star className="w-8 h-8 stroke-[1.5]" />;
      case 'Mid-Range': return <Crown className="w-8 h-8 stroke-[1.5]" />;
      case 'Premium': return <Gem className="w-8 h-8 stroke-[1.5]" />;
      default: return <Star className="w-8 h-8 stroke-[1.5]" />;
    }
  };

  const getPackageColor = (tier: string) => {
    switch (tier) {
      case 'Budget': return 'bg-gradient-to-br from-slate-50 to-slate-100 text-slate-700 shadow-lg';
      case 'Mid-Range': return 'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 shadow-lg';
      case 'Premium': return 'bg-gradient-to-br from-amber-50 to-orange-100 text-orange-700 shadow-lg';
      default: return 'bg-gradient-to-br from-slate-50 to-slate-100 text-slate-700 shadow-lg';
    }
  };

  if (loading) {
    return (
      <GlassCard className="mb-8 fade-in">
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Calculating your personalized quotes...</p>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="mb-8 fade-in">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-britannia-dark">Your Fixed-Price Quotes</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Step 3 of 6</span>
            <ProgressBar value={3} max={6} />
          </div>
        </div>
        <p className="text-gray-600">Choose the perfect package for your home</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {quotes.map((quote) => (
          <Card
            key={quote.tier}
            className={`pricing-card cursor-pointer transition-all duration-400 relative ${
              selectedPackage === quote.tier 
                ? 'selected ring-2 ring-orange-500 bg-gradient-to-br from-orange-50 to-orange-100 shadow-lg' 
                : 'hover:shadow-lg hover:ring-1 hover:ring-orange-200'
            }`}
            onClick={() => handlePackageSelect(quote.tier)}
          >
            {quote.isRecommended && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
            )}
            
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${getPackageColor(quote.tier)} border border-white/20`}>
                  {getPackageIcon(quote.tier)}
                </div>
                <h4 className="text-xl font-bold text-britannia-dark mb-2">{quote.tier}</h4>
                <p className="text-gray-600 text-sm">
                  {quote.tier === 'Budget' && 'Great value option'}
                  {quote.tier === 'Mid-Range' && 'Perfect balance of quality & value'}
                  {quote.tier === 'Premium' && 'Ultimate performance & features'}
                </p>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm">
                  <Check className="w-5 h-5 text-emerald-600 mr-3 stroke-2" />
                  <span className="text-gray-700">{quote.boilerMake} {quote.boilerModel}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Check className="w-5 h-5 text-emerald-600 mr-3 stroke-2" />
                  <span className="text-gray-700">{quote.warranty}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Check className="w-5 h-5 text-emerald-600 mr-3 stroke-2" />
                  <span className="text-gray-700">{quote.tier === 'Budget' ? 'Standard' : quote.tier === 'Mid-Range' ? 'Premium' : 'Expert'} Installation</span>
                </div>
                <div className="flex items-center text-sm">
                  <Check className="w-5 h-5 text-emerald-600 mr-3 stroke-2" />
                  <span className="text-gray-700">System Flush</span>
                </div>
                {quote.tier !== 'Budget' && (
                  <div className="flex items-center text-sm">
                    <Check className="w-5 h-5 text-emerald-600 mr-3 stroke-2" />
                    <span className="text-gray-700">Magnetic Filter</span>
                  </div>
                )}
                {quote.tier === 'Premium' && (
                  <div className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-britannia-success mr-2" />
                    <span>Annual Service</span>
                  </div>
                )}
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-britannia-dark mb-4">
                  £{quote.basePrice.toLocaleString()}.00
                </div>
                <Button
                  className={`w-full py-3 rounded-lg font-medium transition-all duration-300 ${
                    selectedPackage === quote.tier 
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg' 
                      : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-orange-100 hover:to-orange-200 hover:text-orange-800'
                  }`}
                  onClick={() => handlePackageSelect(quote.tier)}
                >
                  {selectedPackage === quote.tier ? (
                    <><Check className="w-4 h-4 mr-2" />Selected</>
                  ) : (
                    'Select Package'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Thermostat Upgrades */}
      <GlassCard className="mb-8">
        <h4 className="text-lg font-semibold text-britannia-dark mb-4">Optional Thermostat Upgrades</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card
            className={`cursor-pointer transition-all duration-300 ${
              selectedThermostat === 'standard' ? 'border-primary bg-blue-50' : 'hover:border-primary'
            }`}
            onClick={() => handleThermostatSelect('standard')}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium">Standard Wireless</h5>
                  <p className="text-sm text-gray-600">Included with package</p>
                </div>
                <div className="text-primary font-bold">£0</div>
              </div>
            </CardContent>
          </Card>
          
          <Card
            className={`cursor-pointer transition-all duration-300 ${
              selectedThermostat === 'hive' ? 'border-primary bg-blue-50' : 'hover:border-primary'
            }`}
            onClick={() => handleThermostatSelect('hive')}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium">Hive Smart Thermostat</h5>
                  <p className="text-sm text-gray-600">Control from anywhere</p>
                </div>
                <div className="text-primary font-bold">+£150</div>
              </div>
            </CardContent>
          </Card>
          
          <Card
            className={`cursor-pointer transition-all duration-300 ${
              selectedThermostat === 'nest' ? 'border-primary bg-blue-50' : 'hover:border-primary'
            }`}
            onClick={() => handleThermostatSelect('nest')}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium">Nest Learning</h5>
                  <p className="text-sm text-gray-600">AI-powered efficiency</p>
                </div>
                <div className="text-primary font-bold">+£199</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </GlassCard>

      {/* Comprehensive Order Summary */}
      {selectedPackage && intelligentQuotes && (
        <div className="mb-8">
          <OrderSummary
            breakdown={intelligentQuotes.breakdown}
            selectedTier={selectedPackage}
            onDownloadQuote={() => {
              if (intelligentQuotes) {
                const quoteDocument = generateQuoteDocument(data, intelligentQuotes.breakdown, selectedPackage);
                downloadQuoteAsPDF(quoteDocument);
                toast({
                  title: "Quote Downloaded",
                  description: "Your detailed quote has been downloaded successfully.",
                });
              }
            }}
          />
        </div>
      )}

      {/* Validation Summary */}
      {!selectedPackage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">
            Please select a package to continue
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0">
        <Button
          variant="outline"
          onClick={onPrev}
          className="px-6 sm:px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors order-2 sm:order-1"
        >
          <ArrowLeft className="w-4 h-4 mr-2 sm:mr-3" />
          Back
        </Button>
        <Button
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 sm:px-10 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onNext}
          disabled={!selectedPackage}
        >
          {selectedPackage ? (
            <>Continue <ArrowRight className="w-4 h-4 ml-2 sm:ml-3" /></>
          ) : (
            <>Select Package to Continue</>
          )}
        </Button>
      </div>
    </GlassCard>
  );
}
