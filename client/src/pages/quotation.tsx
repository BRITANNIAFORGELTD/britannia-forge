import { useState } from 'react';
import { Header } from '@/components/navigation/header';
import { Footer } from '@/components/navigation/footer';
import { SEOHead } from '@/components/seo/seo-head';
import { Step1PropertyDetails } from '@/components/quote-steps/step1-property-details';
import { Step2SystemPhotos } from '@/components/quote-steps/step2-system-photos';
import { Step3QuoteSelection } from '@/components/quote-steps/step3-quote-selection';
import { Step4CustomerDetails } from '@/components/quote-steps/step4-customer-details';
import { Step5PaymentBooking } from '@/components/quote-steps/step5-payment-booking';
import { Step6Confirmation } from '@/components/quote-steps/step6-confirmation';
import { Button } from '@/components/ui/button';
import { useQuoteData } from '@/hooks/use-quote-data';
import { Play } from 'lucide-react';

export default function Quotation() {
  const [currentStep, setCurrentStep] = useState(0); // Start at 0 to show welcome screen
  const { quoteData, updateQuoteData } = useQuoteData();

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1:
        return "Property Details";
      case 2:
        return "System Photos";
      case 3:
        return "Quote Selection";
      case 4:
        return "Customer Details";
      case 5:
        return "Payment & Booking";
      case 6:
        return "Confirmation";
      default:
        return "Getting Started";
    }
  };

  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const startQuote = () => {
    setCurrentStep(1);
    document.getElementById('quote-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1PropertyDetails
            data={quoteData}
            onUpdate={updateQuoteData}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <Step2SystemPhotos
            data={quoteData}
            onUpdate={updateQuoteData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 3:
        return (
          <Step3QuoteSelection
            data={quoteData}
            onUpdate={updateQuoteData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 4:
        return (
          <Step4CustomerDetails
            data={quoteData}
            onUpdate={updateQuoteData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 5:
        return (
          <Step5PaymentBooking
            data={quoteData}
            onUpdate={updateQuoteData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 6:
        return (
          <Step6Confirmation
            data={quoteData}
            onUpdate={updateQuoteData}
          />
        );
      default:
        return null;
    }
  };

  // Welcome Screen
  if (currentStep === 0) {
    return (
      <div className="page-background">
        <SEOHead pageKey="quotation" />
        <Header />
        
        {/* Beautiful Welcome Hero Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-16">
            <div className="max-w-4xl mx-auto">
              <h1 className="britannia-heading text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Get Your <span style={{ color: 'var(--forge-orange)' }}>Fixed-Price</span> 
                <br />Boiler Quote
              </h1>
              <p className="britannia-body text-xl md:text-2xl mb-8 text-gray-700 leading-relaxed">
                Professional boiler installation by certified engineers across London. 
                <br />Get an instant quote in just a few clicks.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <button
                  className="britannia-cta-button text-lg px-10 py-4"
                  onClick={startQuote}
                >
                  <Play className="w-5 h-5 mr-2 inline" />
                  Get My Quote
                </button>
                <p className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-full border border-gray-200">
                  ⏱️ Takes only 3-5 minutes
                </p>
              </div>
            </div>
          </div>
          
          {/* Quick Process Overview */}
          <div className="mt-16 bg-gray-50 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="britannia-heading text-3xl font-bold mb-4">Simple 3-Step Process</h2>
              <p className="britannia-body text-lg text-gray-600">Our intelligent system calculates your exact requirements in minutes</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--britannia-green)' }}>
                  <span className="text-white text-xl font-bold">1</span>
                </div>
                <h3 className="britannia-heading text-lg font-semibold mb-2">Property Details</h3>
                <p className="britannia-body text-gray-600">Quick questions about your property to calculate boiler size</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--britannia-green)' }}>
                  <span className="text-white text-xl font-bold">2</span>
                </div>
                <h3 className="britannia-heading text-lg font-semibold mb-2">System Photos</h3>
                <p className="britannia-body text-gray-600">Upload photos of your current boiler and connections</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--forge-orange)' }}>
                  <span className="text-white text-xl font-bold">3</span>
                </div>
                <h3 className="britannia-heading text-lg font-semibold mb-2">Get Your Quote</h3>
                <p className="britannia-body text-gray-600">Choose from 3 tailored options with fixed pricing</p>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="britannia-card p-6 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--britannia-green)' }}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="britannia-heading text-lg font-semibold mb-2">Fixed Price Guarantee</h3>
              <p className="britannia-body text-gray-600">No hidden costs or surprises. Your quote is your final price.</p>
            </div>
            
            <div className="britannia-card p-6 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--britannia-green)' }}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="britannia-heading text-lg font-semibold mb-2">Certified Engineers</h3>
              <p className="britannia-body text-gray-600">All work carried out by Gas Safe registered professionals.</p>
            </div>
            
            <div className="britannia-card p-6 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--forge-orange)' }}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="britannia-heading text-lg font-semibold mb-2">Next Day Service</h3>
              <p className="britannia-body text-gray-600">Emergency repairs and quick installation scheduling available.</p>
            </div>
          </div>
          
          {/* Company Information */}
          <div className="mt-16 text-center p-6 bg-gray-50 rounded-lg">
            <p className="britannia-body text-sm text-gray-600">
              <strong>BRITANNIA FORGE LTD</strong> is a company registered in England and Wales with company number <strong>16565060</strong>.
              <br />
              <strong>Registered Office:</strong> 71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, United Kingdom.
            </p>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-background">
      <Header />
      
      {/* Step Progress Indicator */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="britannia-heading text-4xl md:text-6xl font-bold mb-6">
            Your Boiler Quote
          </h1>
          <p className="britannia-body text-xl text-gray-600 mb-8">
            Step {currentStep} of 6 - {getStepTitle(currentStep)}
          </p>
          
          {/* Progress Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-gray-200 rounded-full h-3 shadow-inner">
              <div
                className="h-3 rounded-full transition-all duration-500 ease-out"
                style={{ 
                  width: `${(currentStep / 6) * 100}%`,
                  backgroundColor: 'var(--forge-orange)'
                }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* Step Content */}
        <div className="max-w-4xl mx-auto">
          <div className="britannia-card p-8">
            {renderStep()}
          </div>
        </div>
        
        {/* Company Information */}
        <div className="mt-16 text-center p-6 bg-gray-50 rounded-lg max-w-4xl mx-auto">
          <p className="britannia-body text-sm text-gray-600">
            <strong>BRITANNIA FORGE LTD</strong> is a company registered in England and Wales with company number <strong>16565060</strong>.
            <br />
            <strong>Registered Office:</strong> 71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, United Kingdom.
          </p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
