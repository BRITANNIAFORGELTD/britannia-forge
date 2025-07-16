import { useState } from 'react';
import { Link } from 'wouter';
import { Header } from '@/components/navigation/header';
import { Footer } from '@/components/navigation/footer';
import { SEOHead } from '@/components/seo/seo-head';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { CameraOnlyPhoto } from '@/components/camera-only-photo';
import { HardHat, Mail, Lock, User, Building, MapPin, FileText, Shield, CheckCircle, ArrowLeft, AlertTriangle, Upload } from 'lucide-react';

export default function TradeRegister() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Account Creation
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    emailVerified: false,
    verificationCode: '',
    
    // Step 2: Personal & Company Details
    fullName: '',
    businessName: '',
    address: '',
    
    // Step 3: Services & Area
    services: [] as string[],
    primaryPostcode: '',
    workRadius: '',
    
    // Step 4: Documents
    documents: {
      photoId: null as File | null,
      proofOfAddress: null as File | null,
      publicLiability: null as File | null,
      gasSafe: null as File | null,
      electrical: null as File | null,
      plumbing: null as File | null,
      publicProfile: '',
    },
    
    // Step 5: Terms
    agreedToTerms: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);

  const steps = [
    { id: 1, title: 'Account Creation', icon: User },
    { id: 2, title: 'Personal & Company', icon: Building },
    { id: 3, title: 'Services & Area', icon: MapPin },
    { id: 4, title: 'Documents', icon: FileText },
    { id: 5, title: 'Review & Submit', icon: CheckCircle },
  ];

  const availableServices = [
    { id: 'gas-safe', label: 'Gas Safe Engineer' },
    { id: 'electrician', label: 'Electrician' },
    { id: 'plumber', label: 'Plumber' },
    { id: 'handyman', label: 'Handyman' },
    { id: 'decorator', label: 'Decorator' },
    { id: 'roofer', label: 'Roofer' },
    { id: 'carpenter', label: 'Carpenter' },
    { id: 'tiler', label: 'Tiler' },
    { id: 'plasterer', label: 'Plasterer' },
    { id: 'landscaper', label: 'Landscaper' },
  ];

  const workRadiusOptions = [
    { value: '5', label: '5 miles' },
    { value: '10', label: '10 miles' },
    { value: '15', label: '15 miles' },
    { value: '20', label: '20 miles' },
    { value: '25', label: '25 miles' },
    { value: '30', label: '30+ miles' },
  ];

  const sendVerificationCode = async () => {
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
      // Simulate sending verification code
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowVerification(true);
      toast({
        title: "Verification Code Sent",
        description: "Please check your email for the 6-digit verification code.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async () => {
    if (!formData.verificationCode) {
      toast({
        title: "Code Required",
        description: "Please enter the verification code.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFormData({...formData, emailVerified: true});
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

  const handleServiceToggle = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(s => s !== serviceId)
        : [...prev.services, serviceId]
    }));
  };

  const handleDocumentCapture = (docType: keyof typeof formData.documents) => (file: File) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docType]: file
      }
    }));
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate application submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Application Submitted",
        description: "Thank you! Your application is now pending review. You'll be notified by email once approved.",
      });
      
      // Reset form or redirect
      setCurrentStep(6); // Thank you step
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const progress = (currentStep / 5) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead 
        title="Trade Professional Registration | Britannia Forge"
        description="Join Britannia Forge as a certified trade professional. Complete our registration process to access job leads and grow your business."
      />
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-6">
          <Link href="/trade-login">
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 p-2 -ml-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </button>
          </Link>
        </div>

        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <HardHat className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="britannia-heading text-3xl sm:text-4xl font-bold mb-2">
            Become a Trade Professional
          </h1>
          <p className="britannia-body text-lg text-gray-600 max-w-2xl mx-auto">
            Join our network of certified professionals and grow your business
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Step {currentStep} of 5</span>
            <span className="text-sm text-gray-600">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Steps Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2 sm:space-x-4 overflow-x-auto">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.id}
                  className={`flex flex-col items-center min-w-max px-2 ${
                    currentStep >= step.id ? 'text-green-600' : 'text-gray-400'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                    currentStep >= step.id ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-center">{step.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Account Creation */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Account Creation</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password *</Label>
                        <Input
                          id="password"
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password *</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email Verification */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">Email Verification</h3>
                    {!showVerification ? (
                      <Button 
                        type="button"
                        onClick={sendVerificationCode}
                        disabled={isLoading || !formData.email}
                        className="w-full sm:w-auto"
                      >
                        {isLoading ? 'Sending...' : 'Send Verification Code'}
                      </Button>
                    ) : (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="verificationCode">Verification Code *</Label>
                          <Input
                            id="verificationCode"
                            type="text"
                            placeholder="Enter 6-digit code"
                            value={formData.verificationCode}
                            onChange={(e) => setFormData({...formData, verificationCode: e.target.value})}
                            maxLength={6}
                            required
                          />
                        </div>
                        <Button 
                          type="button"
                          onClick={verifyEmail}
                          disabled={isLoading || !formData.verificationCode}
                          className="w-full sm:w-auto"
                        >
                          {isLoading ? 'Verifying...' : 'Verify Email'}
                        </Button>
                      </div>
                    )}
                    
                    {formData.emailVerified && (
                      <div className="flex items-center gap-2 text-green-600 mt-2">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">Email verified successfully</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Personal & Company Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold mb-4">Personal & Company Details</h2>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business/Trading Name</Label>
                      <Input
                        id="businessName"
                        type="text"
                        value={formData.businessName}
                        onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                        placeholder="Leave blank if sole trader"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Full Address *</Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        rows={3}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Services & Area */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold mb-4">Define Your Services & Area</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-medium mb-3 block">Services Offered *</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {availableServices.map((service) => (
                          <div key={service.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={service.id}
                              checked={formData.services.includes(service.id)}
                              onCheckedChange={() => handleServiceToggle(service.id)}
                            />
                            <Label htmlFor={service.id} className="text-sm">
                              {service.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="primaryPostcode">Primary Postcode *</Label>
                        <Input
                          id="primaryPostcode"
                          type="text"
                          value={formData.primaryPostcode}
                          onChange={(e) => setFormData({...formData, primaryPostcode: e.target.value})}
                          placeholder="e.g., SW1A 1AA"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="workRadius">Work Radius *</Label>
                        <Select value={formData.workRadius} onValueChange={(value) => setFormData({...formData, workRadius: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select work radius" />
                          </SelectTrigger>
                          <SelectContent>
                            {workRadiusOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Documents */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold mb-4">Document & Certificate Upload</h2>
                  
                  {/* Account Verification Notice */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center mb-2">
                      <Shield className="w-5 h-5 text-blue-600 mr-2" />
                      <h3 className="text-lg font-semibold text-blue-800">Verified Account Required</h3>
                    </div>
                    <p className="text-sm text-blue-700">
                      Document upload requires email verification for security. Camera-only photos prevent malware uploads.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <CameraOnlyPhoto
                        label="Photo ID (Mandatory)"
                        onPhotoCapture={handleDocumentCapture('photoId')}
                        hasPhoto={!!formData.documents.photoId}
                        isVerifiedAccount={formData.emailVerified}
                      />
                      
                      <CameraOnlyPhoto
                        label="Proof of Address (Mandatory)"
                        onPhotoCapture={handleDocumentCapture('proofOfAddress')}
                        hasPhoto={!!formData.documents.proofOfAddress}
                        isVerifiedAccount={formData.emailVerified}
                      />
                      
                      <CameraOnlyPhoto
                        label="Public Liability Insurance (Mandatory)"
                        onPhotoCapture={handleDocumentCapture('publicLiability')}
                        hasPhoto={!!formData.documents.publicLiability}
                        isVerifiedAccount={formData.emailVerified}
                      />
                      
                      {formData.services.includes('gas-safe') && (
                        <CameraOnlyPhoto
                          label="Gas Safe Registration (Mandatory)"
                          onPhotoCapture={handleDocumentCapture('gasSafe')}
                          hasPhoto={!!formData.documents.gasSafe}
                          isVerifiedAccount={formData.emailVerified}
                        />
                      )}
                      
                      {formData.services.includes('electrician') && (
                        <CameraOnlyPhoto
                          label="NICEIC/NAPIT Certificate (Mandatory)"
                          onPhotoCapture={handleDocumentCapture('electrical')}
                          hasPhoto={!!formData.documents.electrical}
                          isVerifiedAccount={formData.emailVerified}
                        />
                      )}
                      
                      {formData.services.includes('plumber') && (
                        <CameraOnlyPhoto
                          label="Plumbing Certificate (Mandatory)"
                          onPhotoCapture={handleDocumentCapture('plumbing')}
                          hasPhoto={!!formData.documents.plumbing}
                          isVerifiedAccount={formData.emailVerified}
                        />
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="publicProfile">Public Profile Link (Optional)</Label>
                      <Input
                        id="publicProfile"
                        type="url"
                        value={formData.documents.publicProfile}
                        onChange={(e) => setFormData({
                          ...formData,
                          documents: { ...formData.documents, publicProfile: e.target.value }
                        })}
                        placeholder="e.g., Checkatrade, Google My Business, etc."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Review & Submit */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold mb-4">Final Review & Submission</h2>
                  
                  <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    <div>
                      <h3 className="font-medium">Contact Information</h3>
                      <p className="text-sm text-gray-600">
                        {formData.fullName} • {formData.email} • {formData.phone}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium">Services</h3>
                      <p className="text-sm text-gray-600">
                        {formData.services.map(s => availableServices.find(as => as.id === s)?.label).join(', ')}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium">Work Area</h3>
                      <p className="text-sm text-gray-600">
                        {formData.primaryPostcode} • {workRadiusOptions.find(r => r.value === formData.workRadius)?.label} radius
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.agreedToTerms}
                      onCheckedChange={(checked) => setFormData({...formData, agreedToTerms: checked as boolean})}
                    />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the platform's terms and conditions for professionals
                    </Label>
                  </div>
                </div>
              )}

              {/* Thank You Step */}
              {currentStep === 6 && (
                <div className="text-center space-y-6">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold">Thank You!</h2>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Your application has been submitted successfully. We'll review your documents and notify you by email once your account is approved.
                  </p>
                  <Button onClick={() => window.location.href = '/trade-login'}>
                    Return to Login
                  </Button>
                </div>
              )}

              {/* Navigation Buttons */}
              {currentStep < 6 && (
                <div className="flex justify-between items-center pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                  >
                    Previous
                  </Button>
                  
                  {currentStep < 5 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={
                        (currentStep === 1 && !formData.emailVerified) ||
                        (currentStep === 3 && formData.services.length === 0) ||
                        isLoading
                      }
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={!formData.agreedToTerms || isLoading}
                    >
                      {isLoading ? 'Submitting...' : 'Submit Application'}
                    </Button>
                  )}
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
}