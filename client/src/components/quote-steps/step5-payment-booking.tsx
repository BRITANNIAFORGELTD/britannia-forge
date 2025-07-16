import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { Lock, ArrowLeft, ArrowRight, Calendar, Clock } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { QuoteData } from '@/types/quote';

interface Step5Props {
  data: QuoteData;
  onUpdate: (updates: Partial<QuoteData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function Step5PaymentBooking({ data, onUpdate, onNext, onPrev }: Step5Props) {
  const [paymentMethod, setPaymentMethod] = useState(data.paymentMethod);
  const [agreedToTerms, setAgreedToTerms] = useState(data.agreedToTerms);
  const [smsUpdates, setSmsUpdates] = useState(data.smsUpdates);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });
  
  // Multiple appointment options - first is mandatory, second and third are optional
  const [appointmentOptions, setAppointmentOptions] = useState({
    primary: (data as any).preferredDate || '',
    secondary: data.secondaryDate || '',
    tertiary: data.tertiaryDate || ''
  });
  
  // Get today's date for minimum date restriction
  const today = new Date().toISOString().split('T')[0];

  const selectedQuote = data.quotes?.find(q => q.tier === data.selectedPackage);
  const thermostatPrice = data.thermostatUpgrade === 'hive' ? 15000 : 
                         data.thermostatUpgrade === 'nest' ? 19900 : 0;
  
  // Get price breakdown from intelligent quote engine
  const priceBreakdown = data.intelligentQuote?.priceBreakdown;
  const subtotal = priceBreakdown ? priceBreakdown.subtotal + thermostatPrice : 0;
  const vatAmount = priceBreakdown ? priceBreakdown.vatAmount : 0;
  const total = priceBreakdown ? priceBreakdown.totalPrice + thermostatPrice : 0;
  
  // Professional deposit system - minimum £100 or 15% of total, whichever is higher
  const percentageDeposit = Math.round(total * 0.15); // 15% deposit
  const minimumDeposit = 10000; // £100 minimum (in pence)
  const depositAmount = Math.max(percentageDeposit, minimumDeposit);

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
    onUpdate({ paymentMethod: method });
  };

  const handleTermsChange = (checked: boolean) => {
    setAgreedToTerms(checked);
    onUpdate({ agreedToTerms: checked });
  };

  const handleSmsChange = (checked: boolean) => {
    setSmsUpdates(checked);
    onUpdate({ smsUpdates: checked });
  };

  const handleAppointmentChange = (option: 'primary' | 'secondary' | 'tertiary', value: string) => {
    const newOptions = { ...appointmentOptions, [option]: value };
    setAppointmentOptions(newOptions);
    onUpdate({ 
      preferredDate: newOptions.primary,
      secondaryDate: newOptions.secondary,
      tertiaryDate: newOptions.tertiary
    });
  };

  const canProceed = () => {
    return paymentMethod && 
           agreedToTerms && 
           appointmentOptions.primary && 
           cardDetails.cardNumber && 
           cardDetails.expiryDate && 
           cardDetails.cvv &&
           cardDetails.nameOnCard;
  };

  const getPaymentAmount = () => {
    if (paymentMethod === 'full') {
      return Math.round(total * 0.95); // 5% discount for full payment
    }
    return depositAmount;
  };

  return (
    <GlassCard className="mb-8 fade-in">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-britannia-dark">Secure Your Booking</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Step 5 of 6</span>
            <ProgressBar value={5} max={6} />
          </div>
        </div>
        <p className="text-gray-600">Final step - secure your installation date</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <GlassCard>
            <h4 className="text-lg font-semibold text-britannia-dark mb-4">Order Summary ({data.selectedPackage})</h4>
            <div className="space-y-3">
              {/* Main Boiler */}
              <div className="flex justify-between">
                <span>{selectedQuote?.boilerMake} {selectedQuote?.boilerModel}</span>
                <span className="font-medium">£{priceBreakdown ? (priceBreakdown.boilerPrice / 100).toFixed(2) : '0.00'}</span>
              </div>
              
              {/* Labour */}
              <div className="flex justify-between">
                <span>Professional Installation</span>
                <span className="font-medium">£{priceBreakdown ? (priceBreakdown.labourPrice / 100).toFixed(2) : '0.00'}</span>
              </div>
              
              {/* Cylinder if applicable */}
              {priceBreakdown?.cylinderPrice > 0 && (
                <div className="flex justify-between">
                  <span>Hot Water Cylinder</span>
                  <span className="font-medium">£{(priceBreakdown.cylinderPrice / 100).toFixed(2)}</span>
                </div>
              )}
              
              {/* Sundries */}
              <div className="flex justify-between">
                <span>Professional Sundries Package</span>
                <span className="font-medium">£{priceBreakdown ? (priceBreakdown.sundryPrice / 100).toFixed(2) : '0.00'}</span>
              </div>
              
              {/* Thermostat */}
              <div className="flex justify-between">
                <span>
                  {data.thermostatUpgrade === 'hive' ? 'Hive Smart Thermostat' :
                   data.thermostatUpgrade === 'nest' ? 'Nest Learning Thermostat' :
                   'Standard Wireless Thermostat'}
                </span>
                <span className="font-medium">£{(thermostatPrice / 100).toFixed(2)}</span>
              </div>
              
              {/* Parking note if applicable */}
              {data.parkingSituation === 'Paid / Display' && (
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <div className="font-medium">Parking Arrangements</div>
                      <div>This property is in a paid parking area. Our engineer will work with you to arrange suitable parking - either through a visitor parking permit or by reimbursing parking costs. This flexible arrangement ensures fairness for all parties.</div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium">£{priceBreakdown ? (priceBreakdown.subtotal / 100).toFixed(2) : '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span>VAT (20%)</span>
                  <span className="font-medium">£{priceBreakdown ? (priceBreakdown.vatAmount / 100).toFixed(2) : '0.00'}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-britannia-dark">
                  <span>Total</span>
                  <span>£{(total / 100).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h4 className="text-lg font-semibold text-britannia-dark mb-4">Payment Options</h4>
            <RadioGroup value={paymentMethod} onValueChange={handlePaymentMethodChange}>
              <div className="space-y-3">
                <Label className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-primary transition-colors cursor-pointer">
                  <RadioGroupItem value="deposit" className="mr-3" />
                  <div>
                    <div className="font-medium">Pay £{(depositAmount / 100).toFixed(2)} Deposit</div>
                    <div className="text-sm text-gray-500">Professional deposit to secure your booking - prevents no-access situations</div>
                  </div>
                </Label>
                <Label className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-primary transition-colors cursor-pointer">
                  <RadioGroupItem value="full" className="mr-3" />
                  <div>
                    <div className="font-medium">Pay Full Amount (£{(Math.round(total * 0.95) / 100).toFixed(2)})</div>
                    <div className="text-sm text-gray-500">Complete payment now, 5% discount applied</div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </GlassCard>
        </div>

        <div className="space-y-6">
          <GlassCard>
            <h4 className="text-lg font-semibold text-britannia-dark mb-4">Payment Details</h4>
            <div className="space-y-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">Card Number</Label>
                <Input
                  type="text"
                  value={cardDetails.cardNumber}
                  onChange={(e) => setCardDetails({...cardDetails, cardNumber: e.target.value})}
                  placeholder="1234 5678 9012 3456"
                  className="w-full"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</Label>
                  <Input
                    type="text"
                    value={cardDetails.expiryDate}
                    onChange={(e) => setCardDetails({...cardDetails, expiryDate: e.target.value})}
                    placeholder="MM/YY"
                    className="w-full"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">CVV</Label>
                  <Input
                    type="text"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                    placeholder="123"
                    className="w-full"
                  />
                </div>
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">Name on Card</Label>
                <Input
                  type="text"
                  value={cardDetails.nameOnCard}
                  onChange={(e) => setCardDetails({...cardDetails, nameOnCard: e.target.value})}
                  placeholder="John Smith"
                  className="w-full"
                />
              </div>
            </div>
          </GlassCard>

          {/* Installation Appointment Booking */}
          <GlassCard>
            <h4 className="text-lg font-semibold text-britannia-dark mb-4">
              <Calendar className="w-5 h-5 inline mr-2" />
              Installation Appointment Options
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Select your preferred installation dates. First date is mandatory, additional dates are optional but give more flexibility for scheduling.
            </p>
            
            <div className="space-y-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="text-red-500">*</span> Primary Date (Required)
                </Label>
                <Input
                  type="date"
                  value={appointmentOptions.primary}
                  onChange={(e) => handleAppointmentChange('primary', e.target.value)}
                  min={today}
                  className="w-full"
                />
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Secondary Date (Optional)
                </Label>
                <Input
                  type="date"
                  value={appointmentOptions.secondary}
                  onChange={(e) => handleAppointmentChange('secondary', e.target.value)}
                  min={today}
                  className="w-full"
                />
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Tertiary Date (Optional)
                </Label>
                <Input
                  type="date"
                  value={appointmentOptions.tertiary}
                  onChange={(e) => handleAppointmentChange('tertiary', e.target.value)}
                  min={today}
                  className="w-full"
                />
              </div>
            </div>
          </GlassCard>

          <div className="space-y-4">
            <Label className="flex items-start cursor-pointer">
              <Checkbox
                checked={agreedToTerms}
                onCheckedChange={handleTermsChange}
                className="mt-1 mr-3"
              />
              <span className="text-sm text-gray-700">
                I agree to the <a href="#" className="text-primary hover:underline">Terms & Conditions</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
              </span>
            </Label>
            <Label className="flex items-start cursor-pointer">
              <Checkbox
                checked={smsUpdates}
                onCheckedChange={handleSmsChange}
                className="mt-1 mr-3"
              />
              <span className="text-sm text-gray-700">I would like to receive updates about my installation via SMS</span>
            </Label>
          </div>
        </div>
      </div>

      {/* Validation Summary */}
      {!canProceed() && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">
            Please complete all required fields: 
            {!paymentMethod && " payment method,"}
            {!appointmentOptions.primary && " primary installation date,"}
            {!cardDetails.cardNumber && " card number,"}
            {!cardDetails.expiryDate && " expiry date,"}
            {!cardDetails.cvv && " CVV,"}
            {!cardDetails.nameOnCard && " name on card,"}
            {!agreedToTerms && " terms acceptance"}
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
          disabled={!canProceed()}
        >
          {canProceed() ? (
            <>Secure Booking <Lock className="w-4 h-4 ml-2 sm:ml-3" /></>
          ) : (
            <>Complete Required Fields</>
          )}
        </Button>
      </div>
    </GlassCard>
  );
}
