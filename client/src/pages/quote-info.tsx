import { Header } from '@/components/navigation/header';
import { Footer } from '@/components/navigation/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calculator, 
  Camera, 
  Clock, 
  Shield, 
  CheckCircle, 
  Star, 
  Users, 
  Home, 
  Wrench,
  FileText,
  Video,
  Zap,
  Droplets,
  Settings
} from 'lucide-react';

export default function QuoteInfo() {
  return (
    <div className="page-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="britannia-heading text-5xl md:text-6xl font-bold mb-6">
            Get Your Intelligent 
            <span className="block" style={{ color: 'var(--britannia-green)' }}>
              Boiler Quote
            </span>
          </h1>
          <p className="britannia-body text-xl text-gray-600 mb-8 max-w-4xl mx-auto">
            Our advanced quotation system uses intelligent calculations to provide you with accurate, 
            fixed-price quotes without the need for costly home visits. Here's what to expect:
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="britannia-heading text-4xl font-bold mb-4">How Our Smart System Works</h2>
            <p className="britannia-body text-xl text-gray-600">
              Simple steps to get your accurate boiler installation quote
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="britannia-card text-center p-8">
              <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center" 
                   style={{ backgroundColor: 'var(--britannia-green)' }}>
                <Home className="w-8 h-8 text-white" />
              </div>
              <h3 className="britannia-heading text-xl font-semibold mb-4">1. Property Details</h3>
              <p className="britannia-body text-gray-600">
                Answer questions about your property carefully - our intelligent system calculates 
                the exact boiler size and water cylinder requirements based on your specific needs.
              </p>
            </Card>
            
            <Card className="britannia-card text-center p-8">
              <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center" 
                   style={{ backgroundColor: 'var(--britannia-green)' }}>
                <Camera className="w-8 h-8 text-white" />
              </div>
              <h3 className="britannia-heading text-xl font-semibold mb-4">2. System Photos</h3>
              <p className="britannia-body text-gray-600">
                Upload clear photos following our guidelines - quality pictures help us confirm 
                your boiler type and ensure accurate pricing without site visits.
              </p>
            </Card>
            
            <Card className="britannia-card text-center p-8">
              <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center" 
                   style={{ backgroundColor: 'var(--britannia-green)' }}>
                <Calculator className="w-8 h-8 text-white" />
              </div>
              <h3 className="britannia-heading text-xl font-semibold mb-4">3. Instant Quote</h3>
              <p className="britannia-body text-gray-600">
                Receive three tailored quotation options (Standard, Premium, Luxury) with 
                fixed prices - no surprises, no hidden costs.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Photo Requirements Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="britannia-heading text-4xl font-bold mb-4">Photo Requirements for Accuracy</h2>
            <p className="britannia-body text-xl text-gray-600">
              Quality photos are essential for accurate quotations - follow these guidelines
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="britannia-card p-6">
              <div className="flex items-center mb-4">
                <Camera className="w-6 h-6 mr-3" style={{ color: 'var(--britannia-green)' }} />
                <h3 className="britannia-heading font-semibold">Boiler Close-Up</h3>
              </div>
              <p className="britannia-body text-sm text-gray-600">
                Take a clear photo from 60cm away showing the boiler and surrounding area
              </p>
            </Card>
            
            <Card className="britannia-card p-6">
              <div className="flex items-center mb-4">
                <Camera className="w-6 h-6 mr-3" style={{ color: 'var(--britannia-green)' }} />
                <h3 className="britannia-heading font-semibold">Boiler Distance View</h3>
              </div>
              <p className="britannia-body text-sm text-gray-600">
                Wide shot showing boiler location and flue direction
              </p>
            </Card>
            
            <Card className="britannia-card p-6">
              <div className="flex items-center mb-4">
                <Camera className="w-6 h-6 mr-3" style={{ color: 'var(--britannia-green)' }} />
                <h3 className="britannia-heading font-semibold">Top View</h3>
              </div>
              <p className="britannia-body text-sm text-gray-600">
                Photo from above showing flue connection and routing
              </p>
            </Card>
            
            <Card className="britannia-card p-6">
              <div className="flex items-center mb-4">
                <Camera className="w-6 h-6 mr-3" style={{ color: 'var(--britannia-green)' }} />
                <h3 className="britannia-heading font-semibold">Bottom View</h3>
              </div>
              <p className="britannia-body text-sm text-gray-600">
                Underneath view showing pipes to confirm boiler type
              </p>
            </Card>
            
            <Card className="britannia-card p-6">
              <div className="flex items-center mb-4">
                <Droplets className="w-6 h-6 mr-3" style={{ color: 'var(--britannia-green)' }} />
                <h3 className="britannia-heading font-semibold">Water Stop</h3>
              </div>
              <p className="britannia-body text-sm text-gray-600">
                Main water supply isolation valve location
              </p>
            </Card>
            
            <Card className="britannia-card p-6">
              <div className="flex items-center mb-4">
                <Zap className="w-6 h-6 mr-3" style={{ color: 'var(--britannia-green)' }} />
                <h3 className="britannia-heading font-semibold">Electric Supply</h3>
              </div>
              <p className="britannia-body text-sm text-gray-600">
                Main electrical supply switch and fuse box access
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="britannia-heading text-4xl font-bold mb-4">Why Choose Our Platform</h2>
            <p className="britannia-body text-xl text-gray-600">
              The smart way to get boiler quotes and find verified engineers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 mr-4 mt-1 flex-shrink-0" style={{ color: 'var(--britannia-green)' }} />
                <div>
                  <h3 className="britannia-heading font-semibold mb-2">Save Time & Money</h3>
                  <p className="britannia-body text-gray-600">
                    No travel costs, parking fees, or quotation charges. Both you and our engineers 
                    work efficiently from comfortable locations.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Shield className="w-6 h-6 mr-4 mt-1 flex-shrink-0" style={{ color: 'var(--britannia-green)' }} />
                <div>
                  <h3 className="britannia-heading font-semibold mb-2">Verified Engineers</h3>
                  <p className="britannia-body text-gray-600">
                    All engineers are Gas Safe registered, insured, and carefully selected based 
                    on experience and quality workmanship.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <FileText className="w-6 h-6 mr-4 mt-1 flex-shrink-0" style={{ color: 'var(--britannia-green)' }} />
                <div>
                  <h3 className="britannia-heading font-semibold mb-2">Complete Records</h3>
                  <p className="britannia-body text-gray-600">
                    Before/after photos, certificates, and installation dates stored in your account 
                    for warranty and service scheduling.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <Settings className="w-6 h-6 mr-4 mt-1 flex-shrink-0" style={{ color: 'var(--britannia-green)' }} />
                <div>
                  <h3 className="britannia-heading font-semibold mb-2">Full Service Platform</h3>
                  <p className="britannia-body text-gray-600">
                    Access boiler repairs, annual servicing, electrical work, plumbing, and handyman 
                    services through your account.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Video className="w-6 h-6 mr-4 mt-1 flex-shrink-0" style={{ color: 'var(--britannia-green)' }} />
                <div>
                  <h3 className="britannia-heading font-semibold mb-2">Video Confirmation</h3>
                  <p className="britannia-body text-gray-600">
                    For complex installations, we offer video calls with engineers to confirm 
                    final quotations and discuss any obstacles.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Star className="w-6 h-6 mr-4 mt-1 flex-shrink-0" style={{ color: 'var(--britannia-green)' }} />
                <div>
                  <h3 className="britannia-heading font-semibold mb-2">Quality Guarantee</h3>
                  <p className="britannia-body text-gray-600">
                    We monitor all work and handle any disputes with complete documentation 
                    and engineer verification.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="britannia-heading text-4xl font-bold mb-4">Ready to Get Your Quote?</h2>
          <p className="britannia-body text-xl text-gray-600 mb-8">
            Our intelligent system will calculate your exact requirements and provide 
            three fixed-price options in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/quote" className="britannia-cta-button text-lg px-12 py-4">
              Start My Quotation Now
            </a>
            <Button 
              variant="outline" 
              className="text-lg px-12 py-4 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Learn More About Our Process
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}