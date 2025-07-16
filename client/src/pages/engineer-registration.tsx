import React, { useState } from 'react';
import { Header } from '@/components/navigation/header';
import { Footer } from '@/components/navigation/footer';
import { SEOHead } from '@/components/seo/seo-head';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Upload, Shield, CheckCircle, AlertCircle, FileText, Camera, User, Phone, Mail, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RegistrationData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    postcode: string;
    website: string;
    bio: string;
  };
  professional: {
    gasSafeNumber: string;
    yearsExperience: string;
    specialties: string[];
    companyName: string;
    vatNumber: string;
    serviceAreas: string[];
    hourlyRate: string;
    availability: string;
  };
  documents: {
    gasSafeCertificate: File | null;
    insurance: File | null;
    profilePhoto: File | null;
    qualifications: File[];
  };
  portfolio: {
    workPhotos: File[];
    descriptions: string[];
  };
  reviews: {
    customerReviews: Array<{
      customerName: string;
      rating: number;
      review: string;
      date: string;
      website: string;
    }>;
  };
  agreements: {
    terms: boolean;
    privacy: boolean;
    marketing: boolean;
  };
}

const specialtyOptions = [
  'Boiler Installation',
  'Boiler Repair',
  'Gas Safety Certificates',
  'Landlord Certificates',
  'Electrical Work',
  'Plumbing',
  'Heating Systems',
  'Power Flushing',
  'Bathroom Installation',
  'Kitchen Installation',
  'Gardening & Landscaping',
  'Decoration & Painting',
  'Handyman Services'
];

const serviceAreaOptions = [
  'Central London',
  'North London',
  'South London',
  'East London',
  'West London',
  'Greater London',
  'Birmingham',
  'Manchester',
  'Bristol',
  'Leeds',
  'Liverpool',
  'Sheffield',
  'Newcastle',
  'Nationwide'
];

export default function EngineerRegistration() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RegistrationData>({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      postcode: '',
      website: '',
      bio: ''
    },
    professional: {
      gasSafeNumber: '',
      yearsExperience: '',
      specialties: [],
      companyName: '',
      vatNumber: '',
      serviceAreas: [],
      hourlyRate: '',
      availability: ''
    },
    documents: {
      gasSafeCertificate: null,
      insurance: null,
      profilePhoto: null,
      qualifications: []
    },
    portfolio: {
      workPhotos: [],
      descriptions: []
    },
    reviews: {
      customerReviews: []
    },
    agreements: {
      terms: false,
      privacy: false,
      marketing: false
    }
  });
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: keyof RegistrationData['documents']) => {
    const file = e.target.files?.[0];
    if (file) {
      if (field === 'qualifications') {
        setFormData(prev => ({
          ...prev,
          documents: {
            ...prev.documents,
            qualifications: [...prev.documents.qualifications, file]
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          documents: {
            ...prev.documents,
            [field]: file
          }
        }));
      }
    }
  };

  const handleSpecialtyToggle = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      professional: {
        ...prev.professional,
        specialties: prev.professional.specialties.includes(specialty)
          ? prev.professional.specialties.filter(s => s !== specialty)
          : [...prev.professional.specialties, specialty]
      }
    }));
  };

  const handleSubmit = () => {
    // Validate all required fields
    if (!formData.agreements.terms || !formData.agreements.privacy) {
      toast({
        title: "Agreement Required",
        description: "Please accept the terms and conditions and privacy policy",
        variant: "destructive"
      });
      return;
    }

    // Submit registration
    console.log('Engineer registration submitted:', formData);
    toast({
      title: "Registration Submitted",
      description: "Your application has been submitted for review. You'll receive confirmation within 24 hours.",
    });
  };

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const steps = [
    'Personal Information',
    'Professional Details',
    'Documents & Verification',
    'Portfolio & Reviews',
    'Terms & Agreements'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead pageKey="engineer-registration" />
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="britannia-heading text-4xl font-bold mb-4">Join Our Engineer Network</h1>
          <p className="britannia-body text-xl text-gray-600">
            Connect with customers across the UK and grow your business
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  index + 1 <= currentStep 
                    ? 'bg-orange-600 text-white' 
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-20 h-1 mx-2 ${
                    index + 1 < currentStep ? 'bg-orange-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="britannia-body text-gray-600">
              Step {currentStep} of {steps.length}: {steps[currentStep - 1]}
            </p>
          </div>
        </div>

        <Card className="britannia-card">
          <CardContent className="p-8">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="britannia-heading text-2xl font-bold mb-4">Personal Information</h2>
                  <p className="britannia-body text-gray-600 mb-6">
                    Tell us about yourself and your contact details
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName" className="britannia-body font-medium">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.personalInfo.firstName}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, firstName: e.target.value }
                      }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="britannia-body font-medium">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.personalInfo.lastName}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, lastName: e.target.value }
                      }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="britannia-body font-medium">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.personalInfo.email}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, email: e.target.value }
                      }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="britannia-body font-medium">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.personalInfo.phone}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, phone: e.target.value }
                      }))}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="address" className="britannia-body font-medium">Address *</Label>
                  <Textarea
                    id="address"
                    value={formData.personalInfo.address}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, address: e.target.value }
                    }))}
                    rows={3}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="postcode" className="britannia-body font-medium">Postcode *</Label>
                  <Input
                    id="postcode"
                    value={formData.personalInfo.postcode}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, postcode: e.target.value }
                    }))}
                    placeholder="SW1A 1AA"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="website" className="britannia-body font-medium">Website (Optional)</Label>
                  <Input
                    id="website"
                    value={formData.personalInfo.website}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, website: e.target.value }
                    }))}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="bio" className="britannia-body font-medium">Professional Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.personalInfo.bio}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, bio: e.target.value }
                    }))}
                    rows={4}
                    placeholder="Tell customers about your background, experience, and what makes you unique..."
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="britannia-heading text-2xl font-bold mb-4">Professional Details</h2>
                  <p className="britannia-body text-gray-600 mb-6">
                    Your professional qualifications and experience
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="gasSafe" className="britannia-body font-medium">Gas Safe Registration Number *</Label>
                    <Input
                      id="gasSafe"
                      value={formData.professional.gasSafeNumber}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        professional: { ...prev.professional, gasSafeNumber: e.target.value }
                      }))}
                      placeholder="GS123456"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="experience" className="britannia-body font-medium">Years of Experience *</Label>
                    <Input
                      id="experience"
                      type="number"
                      value={formData.professional.yearsExperience}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        professional: { ...prev.professional, yearsExperience: e.target.value }
                      }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="company" className="britannia-body font-medium">Company Name</Label>
                    <Input
                      id="company"
                      value={formData.professional.companyName}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        professional: { ...prev.professional, companyName: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="vat" className="britannia-body font-medium">VAT Number (if applicable)</Label>
                    <Input
                      id="vat"
                      value={formData.professional.vatNumber}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        professional: { ...prev.professional, vatNumber: e.target.value }
                      }))}
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="britannia-body font-medium mb-3 block">Specialties *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {specialtyOptions.map((specialty) => (
                      <div key={specialty} className="flex items-center space-x-2">
                        <Checkbox
                          id={specialty}
                          checked={formData.professional.specialties.includes(specialty)}
                          onCheckedChange={() => handleSpecialtyToggle(specialty)}
                        />
                        <Label
                          htmlFor={specialty}
                          className="britannia-body text-sm cursor-pointer"
                        >
                          {specialty}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="hourlyRate" className="britannia-body font-medium">Hourly Rate (£)</Label>
                    <Input
                      id="hourlyRate"
                      type="number"
                      value={formData.professional.hourlyRate}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        professional: { ...prev.professional, hourlyRate: e.target.value }
                      }))}
                      placeholder="50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="availability" className="britannia-body font-medium">Availability</Label>
                    <select
                      id="availability"
                      value={formData.professional.availability}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        professional: { ...prev.professional, availability: e.target.value }
                      }))}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select availability</option>
                      <option value="weekdays">Weekdays only</option>
                      <option value="weekends">Weekends only</option>
                      <option value="flexible">Flexible hours</option>
                      <option value="24/7">24/7 availability</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <Label className="britannia-body font-medium mb-3 block">Service Areas *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {serviceAreaOptions.map((area) => (
                      <div key={area} className="flex items-center space-x-2">
                        <Checkbox
                          id={area}
                          checked={formData.professional.serviceAreas.includes(area)}
                          onCheckedChange={() => {
                            setFormData(prev => ({
                              ...prev,
                              professional: {
                                ...prev.professional,
                                serviceAreas: prev.professional.serviceAreas.includes(area)
                                  ? prev.professional.serviceAreas.filter(s => s !== area)
                                  : [...prev.professional.serviceAreas, area]
                              }
                            }));
                          }}
                        />
                        <Label
                          htmlFor={area}
                          className="britannia-body text-sm cursor-pointer"
                        >
                          {area}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="britannia-heading text-2xl font-bold mb-4">Documents & Verification</h2>
                  <p className="britannia-body text-gray-600 mb-6">
                    Upload your certificates and identification documents
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <Label className="britannia-body font-medium mb-2 block">Gas Safe Certificate *</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(e, 'gasSafeCertificate')}
                        className="hidden"
                        id="gas-safe-upload"
                      />
                      <label htmlFor="gas-safe-upload" className="cursor-pointer">
                        <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="britannia-body text-gray-600">
                          {formData.documents.gasSafeCertificate 
                            ? `Selected: ${formData.documents.gasSafeCertificate.name}`
                            : 'Upload Gas Safe Certificate (PDF, JPG, PNG)'
                          }
                        </p>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="britannia-body font-medium mb-2 block">Insurance Certificate *</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(e, 'insurance')}
                        className="hidden"
                        id="insurance-upload"
                      />
                      <label htmlFor="insurance-upload" className="cursor-pointer">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="britannia-body text-gray-600">
                          {formData.documents.insurance 
                            ? `Selected: ${formData.documents.insurance.name}`
                            : 'Upload Insurance Certificate (PDF, JPG, PNG)'
                          }
                        </p>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="britannia-body font-medium mb-2 block">Profile Photo *</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(e, 'profilePhoto')}
                        className="hidden"
                        id="photo-upload"
                      />
                      <label htmlFor="photo-upload" className="cursor-pointer">
                        <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="britannia-body text-gray-600">
                          {formData.documents.profilePhoto 
                            ? `Selected: ${formData.documents.profilePhoto.name}`
                            : 'Upload Profile Photo (JPG, PNG)'
                          }
                        </p>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="britannia-body font-medium mb-2 block">Additional Qualifications (Optional)</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(e, 'qualifications')}
                        className="hidden"
                        id="qualifications-upload"
                        multiple
                      />
                      <label htmlFor="qualifications-upload" className="cursor-pointer">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="britannia-body text-gray-600">
                          {formData.documents.qualifications.length > 0
                            ? `${formData.documents.qualifications.length} file(s) selected`
                            : 'Upload Additional Certificates (PDF, JPG, PNG)'
                          }
                        </p>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="britannia-heading text-2xl font-bold mb-4">Portfolio & Reviews</h2>
                  <p className="britannia-body text-gray-600 mb-6">
                    Showcase your work and add customer reviews to build trust
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <Label className="britannia-body font-medium mb-3 block">Work Portfolio (Optional)</Label>
                    <p className="britannia-body text-sm text-gray-600 mb-4">
                      Upload photos of your completed projects to show customers your quality of work
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Array.from({ length: 6 }, (_, index) => (
                        <div key={index} className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setFormData(prev => ({
                                  ...prev,
                                  portfolio: {
                                    ...prev.portfolio,
                                    workPhotos: [...prev.portfolio.workPhotos, file]
                                  }
                                }));
                              }
                            }}
                            className="hidden"
                            id={`portfolio-${index}`}
                          />
                          <label htmlFor={`portfolio-${index}`} className="cursor-pointer">
                            <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="britannia-body text-xs text-gray-600">
                              {formData.portfolio.workPhotos[index] 
                                ? 'Photo uploaded'
                                : 'Add photo'
                              }
                            </p>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="britannia-body font-medium mb-3 block">Customer Reviews (Optional)</Label>
                    <p className="britannia-body text-sm text-gray-600 mb-4">
                      Add reviews from trusted platforms like Google, Checkatrade, or Facebook
                    </p>
                    <div className="space-y-4">
                      {formData.reviews.customerReviews.map((review, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <Input
                                placeholder="Customer name"
                                value={review.customerName}
                                onChange={(e) => {
                                  const newReviews = [...formData.reviews.customerReviews];
                                  newReviews[index] = { ...review, customerName: e.target.value };
                                  setFormData(prev => ({
                                    ...prev,
                                    reviews: { ...prev.reviews, customerReviews: newReviews }
                                  }));
                                }}
                                className="mb-2"
                              />
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm">Rating:</span>
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => {
                                      const newReviews = [...formData.reviews.customerReviews];
                                      newReviews[index] = { ...review, rating: star };
                                      setFormData(prev => ({
                                        ...prev,
                                        reviews: { ...prev.reviews, customerReviews: newReviews }
                                      }));
                                    }}
                                    className={`w-6 h-6 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                  >
                                    <Star className="w-4 h-4 fill-current" />
                                  </button>
                                ))}
                              </div>
                              <Textarea
                                placeholder="Customer review text"
                                value={review.review}
                                onChange={(e) => {
                                  const newReviews = [...formData.reviews.customerReviews];
                                  newReviews[index] = { ...review, review: e.target.value };
                                  setFormData(prev => ({
                                    ...prev,
                                    reviews: { ...prev.reviews, customerReviews: newReviews }
                                  }));
                                }}
                                rows={3}
                                className="mb-2"
                              />
                              <div className="grid grid-cols-2 gap-2">
                                <Input
                                  placeholder="Website (e.g., Google)"
                                  value={review.website}
                                  onChange={(e) => {
                                    const newReviews = [...formData.reviews.customerReviews];
                                    newReviews[index] = { ...review, website: e.target.value };
                                    setFormData(prev => ({
                                      ...prev,
                                      reviews: { ...prev.reviews, customerReviews: newReviews }
                                    }));
                                  }}
                                />
                                <Input
                                  type="date"
                                  value={review.date}
                                  onChange={(e) => {
                                    const newReviews = [...formData.reviews.customerReviews];
                                    newReviews[index] = { ...review, date: e.target.value };
                                    setFormData(prev => ({
                                      ...prev,
                                      reviews: { ...prev.reviews, customerReviews: newReviews }
                                    }));
                                  }}
                                />
                              </div>
                            </div>
                            <Button
                              type="button"
                              onClick={() => {
                                const newReviews = formData.reviews.customerReviews.filter((_, i) => i !== index);
                                setFormData(prev => ({
                                  ...prev,
                                  reviews: { ...prev.reviews, customerReviews: newReviews }
                                }));
                              }}
                              variant="outline"
                              size="sm"
                              className="ml-2"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            reviews: {
                              ...prev.reviews,
                              customerReviews: [
                                ...prev.reviews.customerReviews,
                                { customerName: '', rating: 5, review: '', date: '', website: '' }
                              ]
                            }
                          }));
                        }}
                        variant="outline"
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Customer Review
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="britannia-heading text-2xl font-bold mb-4">Terms & Agreements</h2>
                  <p className="britannia-body text-gray-600 mb-6">
                    Please review and accept our terms and conditions
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="britannia-heading font-semibold mb-3">Key Terms:</h3>
                    <ul className="britannia-body text-sm space-y-2 text-gray-700">
                      <li>• Lead fees are charged when you access customer contact details</li>
                      <li>• All work must be completed to Gas Safe standards</li>
                      <li>• Customer reviews and ratings will be publicly visible</li>
                      <li>• Account suspension may occur for poor performance or complaints</li>
                      <li>• Payment is processed within 5 working days after job completion</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="terms"
                        checked={formData.agreements.terms}
                        onCheckedChange={(checked) => setFormData(prev => ({
                          ...prev,
                          agreements: { ...prev.agreements, terms: checked as boolean }
                        }))}
                      />
                      <Label htmlFor="terms" className="britannia-body text-sm">
                        I agree to the <a href="#" className="text-orange-600 hover:underline">Terms and Conditions</a> and 
                        <a href="#" className="text-orange-600 hover:underline ml-1">Engineer Agreement</a> *
                      </Label>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="privacy"
                        checked={formData.agreements.privacy}
                        onCheckedChange={(checked) => setFormData(prev => ({
                          ...prev,
                          agreements: { ...prev.agreements, privacy: checked as boolean }
                        }))}
                      />
                      <Label htmlFor="privacy" className="britannia-body text-sm">
                        I agree to the <a href="#" className="text-orange-600 hover:underline">Privacy Policy</a> *
                      </Label>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="marketing"
                        checked={formData.agreements.marketing}
                        onCheckedChange={(checked) => setFormData(prev => ({
                          ...prev,
                          agreements: { ...prev.agreements, marketing: checked as boolean }
                        }))}
                      />
                      <Label htmlFor="marketing" className="britannia-body text-sm">
                        I agree to receive marketing communications (optional)
                      </Label>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="britannia-heading font-semibold text-blue-800 mb-2">Application Review</h4>
                        <p className="britannia-body text-sm text-blue-700">
                          Your application will be reviewed within 24 hours. We'll verify your Gas Safe registration 
                          and insurance details before approving your account.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              
              {currentStep < 5 ? (
                <Button onClick={nextStep} className="britannia-cta-button">
                  Next Step
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="britannia-cta-button">
                  Submit Application
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
}