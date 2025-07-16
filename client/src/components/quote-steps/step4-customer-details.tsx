import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { QuoteData } from '@/types/quote';

interface Step4Props {
  data: QuoteData;
  onUpdate: (updates: Partial<QuoteData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function Step4CustomerDetails({ data, onUpdate, onNext, onPrev }: Step4Props) {
  const [customerDetails, setCustomerDetails] = useState(data.customerDetails);

  const handleInputChange = (field: string, value: string) => {
    const updated = { ...customerDetails, [field]: value };
    setCustomerDetails(updated);
    onUpdate({ customerDetails: updated });
  };

  const canProceed = () => {
    return Object.values(customerDetails).every(value => value.trim() !== '');
  };

  return (
    <GlassCard className="mb-8 fade-in">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-britannia-dark">Customer Details</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Step 4 of 6</span>
            <ProgressBar value={4} max={6} />
          </div>
        </div>
        <p className="text-gray-600">We need your details to prepare your quote</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="relative">
            <Input
              type="text"
              value={customerDetails.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder=" "
              className="form-input peer"
            />
            <Label className="floating-label peer-focus:-translate-y-6 peer-focus:scale-85 peer-focus:text-primary peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-85 peer-[:not(:placeholder-shown)]:text-primary">
              Full Name
            </Label>
          </div>

          <div className="relative">
            <Input
              type="email"
              value={customerDetails.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder=" "
              className="form-input peer"
            />
            <Label className="floating-label peer-focus:-translate-y-6 peer-focus:scale-85 peer-focus:text-primary peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-85 peer-[:not(:placeholder-shown)]:text-primary">
              Email Address
            </Label>
          </div>

          <div className="relative">
            <Input
              type="tel"
              value={customerDetails.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder=" "
              className="form-input peer"
            />
            <Label className="floating-label peer-focus:-translate-y-6 peer-focus:scale-85 peer-focus:text-primary peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-85 peer-[:not(:placeholder-shown)]:text-primary">
              Phone Number
            </Label>
          </div>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <Input
              type="text"
              value={customerDetails.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder=" "
              className="form-input peer"
            />
            <Label className="floating-label peer-focus:-translate-y-6 peer-focus:scale-85 peer-focus:text-primary peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-85 peer-[:not(:placeholder-shown)]:text-primary">
              Installation Address
            </Label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <Input
                type="text"
                value={customerDetails.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder=" "
                className="form-input peer"
              />
              <Label className="floating-label peer-focus:-translate-y-6 peer-focus:scale-85 peer-focus:text-primary peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-85 peer-[:not(:placeholder-shown)]:text-primary">
                City
              </Label>
            </div>
            <div className="relative">
              <Input
                type="text"
                value={customerDetails.postcode}
                onChange={(e) => handleInputChange('postcode', e.target.value)}
                placeholder=" "
                className="form-input peer"
              />
              <Label className="floating-label peer-focus:-translate-y-6 peer-focus:scale-85 peer-focus:text-primary peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-85 peer-[:not(:placeholder-shown)]:text-primary">
                Postcode
              </Label>
            </div>
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">Preferred Installation Date</Label>
            <Input
              type="date"
              value={customerDetails.preferredDate}
              onChange={(e) => handleInputChange('preferredDate', e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Validation Summary */}
      {!canProceed() && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">
            Please complete all required fields to continue
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
            <>Continue <ArrowRight className="w-4 h-4 ml-2 sm:ml-3" /></>
          ) : (
            <>Complete All Fields to Continue</>
          )}
        </Button>
      </div>
    </GlassCard>
  );
}
