import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { SelectionButton } from '@/components/ui/selection-button';
import { Home, Building, ArrowRight, Search, Bath, Bed, Users, Thermometer, Zap, Droplets, Navigation, Shield, CheckCircle, User, UserPlus, Car, Compass, Flame, Wrench, Router, Building2, Settings, Gauge, HardHat, MapPin, Plug, HelpCircle, Video, Camera, Receipt, CreditCard, Ruler, ChevronUp, ChevronDown, Check, X, Wifi, Package, Move, AlertCircle } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { QuoteData } from '@/types/quote';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface Step1Props {
  data: QuoteData;
  onUpdate: (updates: Partial<QuoteData>) => void;
  onNext: () => void;
}

export function Step1PropertyDetails({ data, onUpdate, onNext }: Step1Props) {
  const [selectedPropertyType, setSelectedPropertyType] = useState(data.propertyType);
  const [isValidatingPostcode, setIsValidatingPostcode] = useState(false);
  const [postcodeError, setPostcodeError] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const { toast } = useToast();

  const handlePropertyTypeSelect = (type: string) => {
    setSelectedPropertyType(type);
    onUpdate({ propertyType: type });
  };

  const handleBoilerTypeSelect = (boilerType: string) => {
    const updates: Partial<QuoteData> = { currentBoiler: boilerType };
    
    // Set flags for Unknown boiler type
    if (boilerType === 'Unknown') {
      updates.requiresVideoCall = true;
      updates.additionalPhotosRequired = true;
      updates.videoCallScheduled = false;
    } else {
      updates.requiresVideoCall = false;
      updates.additionalPhotosRequired = false;
      updates.videoCallScheduled = false;
    }
    
    onUpdate(updates);
  };

  const validatePostcode = async (postcode: string) => {
    if (!postcode.trim()) {
      setPostcodeError('Postcode is required');
      return false;
    }

    // Basic UK postcode format validation
    const postcodeRegex = /^[A-Z]{1,2}[0-9]{1,2}[A-Z]?\s*[0-9][A-Z]{2}$/i;
    if (!postcodeRegex.test(postcode.trim())) {
      setPostcodeError('Please enter a valid UK postcode');
      return false;
    }

    try {
      setIsValidatingPostcode(true);
      // Using postcode.io API for validation
      const response = await fetch(`https://api.postcodes.io/postcodes/${postcode.trim()}`);
      const result = await response.json();
      
      if (result.status === 200) {
        setPostcodeError('');
        return true;
      } else {
        setPostcodeError('Invalid postcode. Please check and try again.');
        return false;
      }
    } catch (error) {
      // If API is down, still allow form submission with basic validation
      setPostcodeError('');
      return true;
    } finally {
      setIsValidatingPostcode(false);
    }
  };

  const handlePostcodeChange = (value: string) => {
    const upperValue = value.toUpperCase();
    onUpdate({ postcode: upperValue });
    if (postcodeError) {
      setPostcodeError('');
    }
  };

  const handleSubmit = async () => {
    const errors: string[] = [];
    
    // Validate all required fields
    if (!data.propertyType) errors.push('Property type is required');
    if (!data.bedrooms) errors.push('Number of bedrooms is required');
    if (!data.bathrooms) errors.push('Number of bathrooms is required');
    if (!data.occupants) errors.push('Number of occupants is required');
    if (!data.currentBoiler) errors.push('Current boiler type is required');
    if (!data.flueLocation) errors.push('Flue location is required');
    if (!data.flueExtension) errors.push('Flue extension option is required');
    if (!data.parkingSituation) errors.push('Parking situation is required');
    if (!data.parkingDistance) errors.push('Parking distance is required');
    
    // For flats, also check floor level and lift availability
    if (data.propertyType === 'flat') {
      if (!data.floorLevel) errors.push('Floor level is required for flats');
      if (data.hasLift === undefined) errors.push('Lift availability is required for flats');
    }

    // Validate postcode
    if (!data.postcode) {
      errors.push('Postcode is required');
    } else {
      const isValidPostcode = await validatePostcode(data.postcode);
      if (!isValidPostcode) {
        errors.push('Valid postcode is required');
      }
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      toast({
        title: "Missing Information",
        description: "Please complete all required fields to continue.",
        variant: "destructive",
      });
      return;
    }

    setValidationErrors([]);
    onNext();
  };

  return (
    <GlassCard className="mb-8 fade-in">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-britannia-dark">Property Details</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Step 1 of 6</span>
            <ProgressBar value={1} max={6} />
          </div>
        </div>
        <p className="text-gray-600">Tell us about your property to get accurate recommendations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-4">Property Type</Label>
            <div className="grid grid-cols-2 gap-3">
              <SelectionButton
                icon={Home}
                label="House"
                value="house"
                selected={selectedPropertyType === 'house'}
                onClick={() => handlePropertyTypeSelect('house')}
              />
              <SelectionButton
                icon={Building}
                label="Flat/Apartment"
                value="flat"
                selected={selectedPropertyType === 'flat'}
                onClick={() => handlePropertyTypeSelect('flat')}
              />
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-4">Bedrooms</Label>
            <div className="grid grid-cols-4 gap-3">
              {[
                { value: '1', icon: Bed },
                { value: '2', icon: Bed },
                { value: '3', icon: Bed },
                { value: '4+', icon: Bed }
              ].map((bedroom) => (
                <SelectionButton
                  key={bedroom.value}
                  icon={bedroom.icon}
                  label={bedroom.value}
                  value={bedroom.value}
                  selected={data.bedrooms === bedroom.value}
                  onClick={() => onUpdate({ bedrooms: bedroom.value })}
                />
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-4">Bathrooms</Label>
            <div className="grid grid-cols-4 gap-3">
              {[
                { value: '1', icon: Bath },
                { value: '2', icon: Bath },
                { value: '3', icon: Bath },
                { value: '4+', icon: Bath }
              ].map((bathroom) => (
                <SelectionButton
                  key={bathroom.value}
                  icon={bathroom.icon}
                  label={bathroom.value}
                  value={bathroom.value}
                  selected={data.bathrooms === bathroom.value}
                  onClick={() => onUpdate({ bathrooms: bathroom.value })}
                />
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-4">Occupants</Label>
            <div className="grid grid-cols-4 gap-3">
              {[
                { value: '1', icon: User },
                { value: '2', icon: Users },
                { value: '3-4', icon: Users },
                { value: '5+', icon: UserPlus }
              ].map((occupant) => (
                <SelectionButton
                  key={occupant.value}
                  icon={occupant.icon}
                  label={occupant.value}
                  value={occupant.value}
                  selected={data.occupants === occupant.value}
                  onClick={() => onUpdate({ occupants: occupant.value })}
                />
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-4">What type of boiler do you currently have?</Label>
            <div className="grid grid-cols-1 gap-3">
              {[
                { 
                  value: 'Combi', 
                  icons: [Package, Flame], 
                  label: 'Combi Boiler',
                  description: 'Heats water instantly, no tanks.'
                },
                { 
                  value: 'System', 
                  icons: [Package, Building2], 
                  label: 'System Boiler',
                  description: 'Has a hot water cylinder, no loft tanks.'
                },
                { 
                  value: 'Regular', 
                  icons: [Package, Building2, Droplets], 
                  label: 'Conventional Boiler',
                  description: 'Has a cylinder AND tanks in the loft.'
                },
                { 
                  value: 'Electric', 
                  icons: [Plug, Zap], 
                  label: 'Electric Boiler',
                  description: 'Electric heating system.'
                },
                { 
                  value: 'Unknown', 
                  icons: [HelpCircle, Video], 
                  label: 'Unknown',
                  description: 'Not sure what type - video call required.'
                }
              ].map((boiler) => (
                <motion.button
                  key={boiler.value}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleBoilerTypeSelect(boiler.value)}
                  className={cn(
                    "relative p-4 rounded-xl border-2 transition-all duration-300 group text-left",
                    "backdrop-blur-md bg-gradient-to-br from-white/40 to-white/20",
                    "hover:from-white/60 hover:to-white/30 shadow-lg hover:shadow-xl",
                    data.currentBoiler === boiler.value
                      ? "border-orange-400 bg-gradient-to-br from-orange-100/80 to-orange-50/60 shadow-orange-200/50" 
                      : "border-white/30 hover:border-orange-200"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "p-3 rounded-full transition-all duration-300 flex-shrink-0",
                      "bg-white/20 group-hover:bg-white/30",
                      data.currentBoiler === boiler.value && "bg-orange-100/80"
                    )}>
                      <div className="flex items-center gap-1">
                        {boiler.icons.map((Icon, index) => (
                          <Icon 
                            key={index}
                            className={cn(
                              "w-4 h-4 transition-colors duration-300",
                              data.currentBoiler === boiler.value 
                                ? "text-orange-600" 
                                : "text-gray-600 group-hover:text-orange-500"
                            )} 
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className={cn(
                        "font-medium text-sm transition-colors duration-300",
                        data.currentBoiler === boiler.value 
                          ? "text-orange-700" 
                          : "text-gray-700 group-hover:text-orange-600"
                      )}>
                        {boiler.label}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        {boiler.description}
                      </p>
                      {boiler.value === 'Unknown' && (
                        <div className="flex items-center gap-1 mt-2">
                          <Video className="w-4 h-4 text-blue-600" />
                          <span className="text-xs text-blue-600 font-medium">Video call required</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {data.currentBoiler === boiler.value && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <CheckCircle className="w-3 h-3 text-white" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
            
            {data.currentBoiler === 'Unknown' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 p-4 bg-blue-50/50 rounded-xl border border-blue-200/50"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Camera className="w-5 h-5 text-blue-600" />
                  <h4 className="font-medium text-blue-700">Additional Photos Required</h4>
                </div>
                <p className="text-sm text-blue-600 mb-3">
                  Since you're unsure about your boiler type, please take these additional photos:
                </p>
                <ul className="text-sm text-blue-600 space-y-1">
                  <li>• Full view of your current boiler and surrounding area</li>
                  <li>• Any tanks or cylinders in loft/airing cupboard</li>
                </ul>
                <div className="mt-3 p-3 bg-yellow-50/50 rounded-lg border border-yellow-200/50">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-700">Video Call Required</span>
                  </div>
                  <p className="text-xs text-yellow-600 mt-1">
                    A video call will be scheduled to confirm your boiler type before finalizing the quotation.
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Postcode Input - Prominently Displayed */}
          <div className="p-6 bg-gradient-to-br from-orange-50/80 to-red-50/60 rounded-xl backdrop-blur-sm border border-orange-100">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-800">Property Location</h3>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Postcode *</Label>
              <div className="relative">
                <Input
                  placeholder="Enter postcode (e.g., SW1A 1AA)"
                  value={data.postcode}
                  onChange={(e) => handlePostcodeChange(e.target.value)}
                  className={cn(
                    "bg-white/80 border-2 transition-all duration-300 text-lg py-3 px-4 pl-12",
                    "placeholder:text-gray-500 focus:bg-white",
                    postcodeError 
                      ? "border-red-400 focus:border-red-500" 
                      : "border-orange-200 focus:border-orange-400"
                  )}
                />
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-orange-500" />
                {isValidatingPostcode && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full"></div>
                  </div>
                )}
              </div>
              {postcodeError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-red-600 text-sm"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{postcodeError}</span>
                </motion.div>
              )}
              <p className="text-xs text-gray-600">
                We use your postcode to calculate accurate pricing and check service availability
              </p>
            </div>
          </div>

          {/* Flue Location Group */}
          <div className="p-6 bg-gradient-to-br from-green-50/80 to-emerald-50/60 rounded-xl backdrop-blur-sm border border-green-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Flue (Exhaust Pipe) Details</h3>
            
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">Where is your boiler's flue?</Label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'external_wall', label: 'External Wall', icon: Compass },
                    { value: 'through_roof', label: 'Through Roof', icon: Home }
                  ].map((flue) => (
                    <motion.button
                      key={flue.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onUpdate({ flueLocation: flue.value })}
                      className={cn(
                        "p-4 rounded-lg border-2 transition-all duration-300 group",
                        "backdrop-blur-md bg-white/40 hover:bg-white/60",
                        data.flueLocation === flue.value
                          ? "border-green-400 bg-green-50/80 shadow-green-200/50" 
                          : "border-white/30 hover:border-green-200"
                      )}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <flue.icon className={cn(
                          "w-6 h-6 transition-colors duration-300",
                          data.flueLocation === flue.value 
                            ? "text-green-600" 
                            : "text-gray-600 group-hover:text-green-500"
                        )} />
                        <span className="text-sm font-medium">{flue.label}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">Does the flue require an extension?</Label>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { value: '0', label: 'None (Standard)', icon: Check },
                    { value: '1.5', label: '1-2m', icon: Ruler },
                    { value: '3.5', label: '3-4m', icon: Ruler },
                    { value: '5', label: '5m+', icon: Ruler }
                  ].map((extension) => (
                    <motion.button
                      key={extension.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onUpdate({ flueExtension: extension.value })}
                      className={cn(
                        "p-4 rounded-lg border-2 transition-all duration-300 group",
                        "backdrop-blur-md bg-white/40 hover:bg-white/60",
                        data.flueExtension === extension.value
                          ? "border-green-400 bg-green-50/80 shadow-green-200/50" 
                          : "border-white/30 hover:border-green-200"
                      )}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <extension.icon className={cn(
                          "w-6 h-6 transition-colors duration-300",
                          data.flueExtension === extension.value 
                            ? "text-green-600" 
                            : "text-gray-600 group-hover:text-green-500"
                        )} />
                        <span className="text-sm font-medium">{extension.label}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Questions Group */}
          <div className="p-6 bg-gradient-to-br from-yellow-50/80 to-amber-50/60 rounded-xl backdrop-blur-sm border border-yellow-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Questions</h3>
            
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">Is there a suitable drain near your boiler?</Label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'yes', label: 'Yes', icon: Check },
                    { value: 'no', label: 'No', icon: X }
                  ].map((drain) => (
                    <motion.button
                      key={drain.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onUpdate({ drainNearby: drain.value === 'yes' })}
                      className={cn(
                        "p-4 rounded-lg border-2 transition-all duration-300 group",
                        "backdrop-blur-md bg-white/40 hover:bg-white/60",
                        (data.drainNearby && drain.value === 'yes') || (!data.drainNearby && drain.value === 'no')
                          ? "border-yellow-400 bg-yellow-50/80 shadow-yellow-200/50" 
                          : "border-white/30 hover:border-yellow-200"
                      )}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <drain.icon className={cn(
                          "w-6 h-6 transition-colors duration-300",
                          (data.drainNearby && drain.value === 'yes') || (!data.drainNearby && drain.value === 'no')
                            ? "text-yellow-600" 
                            : "text-gray-600 group-hover:text-yellow-500"
                        )} />
                        <span className="text-sm font-medium">{drain.label}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">Would you like to move your boiler?</Label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'yes', label: 'Yes', icon: Check },
                    { value: 'no', label: 'No', icon: X }
                  ].map((move) => (
                    <motion.button
                      key={move.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onUpdate({ moveBoiler: move.value === 'yes' })}
                      className={cn(
                        "p-4 rounded-lg border-2 transition-all duration-300 group",
                        "backdrop-blur-md bg-white/40 hover:bg-white/60",
                        (data.moveBoiler && move.value === 'yes') || (!data.moveBoiler && move.value === 'no')
                          ? "border-yellow-400 bg-yellow-50/80 shadow-yellow-200/50" 
                          : "border-white/30 hover:border-yellow-200"
                      )}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <move.icon className={cn(
                          "w-6 h-6 transition-colors duration-300",
                          (data.moveBoiler && move.value === 'yes') || (!data.moveBoiler && move.value === 'no')
                            ? "text-yellow-600" 
                            : "text-gray-600 group-hover:text-yellow-500"
                        )} />
                        <span className="text-sm font-medium">{move.label}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Parking Situation Group */}
          <div className="p-6 bg-gradient-to-br from-blue-50/80 to-indigo-50/60 rounded-xl backdrop-blur-sm border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Parking Situation</h3>
            
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">What is the parking situation?</Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'free', label: 'Free Parking', icon: Car },
                    { value: 'resident', label: 'Resident Permit', icon: Shield },
                    { value: 'paid', label: 'Paid / Display', icon: CreditCard }
                  ].map((parking) => (
                    <motion.button
                      key={parking.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onUpdate({ parkingSituation: parking.value })}
                      className={cn(
                        "p-4 rounded-lg border-2 transition-all duration-300 group",
                        "backdrop-blur-md bg-white/40 hover:bg-white/60",
                        data.parkingSituation === parking.value
                          ? "border-blue-400 bg-blue-50/80 shadow-blue-200/50" 
                          : "border-white/30 hover:border-blue-200"
                      )}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <parking.icon className={cn(
                          "w-6 h-6 transition-colors duration-300",
                          data.parkingSituation === parking.value 
                            ? "text-blue-600" 
                            : "text-gray-600 group-hover:text-blue-500"
                        )} />
                        <span className="text-sm font-medium">{parking.label}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">How far from parking?</Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: '10', label: '< 20m', icon: MapPin },
                    { value: '35', label: '20-50m', icon: Navigation },
                    { value: '75', label: '> 50m', icon: Compass }
                  ].map((distance) => (
                    <motion.button
                      key={distance.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onUpdate({ parkingDistance: distance.value })}
                      className={cn(
                        "p-4 rounded-lg border-2 transition-all duration-300 group",
                        "backdrop-blur-md bg-white/40 hover:bg-white/60",
                        data.parkingDistance === distance.value
                          ? "border-blue-400 bg-blue-50/80 shadow-blue-200/50" 
                          : "border-white/30 hover:border-blue-200"
                      )}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <distance.icon className={cn(
                          "w-6 h-6 transition-colors duration-300",
                          data.parkingDistance === distance.value 
                            ? "text-blue-600" 
                            : "text-gray-600 group-hover:text-blue-500"
                        )} />
                        <span className="text-sm font-medium">{distance.label}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Floor Level for Flats */}
          {data.propertyType === 'flat' && (
            <div className="p-6 bg-gradient-to-br from-purple-50/80 to-pink-50/60 rounded-xl backdrop-blur-sm border border-purple-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Floor Information</h3>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">What floor is your property on?</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'ground', label: 'Ground', icon: Home },
                      { value: '1st-2nd', label: '1st - 2nd', icon: Building },
                      { value: '3rd+', label: '3rd+', icon: Building2 }
                    ].map((floor) => (
                      <motion.button
                        key={floor.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onUpdate({ floorLevel: floor.value })}
                        className={cn(
                          "p-4 rounded-lg border-2 transition-all duration-300 group",
                          "backdrop-blur-md bg-white/40 hover:bg-white/60",
                          data.floorLevel === floor.value
                            ? "border-purple-400 bg-purple-50/80 shadow-purple-200/50" 
                            : "border-white/30 hover:border-purple-200"
                        )}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <floor.icon className={cn(
                            "w-6 h-6 transition-colors duration-300",
                            data.floorLevel === floor.value 
                              ? "text-purple-600" 
                              : "text-gray-600 group-hover:text-purple-500"
                          )} />
                          <span className="text-sm font-medium">{floor.label}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">Is there a working lift/elevator available?</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'yes', label: 'Yes', icon: ChevronUp },
                      { value: 'no', label: 'No', icon: X }
                    ].map((lift) => (
                      <motion.button
                        key={lift.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onUpdate({ hasLift: lift.value === 'yes' })}
                        className={cn(
                          "p-4 rounded-lg border-2 transition-all duration-300 group",
                          "backdrop-blur-md bg-white/40 hover:bg-white/60",
                          (data.hasLift && lift.value === 'yes') || (!data.hasLift && lift.value === 'no')
                            ? "border-purple-400 bg-purple-50/80 shadow-purple-200/50" 
                            : "border-white/30 hover:border-purple-200"
                        )}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <lift.icon className={cn(
                            "w-6 h-6 transition-colors duration-300",
                            (data.hasLift && lift.value === 'yes') || (!data.hasLift && lift.value === 'no')
                              ? "text-purple-600" 
                              : "text-gray-600 group-hover:text-purple-500"
                          )} />
                          <span className="text-sm font-medium">{lift.label}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="drain-nearby"
                checked={data.drainNearby}
                onCheckedChange={(checked) => onUpdate({ drainNearby: checked as boolean })}
              />
              <Label htmlFor="drain-nearby" className="text-sm">Drain nearby for condensate</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="move-boiler"
                checked={data.moveBoiler}
                onCheckedChange={(checked) => onUpdate({ moveBoiler: checked as boolean })}
              />
              <Label htmlFor="move-boiler" className="text-sm">Need to move boiler location</Label>
            </div>
          </div>
        </div>
      </div>

      {/* Validation Errors Display */}
      {validationErrors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg"
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <h3 className="text-red-800 font-medium">Please complete the following:</h3>
          </div>
          <ul className="text-sm text-red-700 space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                {error}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 flex justify-between items-center"
      >
        <div className="text-sm text-gray-600">
          All fields marked with * are required
        </div>
        <Button
          onClick={handleSubmit}
          disabled={isValidatingPostcode}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
        >
          {isValidatingPostcode ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              Validating...
            </>
          ) : (
            <>
              Continue to Photos
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </motion.div>
    </GlassCard>
  );
}