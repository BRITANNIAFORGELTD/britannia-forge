import React, { useState } from 'react';
import { Header } from '@/components/navigation/header';
import { Footer } from '@/components/navigation/footer';
import { SEOHead } from '@/components/seo/seo-head';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Wrench, Zap, Droplets, Paintbrush, Hammer, ShieldCheck, Upload, X, Camera, MapPin, Clock, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ServiceType {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  leadCost: number;
  category: string;
}

const serviceTypes: ServiceType[] = [
  {
    id: 'boiler-repair',
    name: 'Boiler Repair & Service',
    description: 'Emergency repairs, annual servicing, and boiler maintenance',
    icon: Wrench,
    leadCost: 1000,
    category: 'heating'
  },
  {
    id: 'gas-safety',
    name: 'Gas Safety Certificate',
    description: 'Annual gas safety inspections and certificates',
    icon: ShieldCheck,
    leadCost: 800,
    category: 'safety'
  },
  {
    id: 'electrical',
    name: 'Electrical Services',
    description: 'Wiring, socket installation, and electrical repairs',
    icon: Zap,
    leadCost: 1000,
    category: 'electrical'
  },
  {
    id: 'plumbing',
    name: 'Plumbing Services',
    description: 'Leak repairs, pipe installation, and plumbing maintenance',
    icon: Droplets,
    leadCost: 800,
    category: 'plumbing'
  },
  {
    id: 'decoration',
    name: 'Decoration & Painting',
    description: 'Interior and exterior painting and decoration',
    icon: Paintbrush,
    leadCost: 600,
    category: 'decoration'
  },
  {
    id: 'handyman',
    name: 'General Handyman',
    description: 'General household repairs and maintenance',
    icon: Hammer,
    leadCost: 500,
    category: 'general'
  }
];

const urgencyLevels = [
  { value: 'low', label: 'Low - Within a week', color: 'bg-green-500' },
  { value: 'medium', label: 'Medium - Within 2-3 days', color: 'bg-yellow-500' },
  { value: 'high', label: 'High - Emergency (24hrs)', color: 'bg-red-500' }
];

export default function ServiceRequest() {
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [formData, setFormData] = useState({
    description: '',
    postcode: '',
    urgency: '',
    contactPhone: '',
    contactEmail: '',
    preferredTime: ''
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    setPhotos(prev => [...prev, ...imageFiles].slice(0, 5));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    setPhotos(prev => [...prev, ...imageFiles].slice(0, 5));
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedService) {
      toast({
        title: "Service Required",
        description: "Please select a service type",
        variant: "destructive"
      });
      return;
    }

    // Submit service request
    console.log('Service request submitted:', {
      service: selectedService,
      formData,
      photos
    });

    toast({
      title: "Request Submitted",
      description: "Your service request has been submitted. Engineers will be notified shortly.",
    });
  };

  if (!selectedService) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="britannia-heading text-4xl font-bold mb-4">Request a Service</h1>
            <p className="britannia-body text-xl text-gray-600">
              Get help from verified professionals across the UK
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceTypes.map((service) => (
              <Card 
                key={service.id} 
                className="britannia-card cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedService(service)}
              >
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-orange-100 rounded-full w-fit">
                    <service.icon className="w-8 h-8 text-orange-600" />
                  </div>
                  <CardTitle className="britannia-heading text-xl">{service.name}</CardTitle>
                  <CardDescription className="britannia-body">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <Badge variant="secondary" className="mb-2">
                      Lead Cost: £{(service.leadCost / 100).toFixed(2)}
                    </Badge>
                    <p className="britannia-body text-sm text-gray-600">
                      Engineers pay to access your job details
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead pageKey="service-request" />
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => setSelectedService(null)}
            className="mb-4"
          >
            ← Back to Services
          </Button>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-orange-100 rounded-full">
              <selectedService.icon className="w-8 h-8 text-orange-600" />
            </div>
            <div>
              <h1 className="britannia-heading text-3xl font-bold">{selectedService.name}</h1>
              <p className="britannia-body text-gray-600">{selectedService.description}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card className="britannia-card">
            <CardHeader>
              <CardTitle className="britannia-heading text-xl">Describe Your Problem</CardTitle>
              <CardDescription className="britannia-body">
                Provide as much detail as possible to help engineers understand your needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Please describe the issue in detail..."
                rows={4}
                required
                className="resize-none"
              />
            </CardContent>
          </Card>

          <Card className="britannia-card">
            <CardHeader>
              <CardTitle className="britannia-heading text-xl">Upload Photos</CardTitle>
              <CardDescription className="britannia-body">
                Photos help engineers understand the scope of work (optional, max 5)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive 
                    ? 'border-orange-400 bg-orange-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="britannia-body text-gray-600 mb-2">
                    Drag & drop photos here or click to select
                  </p>
                  <p className="britannia-body text-sm text-gray-500">
                    PNG, JPG up to 10MB each
                  </p>
                </label>
              </div>
              
              {photos.length > 0 && (
                <div className="mt-6 grid grid-cols-3 gap-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="britannia-card">
            <CardHeader>
              <CardTitle className="britannia-heading text-xl">Contact & Location Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="postcode" className="britannia-body font-medium">Postcode *</Label>
                  <Input
                    id="postcode"
                    value={formData.postcode}
                    onChange={(e) => setFormData(prev => ({ ...prev, postcode: e.target.value }))}
                    placeholder="SW1A 1AA"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="britannia-body font-medium">Contact Phone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                    placeholder="07XXX XXXXXX"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="britannia-body font-medium">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="urgency" className="britannia-body font-medium">Urgency Level *</Label>
                  <Select value={formData.urgency} onValueChange={(value) => setFormData(prev => ({ ...prev, urgency: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select urgency" />
                    </SelectTrigger>
                    <SelectContent>
                      {urgencyLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${level.color}`} />
                            {level.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="mt-6">
                <Label htmlFor="preferred-time" className="britannia-body font-medium">Preferred Time (Optional)</Label>
                <Input
                  id="preferred-time"
                  value={formData.preferredTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, preferredTime: e.target.value }))}
                  placeholder="e.g., Weekdays after 6pm, Weekend mornings"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="britannia-card bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="britannia-heading text-xl text-blue-800">How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-blue-700">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <p className="britannia-body">Your request is posted to verified engineers in your area</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <p className="britannia-body">Engineers pay £{(selectedService.leadCost / 100).toFixed(2)} to access your contact details</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <p className="britannia-body">You'll receive calls from interested engineers to discuss your job</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <p className="britannia-body">Choose your preferred engineer and arrange the work</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" className="britannia-cta-button text-lg px-8 py-3">
              Submit Service Request
            </Button>
          </div>
        </form>
      </div>
      
      <Footer />
    </div>
  );
}