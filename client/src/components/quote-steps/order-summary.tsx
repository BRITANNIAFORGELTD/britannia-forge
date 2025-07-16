import { PriceBreakdown } from '@/lib/quote-engine';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Car, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OrderSummaryProps {
  breakdown: PriceBreakdown;
  selectedTier: string;
  onDownloadQuote?: () => void;
}

export function OrderSummary({ breakdown, selectedTier, onDownloadQuote }: OrderSummaryProps) {
  const formatPrice = (price: number) => {
    return `£${(price / 100).toFixed(2)}`;
  };

  return (
    <Card className="britannia-card">
      <CardHeader>
        <CardTitle className="britannia-heading flex items-center justify-between">
          <span>Order Summary ({selectedTier})</span>
          {onDownloadQuote && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDownloadQuote}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Quote
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Boiler */}
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="font-semibold text-lg">{breakdown.boilerModel}</div>
              <div className="text-sm text-gray-600">
                Water flow rate: {breakdown.waterFlowRate}L/min
              </div>
            </div>
            <div className="font-semibold">{formatPrice(breakdown.boilerPrice)}</div>
          </div>
        </div>

        <Separator />

        {/* Detailed Components */}
        <div className="space-y-3">
          <h4 className="font-semibold">Installation Components</h4>
          {breakdown.components.map((component, index) => (
            <div key={index} className="flex justify-between items-start py-2 border-b border-gray-100 last:border-b-0">
              <div className="flex-1">
                <div className="font-medium">{component.name}</div>
                <div className="text-sm text-gray-600">{component.description}</div>
                <div className="text-sm text-gray-500">Quantity: {component.quantity}</div>
              </div>
              <div className="text-right">
                <div className="font-medium">{formatPrice(component.totalPrice)}</div>
                {component.quantity > 1 && (
                  <div className="text-sm text-gray-500">{formatPrice(component.unitPrice)} each</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Additional Services */}
        <div className="space-y-3">
          <h4 className="font-semibold">Additional Services</h4>
          
          {breakdown.flueExtensionPrice > 0 && (
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">Flue Extension</div>
                <div className="text-sm text-gray-600">{breakdown.flueExtensionLength} extension kit</div>
              </div>
              <div className="font-medium">{formatPrice(breakdown.flueExtensionPrice)}</div>
            </div>
          )}

          {breakdown.megaflowPrice > 0 && (
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">Megaflow Hot Water Cylinder</div>
                <div className="text-sm text-gray-600">Unvented cylinder for system boiler</div>
              </div>
              <div className="font-medium">{formatPrice(breakdown.megaflowPrice)}</div>
            </div>
          )}

          {breakdown.condensatePumpPrice > 0 && (
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">Condensate Pump</div>
                <div className="text-sm text-gray-600">Required due to drainage requirements</div>
              </div>
              <div className="font-medium">{formatPrice(breakdown.condensatePumpPrice)}</div>
            </div>
          )}

          {breakdown.thermostatPrice > 0 && (
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">Hive Smart Thermostat</div>
                <div className="text-sm text-gray-600">Smart thermostat with app control</div>
              </div>
              <div className="font-medium">{formatPrice(breakdown.thermostatPrice)}</div>
            </div>
          )}
        </div>

        <Separator />

        {/* Pricing Summary */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(breakdown.subtotal)}</span>
          </div>
          
          {breakdown.discountAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-{formatPrice(breakdown.discountAmount)}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span>VAT (20%)</span>
            <span>{formatPrice(breakdown.vatAmount)}</span>
          </div>

          <Separator />

          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>{formatPrice(breakdown.totalPrice)}</span>
          </div>
        </div>

        {/* Parking Fee Notice */}
        {breakdown.parkingRequired && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <div className="font-medium text-yellow-800">Parking Required</div>
                <div className="text-sm text-yellow-700 mt-1">
                  This quote excludes parking costs. Please ensure free parking is available for our engineer 
                  or provide resident parking permits. Additional parking fees may apply if arranged separately.
                </div>
                <div className="text-sm font-medium text-yellow-800 mt-2">
                  Estimated parking fee: {formatPrice(breakdown.parkingFee)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Professional Installation Notes - Removed as not in PriceBreakdown interface */}
        
        {/* System Explanation - Removed as not in PriceBreakdown interface */}

        {/* Professional Quote Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <div className="font-medium text-blue-800">Professional Installation Quote</div>
              <div className="text-sm text-blue-700 mt-1">
                This comprehensive quote includes all materials, labour, and system commissioning. 
                Final pricing may vary based on site survey findings and any additional requirements discovered during installation.
              </div>
            </div>
          </div>
        </div>

        {/* Water Flow Information */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="font-medium text-gray-800 mb-2">Water Flow Information</div>
          <div className="text-sm text-gray-600">
            <strong>Flow Rate:</strong> {breakdown.waterFlowRate} litres per minute
          </div>
          <div className="text-sm text-gray-600 mt-1">
            This flow rate is calculated based on your property size and occupancy. 
            Actual flow rates may vary depending on mains water pressure and property-specific factors.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}