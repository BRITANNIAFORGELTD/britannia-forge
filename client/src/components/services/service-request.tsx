import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Wrench, 
  ShieldCheck, 
  Zap, 
  Droplets, 
  Palette, 
  HardHat, 
  Camera, 
  Upload, 
  Check, 
  X,
  AlertCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  User
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface ServiceRequestProps {
  onSubmit: (requestData: any) => void;
}

export function ServiceRequest({ onSubmit }: ServiceRequestProps) {
  const [formData, setFormData] = useState({
    serviceType: '',
    description: '',
    urgency: '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    postcode: '',
    photos: [] as File[]
  });

  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const serviceTypes = [
    { id: 'boiler-repair', name: 'Boiler Repair', icon: Wrench, color: 'text-orange-400', bgColor: 'bg-orange-500/20' },
    { id: 'landlord-safety', name: 'Landlord Safety Certificate', icon: ShieldCheck, color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
    { id: 'electrician', name: 'Electrical Services', icon: Zap, color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' },
    { id: 'plumber', name: 'Plumbing Services', icon: Droplets, color: 'text-cyan-400', bgColor: 'bg-cyan-500/20' },
    { id: 'decorator', name: 'Decoration & Painting', icon: Palette, color: 'text-purple-400', bgColor: 'bg-purple-500/20' },
    { id: 'handyman', name: 'General Handyman', icon: HardHat, color: 'text-gray-400', bgColor: 'bg-gray-500/20' },
  ];

  const urgencyLevels = [
    { id: 'low', name: 'Low Priority', description: 'Can wait a few days', color: 'text-green-400' },
    { id: 'medium', name: 'Medium Priority', description: 'Within 24-48 hours', color: 'text-yellow-400' },
    { id: 'high', name: 'High Priority', description: 'Same day service needed', color: 'text-red-400' },
    { id: 'emergency', name: 'Emergency', description: 'Immediate attention required', color: 'text-red-600' },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (files: FileList | null) => {
    if (!files) return;
    
    const newPhotos = Array.from(files).filter(file => {
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please select image files only',
          variant: 'destructive'
        });
        return false;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please select images smaller than 10MB',
          variant: 'destructive'
        });
        return false;
      }
      
      return true;
    });

    setUploadedPhotos(prev => [...prev, ...newPhotos]);
    setFormData(prev => ({ ...prev, photos: [...prev.photos, ...newPhotos] }));
  };

  const removePhoto = (index: number) => {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({ 
      ...prev, 
      photos: prev.photos.filter((_, i) => i !== index) 
    }));
  };

  const handleCameraCapture = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.multiple = true;
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      handlePhotoUpload(files);
    };
    input.click();
  };

  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      handlePhotoUpload(files);
    };
    input.click();
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.serviceType !== '';
      case 2:
        return formData.description.trim() !== '' && formData.urgency !== '';
      case 3:
        return formData.customerName.trim() !== '' && 
               formData.customerPhone.trim() !== '' && 
               formData.customerEmail.trim() !== '' && 
               formData.postcode.trim() !== '';
      case 4:
        return uploadedPhotos.length > 0;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    } else {
      toast({
        title: 'Please complete all required fields',
        description: 'Fill in all required information before proceeding',
        variant: 'destructive'
      });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const submitRequest = async () => {
    if (!validateStep(4)) {
      toast({
        title: 'Please complete all required fields',
        description: 'All steps must be completed before submitting',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    
    try {
      const response = await apiRequest('POST', '/api/job-requests', formData);
      
      if (response.ok) {
        toast({
          title: 'Job request submitted successfully',
          description: 'Engineers will be notified and can access your job details',
        });
        onSubmit(formData);
      } else {
        throw new Error('Failed to submit request');
      }
    } catch (error) {
      toast({
        title: 'Failed to submit request',
        description: 'Please try again or contact support',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedService = serviceTypes.find(s => s.id === formData.serviceType);
  const selectedUrgency = urgencyLevels.find(u => u.id === formData.urgency);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Request Service</h2>
        <p className="text-slate-300">Get connected with verified engineers in your area</p>
        <div className="mt-4">
          <Progress value={(currentStep / 4) * 100} className="w-full max-w-md mx-auto" />
          <p className="text-sm text-slate-400 mt-2">Step {currentStep} of 4</p>
        </div>
      </div>

      {/* Step 1: Service Type Selection */}
      {currentStep === 1 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">Select Service Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {serviceTypes.map((service) => (
                <div
                  key={service.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.serviceType === service.id
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-slate-600 hover:border-slate-500'
                  }`}
                  onClick={() => handleInputChange('serviceType', service.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${service.bgColor}`}>
                      <service.icon className={`h-5 w-5 ${service.color}`} />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{service.name}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Description and Urgency */}
      {currentStep === 2 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">Job Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-slate-300">Describe the issue or work needed</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Please provide details about what needs to be done..."
                className="mt-2 bg-slate-800/50 border-slate-600 text-white"
                rows={4}
              />
            </div>
            
            <div>
              <Label className="text-slate-300">Urgency Level</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                {urgencyLevels.map((level) => (
                  <div
                    key={level.id}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.urgency === level.id
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-slate-600 hover:border-slate-500'
                    }`}
                    onClick={() => handleInputChange('urgency', level.id)}
                  >
                    <div className="flex items-center space-x-2">
                      <Clock className={`h-4 w-4 ${level.color}`} />
                      <div>
                        <h4 className={`font-medium ${level.color}`}>{level.name}</h4>
                        <p className="text-sm text-slate-400">{level.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Contact Information */}
      {currentStep === 3 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-slate-300">Full Name</Label>
              <div className="relative mt-2">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  value={formData.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  placeholder="Your full name"
                  className="pl-10 bg-slate-800/50 border-slate-600 text-white"
                />
              </div>
            </div>
            
            <div>
              <Label className="text-slate-300">Phone Number</Label>
              <div className="relative mt-2">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  value={formData.customerPhone}
                  onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                  placeholder="07123456789"
                  className="pl-10 bg-slate-800/50 border-slate-600 text-white"
                />
              </div>
            </div>
            
            <div>
              <Label className="text-slate-300">Email Address</Label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                  placeholder="your.email@example.com"
                  className="pl-10 bg-slate-800/50 border-slate-600 text-white"
                />
              </div>
            </div>
            
            <div>
              <Label className="text-slate-300">Postcode</Label>
              <div className="relative mt-2">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  value={formData.postcode}
                  onChange={(e) => handleInputChange('postcode', e.target.value.toUpperCase())}
                  placeholder="SW1A 1AA"
                  className="pl-10 bg-slate-800/50 border-slate-600 text-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Photo Upload */}
      {currentStep === 4 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">Upload Photos</CardTitle>
            <p className="text-slate-300 text-sm">
              Add photos to help engineers understand the work needed
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleCameraCapture}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Camera className="h-4 w-4 mr-2" />
                Take Photos
              </Button>
              <Button
                onClick={handleFileUpload}
                variant="outline"
                className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload from Device
              </Button>
            </div>

            {uploadedPhotos.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-slate-300">
                  Uploaded Photos ({uploadedPhotos.length})
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {uploadedPhotos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                      <Button
                        onClick={() => removePhoto(index)}
                        size="sm"
                        variant="destructive"
                        className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {uploadedPhotos.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed border-slate-600 rounded-lg">
                <Camera className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-300">No photos uploaded yet</p>
                <p className="text-sm text-slate-400">Add photos to help engineers understand your needs</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          onClick={prevStep}
          variant="outline"
          disabled={currentStep === 1}
          className="border-slate-600 text-slate-300 hover:bg-slate-800"
        >
          Previous
        </Button>
        
        {currentStep < 4 ? (
          <Button
            onClick={nextStep}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={submitRequest}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </Button>
        )}
      </div>

      {/* Summary Preview */}
      {currentStep === 4 && (
        <Card className="glass-card border-blue-500/20">
          <CardHeader>
            <CardTitle className="text-white">Request Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Service Type:</span>
              <div className="flex items-center space-x-2">
                {selectedService && <selectedService.icon className={`h-4 w-4 ${selectedService.color}`} />}
                <span className="text-white">{selectedService?.name}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Urgency:</span>
              <span className={selectedUrgency?.color}>{selectedUrgency?.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Photos:</span>
              <span className="text-white">{uploadedPhotos.length} uploaded</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Location:</span>
              <span className="text-white">{formData.postcode}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}