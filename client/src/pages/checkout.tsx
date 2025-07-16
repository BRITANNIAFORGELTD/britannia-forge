import { useState, useEffect } from 'react';
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Header } from '@/components/navigation/header';
import { Footer } from '@/components/navigation/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GlassCard } from '@/components/ui/glass-card';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useQuoteData } from '@/hooks/use-quote-data';
import { useLocation } from 'wouter';
import { 
  Lock, 
  Shield, 
  CreditCard, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  Calendar,
  Home,
  Wrench
} from 'lucide-react';

// Load Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

interface CheckoutFormProps {
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const CheckoutForm = ({ amount, onSuccess, onError }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        onError(error.message || 'Payment failed');
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        onSuccess();
        toast({
          title: "Payment Successful",
          description: "Your booking has been confirmed!",
        });
      }
    } catch (err) {
      onError('An unexpected error occurred');
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border border-gray-200 rounded-lg">
        <PaymentElement />
      </div>
      
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Shield className="w-4 h-4" />
        <span>Your payment is secured with 256-bit SSL encryption</span>
      </div>

      <Button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="glass-button w-full py-3 text-lg font-semibold"
      >
        {isProcessing ? (
          <>
            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2" />
            Processing...
          </>
        ) : (
          <>
            <Lock className="w-5 h-5 mr-2" />
            Pay £{amount.toLocaleString()} Securely
          </>
        )}
      </Button>
    </form>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const { quoteData } = useQuoteData();
  const [, setLocation] = useLocation();

  // Calculate amounts
  const selectedQuote = quoteData.quotes?.find(q => q.tier === quoteData.selectedPackage);
  const thermostatPrice = quoteData.thermostatUpgrade === 'hive' ? 150 : 
                         quoteData.thermostatUpgrade === 'nest' ? 199 : 0;
  const subtotal = selectedQuote ? selectedQuote.basePrice + thermostatPrice : 0;
  const total = subtotal;
  const depositAmount = Math.round(total * 0.1); // 10% deposit
  const fullPaymentAmount = Math.round(total * 0.95); // 5% discount for full payment
  
  const paymentAmount = quoteData.paymentMethod === 'full' ? fullPaymentAmount : depositAmount;

  useEffect(() => {
    const initializePayment = async () => {
      try {
        setLoading(true);
        
        // Create payment intent
        const response = await apiRequest("POST", "/api/create-payment-intent", { 
          amount: paymentAmount 
        });
        
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (err) {
        setError("Failed to initialize payment. Please try again.");
        console.error('Payment initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (paymentAmount > 0) {
      initializePayment();
    }
  }, [paymentAmount]);

  const handlePaymentSuccess = async () => {
    setPaymentSuccess(true);
    
    // Save quote and create job
    try {
      await apiRequest("POST", "/api/quotes", {
        ...quoteData,
        status: 'confirmed',
        totalPrice: paymentAmount.toString()
      });
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        setLocation('/dashboard');
      }, 3000);
    } catch (err) {
      console.error('Error saving quote:', err);
    }
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-britannia-gray to-slate-200">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <GlassCard className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-britannia-dark mb-2">Preparing Your Payment</h2>
            <p className="text-gray-600">Please wait while we set up your secure payment...</p>
          </GlassCard>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-britannia-gray to-slate-200">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <GlassCard className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-britannia-dark mb-2">Payment Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={() => setLocation('/')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Quote
              </Button>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </GlassCard>
        </div>
        <Footer />
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-britannia-gray to-slate-200">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <GlassCard className="text-center py-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-britannia-dark mb-4">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">
              Your booking has been confirmed and payment processed successfully.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-center space-x-2">
                <Calendar className="w-5 h-5 text-britannia-blue" />
                <span>We'll contact you within 24 hours to schedule your survey</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Home className="w-5 h-5 text-britannia-blue" />
                <span>Track your progress in your customer dashboard</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Redirecting to your dashboard in a few seconds...
            </p>
            <Button className="glass-button" onClick={() => setLocation('/dashboard')}>
              Go to Dashboard
            </Button>
          </GlassCard>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-britannia-gray to-slate-200">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => setLocation('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Quote
          </Button>
          <h1 className="text-3xl font-bold text-britannia-dark mb-2">Secure Payment</h1>
          <p className="text-gray-600">Complete your booking with our secure payment system</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="space-y-6">
            <GlassCard>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                {clientSecret && (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm 
                      amount={paymentAmount}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                  </Elements>
                )}
              </CardContent>
            </GlassCard>

            {/* Security Features */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-britannia-dark mb-4">Your Payment is Secure</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-britannia-success" />
                  <span className="text-sm">256-bit SSL encryption</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-britannia-success" />
                  <span className="text-sm">PCI DSS compliant</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Lock className="w-5 h-5 text-britannia-success" />
                  <span className="text-sm">Secure data processing</span>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <GlassCard>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Package Selected</span>
                  <Badge variant="outline">{quoteData.selectedPackage}</Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{selectedQuote?.boilerMake} {selectedQuote?.boilerModel}</span>
                    <span>£{selectedQuote?.basePrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>
                      {quoteData.thermostatUpgrade === 'hive' ? 'Hive Smart Thermostat' :
                       quoteData.thermostatUpgrade === 'nest' ? 'Nest Learning Thermostat' :
                       'Standard Wireless Thermostat'}
                    </span>
                    <span>£{thermostatPrice}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Package Value</span>
                    <span>£{total.toLocaleString()}</span>
                  </div>
                  
                  {quoteData.paymentMethod === 'deposit' ? (
                    <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Deposit Payment (10%)</span>
                        <span className="font-bold text-britannia-blue">£{depositAmount.toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Remaining £{(total - depositAmount).toLocaleString()} due on completion
                      </p>
                    </div>
                  ) : (
                    <div className="mt-2 p-3 bg-green-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Full Payment (5% discount)</span>
                        <span className="font-bold text-britannia-success">£{fullPaymentAmount.toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        You save £{(total - fullPaymentAmount).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </GlassCard>

            {/* Installation Details */}
            <GlassCard>
              <CardHeader>
                <CardTitle>Installation Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Home className="w-5 h-5 text-britannia-blue mt-1" />
                  <div>
                    <p className="font-medium">Property Type</p>
                    <p className="text-sm text-gray-600 capitalize">{quoteData.propertyType}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Wrench className="w-5 h-5 text-britannia-blue mt-1" />
                  <div>
                    <p className="font-medium">Current System</p>
                    <p className="text-sm text-gray-600">{quoteData.currentBoiler} Boiler</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-britannia-blue mt-1" />
                  <div>
                    <p className="font-medium">Preferred Date</p>
                    <p className="text-sm text-gray-600">
                      {quoteData.customerDetails.preferredDate ? 
                        new Date(quoteData.customerDetails.preferredDate).toLocaleDateString() : 
                        'To be arranged'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </GlassCard>

            {/* What Happens Next */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>What happens next:</strong> After payment, we'll contact you within 24 hours to schedule your free survey. 
                Our certified engineer will confirm the final installation details and arrange your installation date.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
