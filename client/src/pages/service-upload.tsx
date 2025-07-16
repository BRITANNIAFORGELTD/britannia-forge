import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Header } from '@/components/navigation/header';
import { Footer } from '@/components/navigation/footer';
import { SEOHead } from '@/components/seo/seo-head';
import { CameraOnlyPhoto } from '@/components/camera-only-photo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, ArrowLeft, MapPin, Clock, User, Phone, Mail, Camera, AlertCircle, Send, Flame, Wrench, Shield, Zap, Droplets, Palette, Hammer, Leaf, AlertTriangle } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface ServiceUploadProps {
  serviceName: string;
  serviceIcon: React.ComponentType<{ className?: string }>;
  serviceDescription: string;
}

export default function ServiceUpload() {
  const [location] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    postcode: '',
    urgency: 'medium',
    description: '',
    emailVerified: false,
    photos: {
      main: undefined as File | undefined,
      additional1: undefined as File | undefined,
      additional2: undefined as File | undefined,
      additional3: undefined as File | undefined,
    }
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [emailVerificationCode, setEmailVerificationCode] = useState('');
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [postcodeValid, setPostcodeValid] = useState(false);

  // Extract service type from URL
  const serviceType = location.split('/service/')[1] || 'general';
  
  const serviceConfig = {
    'boiler-installation': {
      name: 'Boiler Installation',
      description: 'Professional boiler installation and replacement services',
      icon: Flame,
      leadCost: 15,
      seoTitle: 'Boiler Installation Service - Professional Gas Safe Engineers',
      seoDescription: 'Professional boiler installation service with Gas Safe certified engineers. Get quotes from verified professionals in your area.',
    },
    'boiler-repair': {
      name: 'Boiler Repair',
      description: 'Expert boiler repair and maintenance services',
      icon: Wrench,
      leadCost: 15,
      seoTitle: 'Boiler Repair Service - Emergency Gas Safe Engineers',
      seoDescription: 'Emergency boiler repair service with Gas Safe certified engineers. Fast response times and quality guaranteed.',
    },
    'landlord-safety': {
      name: 'Landlord Safety Certificate',
      description: 'Gas safety certificates for landlords',
      icon: Shield,
      leadCost: 10,
      seoTitle: 'Landlord Safety Certificate - Gas Safe CP12 Certificates',
      seoDescription: 'Annual gas safety inspections and CP12 certificates for landlords. Legal compliance guaranteed.',
    },
    'electrical': {
      name: 'Electrical Services',
      description: 'Professional electrical installation and repair',
      icon: Zap,
      leadCost: 12,
      seoTitle: 'Electrical Services - Qualified Electricians',
      seoDescription: 'Professional electrical services with qualified electricians. Part P compliance and safety testing.',
    },
    'plumbing': {
      name: 'Plumbing Services',
      description: 'Expert plumbing installation and repair',
      icon: Droplets,
      leadCost: 12,
      seoTitle: 'Plumbing Services - Emergency Plumbers',
      seoDescription: 'Professional plumbing services including emergency repairs, installations, and maintenance.',
    },
    'decoration': {
      name: 'Decoration Services',
      description: 'Interior and exterior decoration services',
      icon: Palette,
      leadCost: 8,
      seoTitle: 'Decoration Services - Professional Painters & Decorators',
      seoDescription: 'Professional painting and decorating services. Interior and exterior decoration by skilled professionals.',
    },
    'handyman': {
      name: 'Handyman Services',
      description: 'General handyman and maintenance services',
      icon: Hammer,
      leadCost: 8,
      seoTitle: 'Handyman Services - General Repairs & Maintenance',
      seoDescription: 'Professional handyman services for general repairs, maintenance, and home improvements.',
    },
    'gardening': {
      name: 'Gardening Services',
      description: 'Garden maintenance and landscaping services',
      icon: Leaf,
      leadCost: 6,
      seoTitle: 'Gardening Services - Professional Garden Maintenance',
      seoDescription: 'Professional gardening services including lawn care, hedge trimming, and landscaping.',
    },
  };

  const service = serviceConfig[serviceType as keyof typeof serviceConfig] || serviceConfig['general'];
  const ServiceIcon = service.icon;

  const handlePhotoCapture = (photoKey: keyof typeof formData.photos) => (file: File) => {
    setFormData(prev => ({
      ...prev,
      photos: {
        ...prev.photos,
        [photoKey]: file
      }
    }));
  };

  const handlePhotoRemove = (photoKey: keyof typeof formData.photos) => () => {
    setFormData(prev => ({
      ...prev,
      photos: {
        ...prev.photos,
        [photoKey]: undefined
      }
    }));
  };

  const validatePostcode = (postcode: string) => {
    const postcodeRegex = /^[A-Z]{1,2}[0-9]{1,2}[A-Z]?\s?[0-9][A-Z]{2}$/i;
    return postcodeRegex.test(postcode.trim());
  };

  const handlePostcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, postcode: value }));
    setPostcodeValid(validatePostcode(value));
  };

  const sendEmailVerification = async () => {
    if (!formData.email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call to send verification email
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowEmailVerification(true);
      toast({
        title: "Verification Email Sent",
        description: "Please check your email for the verification code.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send verification email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async () => {
    if (!emailVerificationCode) {
      toast({
        title: "Code Required",
        description: "Please enter the verification code from your email.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call to verify email
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFormData(prev => ({ ...prev, emailVerified: true }));
      setShowEmailVerification(false);
      toast({
        title: "Email Verified",
        description: "Your email has been verified successfully.",
      });
    } catch (error) {
      toast({
        title: "Invalid Code",
        description: "The verification code is invalid. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.photos.main) {
      toast({
        title: "Photo Required",
        description: "Please upload at least one photo of the job area.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.emailVerified) {
      toast({
        title: "Email Verification Required",
        description: "Please verify your email address before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (!postcodeValid) {
      toast({
        title: "Invalid Postcode",
        description: "Please enter a valid UK postcode.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Submit job request to backend
      await apiRequest('POST', '/api/service-requests', {
        serviceType,
        ...formData,
        leadCost: service.leadCost
      });

      toast({
        title: "Job Request Submitted!",
        description: `Engineers in your area will be notified. Lead cost: £${service.leadCost}`,
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        postcode: '',
        urgency: 'medium',
        description: '',
        emailVerified: false,
        photos: {
          main: undefined,
          additional1: undefined,
          additional2: undefined,
          additional3: undefined,
        }
      });
      setCurrentStep(1);
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit job request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (!formData.photos.main) {
      toast({
        title: "Photo Required",
        description: "Please upload at least one photo before proceeding.",
        variant: "destructive",
      });
      return;
    }
    setCurrentStep(2);
  };
  
  const prevStep = () => setCurrentStep(1);

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead pageKey="service-upload" />
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 p-2 -ml-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </button>
          
          <div className="text-center">
            <div className="mb-4">
              <ServiceIcon className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-blue-600" />
            </div>
            <h1 className="britannia-heading text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 px-4">{service.name}</h1>
            <p className="britannia-body text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 px-4">{service.description}</p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 mb-6 sm:mb-8 px-4">
              <div className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-sm sm:text-base ${currentStep >= 1 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'}`}>
                {currentStep > 1 ? <CheckCircle className="w-4 h-4" /> : <span className="w-4 h-4 rounded-full border-2 border-current"></span>}
                Photos & Details
              </div>
              <div className="w-0.5 h-6 sm:w-8 sm:h-0.5 bg-gray-300"></div>
              <div className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-sm sm:text-base ${currentStep >= 2 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'}`}>
                {currentStep > 2 ? <CheckCircle className="w-4 h-4" /> : <span className="w-4 h-4 rounded-full border-2 border-current"></span>}
                Contact & Submit
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Job Location & Priority
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8 p-4 sm:p-6">
                  <div className="space-y-2">
                    <Label htmlFor="postcode" className="text-sm font-medium text-gray-700">Postcode *</Label>
                    <div className="relative">
                      <Input
                        id="postcode"
                        value={formData.postcode}
                        onChange={handlePostcodeChange}
                        placeholder="e.g., SW1A 1AA"
                        className={`w-full ${postcodeValid ? 'border-green-500' : formData.postcode ? 'border-red-500' : ''}`}
                        required
                      />
                      {postcodeValid && <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />}
                    </div>
                  </div>
                  
                  <div className="space-y-2 relative">
                    <Label htmlFor="urgency" className="text-sm font-medium text-gray-700">Urgency Level</Label>
                    <Select value={formData.urgency} onValueChange={(value) => setFormData({...formData, urgency: value})}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select urgency level" />
                      </SelectTrigger>
                      <SelectContent className="z-50 bg-white border shadow-lg">
                        <SelectItem value="low">Low Priority - Within 1 week</SelectItem>
                        <SelectItem value="medium">Medium Priority - Within 2-3 days</SelectItem>
                        <SelectItem value="high">High Priority - Within 24 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2 relative z-10">
                    <Label htmlFor="description" className="text-sm font-medium text-gray-700">Job Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Please describe the work needed in detail..."
                      rows={4}
                      className="w-full resize-none"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Account Verification Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center mb-2">
                  <Shield className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-blue-800">Verified Account Required</h3>
                </div>
                <p className="text-sm text-blue-700">
                  Photo capture requires email verification to prevent security risks. Complete email verification in step 2 to enable camera access.
                </p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <CameraOnlyPhoto
                    label="Main Photo (Required)"
                    onPhotoCapture={handlePhotoCapture('main')}
                    hasPhoto={!!formData.photos.main}
                    isVerifiedAccount={formData.emailVerified}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <CameraOnlyPhoto
                    label="Additional Photo 1"
                    onPhotoCapture={handlePhotoCapture('additional1')}
                    hasPhoto={!!formData.photos.additional1}
                    isVerifiedAccount={formData.emailVerified}
                  />
                  
                  <CameraOnlyPhoto
                    label="Additional Photo 2"
                    onPhotoCapture={handlePhotoCapture('additional2')}
                    hasPhoto={!!formData.photos.additional2}
                    isVerifiedAccount={formData.emailVerified}
                  />
                  
                  <CameraOnlyPhoto
                    label="Additional Photo 3"
                    onPhotoCapture={handlePhotoCapture('additional3')}
                    hasPhoto={!!formData.photos.additional3}
                    isVerifiedAccount={formData.emailVerified}
                  />
                </div>
              </div>

              <Button
                type="button"
                onClick={nextStep}
                disabled={!formData.photos.main || !formData.description || !formData.postcode}
                className="w-full py-3 sm:py-4 bg-orange-500 hover:bg-orange-600 text-white font-medium text-base sm:text-lg"
              >
                Continue to Contact Details
              </Button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Contact Information
                  </CardTitle>
                  <CardDescription>
                    Engineers will use these details to contact you about your job
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-4 sm:p-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Your full name"
                      className="w-full"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address *</Label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="your@email.com"
                        className={`flex-1 ${formData.emailVerified ? 'border-green-500' : ''}`}
                        required
                      />
                      <Button
                        type="button"
                        onClick={sendEmailVerification}
                        disabled={!formData.email || formData.emailVerified || isLoading}
                        className="whitespace-nowrap w-full sm:w-auto"
                        variant="outline"
                      >
                        {formData.emailVerified ? 'Verified' : 'Verify'}
                      </Button>
                    </div>
                    {formData.emailVerified && (
                      <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Email verified successfully
                      </p>
                    )}
                  </div>

                  {showEmailVerification && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <Label htmlFor="verificationCode">Verification Code</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          id="verificationCode"
                          value={emailVerificationCode}
                          onChange={(e) => setEmailVerificationCode(e.target.value)}
                          placeholder="Enter 6-digit code"
                          maxLength={6}
                        />
                        <Button
                          type="button"
                          onClick={verifyEmail}
                          disabled={!emailVerificationCode || isLoading}
                        >
                          Verify
                        </Button>
                      </div>
                      <p className="text-sm text-yellow-700 mt-2">
                        Check your email for the verification code
                      </p>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+44 7XXX XXXXXX"
                      className="w-full"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-1">What happens next?</h3>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Your job request is sent to local engineers</li>
                        <li>• Engineers can view your photos and description</li>
                        <li>• You'll receive quotes and contact details within 30 minutes</li>
                        <li>• Choose your preferred engineer and book directly</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button
                  type="button"
                  onClick={prevStep}
                  variant="outline"
                  className="flex-1 py-3 sm:py-4 text-base sm:text-lg font-medium"
                >
                  Back to Photos
                </Button>
                <Button
                  type="submit"
                  disabled={!formData.emailVerified || !postcodeValid || isLoading}
                  className="flex-1 py-3 sm:py-4 bg-orange-500 hover:bg-orange-600 text-white font-medium disabled:opacity-50 text-base sm:text-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      Submit Free Request
                    </div>
                  )}
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
      
      <Footer />
    </div>
  );
}