import React from 'react';
import { Header } from '@/components/navigation/header';
import { Footer } from '@/components/navigation/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Wrench, Shield, Zap, Droplets, Palette, Hammer, Leaf, Settings, CheckCircle } from 'lucide-react';

const services = [
  {
    id: 'boiler-installation',
    name: 'Boiler Installation',
    icon: Flame,
    description: 'Complete boiler installation service with intelligent sizing and professional fitting',
    features: ['Intelligent boiler sizing', 'Professional installation', 'Full warranty coverage', 'Gas safety compliance'],
    price: 'From £2,500',
    href: '/service/boiler-installation'
  },
  {
    id: 'boiler-repair',
    name: 'Boiler Repair',
    icon: Wrench,
    description: 'Emergency and scheduled boiler repairs by certified Gas Safe engineers',
    features: ['24/7 emergency service', 'Gas Safe certified engineers', 'Genuine parts only', 'Same-day service'],
    price: 'From £95',
    href: '/service/boiler-repair'
  },
  {
    id: 'landlord-safety',
    name: 'Landlord Safety Certificate',
    icon: Shield,
    description: 'Annual gas safety inspections and CP12 certification for landlords',
    features: ['Legal compliance', 'CP12 certification', 'Annual inspection', 'Detailed safety report'],
    price: 'From £75',
    href: '/service/landlord-safety'
  },
  {
    id: 'electrical',
    name: 'Electrical Services',
    icon: Zap,
    description: 'Professional electrical installation, repair, and maintenance services',
    features: ['Qualified electricians', 'Part P compliance', 'Safety testing', 'Emergency call-outs'],
    price: 'From £60',
    href: '/service/electrical'
  },
  {
    id: 'plumbing',
    name: 'Plumbing Services',
    icon: Droplets,
    description: 'Complete plumbing solutions from leaks to full system installations',
    features: ['Emergency plumbing', 'Bathroom installations', 'Leak detection', 'Pipe repairs'],
    price: 'From £85',
    href: '/service/plumbing'
  },
  {
    id: 'decoration',
    name: 'Decoration Services',
    icon: Palette,
    description: 'Professional painting, decorating, and interior design services',
    features: ['Interior painting', 'Exterior decoration', 'Wallpapering', 'Color consultation'],
    price: 'From £45',
    href: '/service/decoration'
  },
  {
    id: 'handyman',
    name: 'Handyman Services',
    icon: Hammer,
    description: 'General maintenance, repairs, and home improvement services',
    features: ['General repairs', 'Furniture assembly', 'Door/window repairs', 'Maintenance tasks'],
    price: 'From £40',
    href: '/service/handyman'
  },
  {
    id: 'gardening',
    name: 'Gardening Services',
    icon: Leaf,
    description: 'Professional garden maintenance and landscaping services',
    features: ['Garden maintenance', 'Lawn care', 'Hedge trimming', 'Landscaping'],
    price: 'From £35',
    href: '/service/gardening'
  }
];

export default function Services() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="britannia-heading text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Professional Services
          </h1>
          <p className="britannia-body text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with verified professionals for all your home service needs. Our carefully selected engineers, 
            plumbers, electricians, and specialists are ready to help with quality guaranteed work.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Card key={service.id} className="glass-card hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <CardTitle className="britannia-heading text-xl text-gray-900">{service.name}</CardTitle>
                  <CardDescription className="britannia-body text-gray-600">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-6">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="britannia-body text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="britannia-body font-semibold text-lg text-gray-900">{service.price}</span>
                    <Button 
                      asChild
                      className="britannia-cta-button"
                    >
                      <a href={service.href}>Get Quote</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* How It Works Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="britannia-heading text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="britannia-heading text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="britannia-heading text-xl font-semibold text-gray-900 mb-2">Choose Service</h3>
              <p className="britannia-body text-gray-600">Select the service you need from our comprehensive list</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="britannia-heading text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="britannia-heading text-xl font-semibold text-gray-900 mb-2">Submit Details</h3>
              <p className="britannia-body text-gray-600">Provide photos, location, and job description</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="britannia-heading text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="britannia-heading text-xl font-semibold text-gray-900 mb-2">Get Matched</h3>
              <p className="britannia-body text-gray-600">Qualified professionals in your area will contact you</p>
            </div>
          </div>
        </div>

        {/* Quality Assurance */}
        <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
          <h2 className="britannia-heading text-3xl font-bold text-gray-900 mb-6">
            Quality Assured Professionals
          </h2>
          <p className="britannia-body text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            All our service providers are carefully vetted, insured, and certified. We ensure high-quality work 
            with professional standards and customer satisfaction guaranteed.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <Shield className="w-12 h-12 text-blue-600 mx-auto mb-2" />
              <h3 className="britannia-heading font-semibold text-gray-900">Fully Insured</h3>
            </div>
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
              <h3 className="britannia-heading font-semibold text-gray-900">Verified Professionals</h3>
            </div>
            <div className="text-center">
              <Settings className="w-12 h-12 text-purple-600 mx-auto mb-2" />
              <h3 className="britannia-heading font-semibold text-gray-900">Quality Guaranteed</h3>
            </div>
            <div className="text-center">
              <Flame className="w-12 h-12 text-orange-600 mx-auto mb-2" />
              <h3 className="britannia-heading font-semibold text-gray-900">Gas Safe Certified</h3>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}