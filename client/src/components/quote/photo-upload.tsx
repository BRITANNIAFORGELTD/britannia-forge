import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Camera, Upload, Check, X, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuoteData } from '@/hooks/use-quote-data';

interface PhotoRequirement {
  id: string;
  title: string;
  description: string;
  required: boolean;
  boilerTypes: string[];
  examples: string[];
  uploaded: boolean;
  file?: File;
}

interface PhotoUploadProps {
  onPhotosComplete: (photos: { [key: string]: File }) => void;
}

export function PhotoUpload({ onPhotosComplete }: PhotoUploadProps) {
  const { quoteData } = useQuoteData();
  const { toast } = useToast();
  const [uploadedPhotos, setUploadedPhotos] = useState<{ [key: string]: File }>({});
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  
  const currentBoilerType = quoteData.currentBoiler || 'Combi';
  
  // Define photo requirements based on boiler type
  const getPhotoRequirements = (): PhotoRequirement[] => {
    const baseRequirements: PhotoRequirement[] = [
      {
        id: 'boiler-close',
        title: 'Current Boiler - Close Up',
        description: 'Clear photo of your current boiler showing the brand, model, and any visible labels',
        required: true,
        boilerTypes: ['Combi', 'System', 'Regular'],
        examples: ['Front view with readable labels', 'Serial number visible'],
        uploaded: false
      },
      {
        id: 'boiler-distance',
        title: 'Current Boiler - Full View',
        description: 'Photo from a distance showing the boiler and surrounding area',
        required: true,
        boilerTypes: ['Combi', 'System', 'Regular'],
        examples: ['Full cupboard view', 'Surrounding pipework visible'],
        uploaded: false
      },
      {
        id: 'pipework',
        title: 'Pipework and Connections',
        description: 'Photo showing the pipes connecting to your boiler',
        required: true,
        boilerTypes: ['Combi', 'System', 'Regular'],
        examples: ['Water inlet/outlet pipes', 'Gas supply pipe'],
        uploaded: false
      },
      {
        id: 'flue-external',
        title: 'Flue - External View',
        description: 'Photo of where the flue exits your property (outside wall or roof)',
        required: true,
        boilerTypes: ['Combi', 'System', 'Regular'],
        examples: ['External flue termination', 'Roof flue if applicable'],
        uploaded: false
      },
      {
        id: 'gas-meter',
        title: 'Gas Meter',
        description: 'Photo of your gas meter and surrounding area',
        required: true,
        boilerTypes: ['Combi', 'System', 'Regular'],
        examples: ['Full meter view', 'Emergency control valve'],
        uploaded: false
      }
    ];

    // Add system boiler specific requirements
    if (currentBoilerType === 'System') {
      baseRequirements.push(
        {
          id: 'boiler-above',
          title: 'Boiler - View from Above',
          description: 'Photo taken from above the boiler to show top connections and flue',
          required: true,
          boilerTypes: ['System'],
          examples: ['Top connections visible', 'Flue connection point'],
          uploaded: false
        },
        {
          id: 'boiler-below',
          title: 'Boiler - View from Below',
          description: 'Photo taken from below the boiler to show bottom connections',
          required: true,
          boilerTypes: ['System'],
          examples: ['Bottom pipe connections', 'Condensate drain'],
          uploaded: false
        },
        {
          id: 'cylinder-full',
          title: 'Hot Water Cylinder - Full View',
          description: 'Photo of the hot water cylinder showing all around it and its location',
          required: true,
          boilerTypes: ['System'],
          examples: ['Complete cylinder view', 'Surrounding space visible'],
          uploaded: false
        },
        {
          id: 'cylinder-connections',
          title: 'Cylinder Connections',
          description: 'Photo showing the pipes and connections to the hot water cylinder',
          required: true,
          boilerTypes: ['System'],
          examples: ['Inlet/outlet connections', 'Immersion heater if present'],
          uploaded: false
        }
      );
    }

    // Add regular boiler specific requirements
    if (currentBoilerType === 'Regular') {
      baseRequirements.push(
        {
          id: 'boiler-above',
          title: 'Boiler - View from Above',
          description: 'Photo taken from above the boiler to show top connections and flue',
          required: true,
          boilerTypes: ['Regular'],
          examples: ['Top connections visible', 'Flue connection point'],
          uploaded: false
        },
        {
          id: 'boiler-below',
          title: 'Boiler - View from Below',
          description: 'Photo taken from below the boiler to show bottom connections',
          required: true,
          boilerTypes: ['Regular'],
          examples: ['Bottom pipe connections', 'Condensate drain'],
          uploaded: false
        },
        {
          id: 'cylinder-full',
          title: 'Hot Water Cylinder - Full View',
          description: 'Photo of the hot water cylinder showing all around it and its location',
          required: true,
          boilerTypes: ['Regular'],
          examples: ['Complete cylinder view', 'Surrounding space visible'],
          uploaded: false
        },
        {
          id: 'tank-full',
          title: 'Cold Water Tank - Full View',
          description: 'Photo of the cold water tank (usually in loft) and surrounding area',
          required: true,
          boilerTypes: ['Regular'],
          examples: ['Complete tank view', 'Loft installation context'],
          uploaded: false
        },
        {
          id: 'tank-connections',
          title: 'Tank Connections',
          description: 'Photo showing the pipes and connections to the cold water tank',
          required: true,
          boilerTypes: ['Regular'],
          examples: ['Inlet/outlet pipes', 'Overflow pipe'],
          uploaded: false
        }
      );
    }

    return baseRequirements.filter(req => 
      req.boilerTypes.includes(currentBoilerType)
    ).map(req => ({
      ...req,
      uploaded: uploadedPhotos[req.id] !== undefined
    }));
  };

  const requirements = getPhotoRequirements();
  const requiredPhotos = requirements.filter(req => req.required);
  const uploadedCount = Object.keys(uploadedPhotos).length;
  const requiredCount = requiredPhotos.length;
  const isComplete = uploadedCount >= requiredCount;

  const handleFileSelect = (requirementId: string, file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file',
        variant: 'destructive'
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please select an image smaller than 10MB',
        variant: 'destructive'
      });
      return;
    }

    const newPhotos = { ...uploadedPhotos, [requirementId]: file };
    setUploadedPhotos(newPhotos);
    
    toast({
      title: 'Photo uploaded',
      description: `Photo for ${requirements.find(r => r.id === requirementId)?.title} has been uploaded`,
    });

    // Auto-progress when all required photos are uploaded
    if (Object.keys(newPhotos).length >= requiredCount) {
      setTimeout(() => {
        onPhotosComplete(newPhotos);
      }, 1000);
    }
  };

  const handleCameraCapture = (requirementId: string) => {
    const input = fileInputRefs.current[requirementId];
    if (input) {
      input.click();
    }
  };

  const handleFileUpload = (requirementId: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleFileSelect(requirementId, file);
      }
    };
    input.click();
  };

  const removePhoto = (requirementId: string) => {
    const newPhotos = { ...uploadedPhotos };
    delete newPhotos[requirementId];
    setUploadedPhotos(newPhotos);
    
    toast({
      title: 'Photo removed',
      description: `Photo for ${requirements.find(r => r.id === requirementId)?.title} has been removed`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">System Photos Required</h2>
        <p className="text-slate-300">
          We need photos of your current system to provide an accurate quote
        </p>
        <div className="mt-4">
          <Progress value={(uploadedCount / requiredCount) * 100} className="w-full max-w-md mx-auto" />
          <p className="text-sm text-slate-400 mt-2">
            {uploadedCount} of {requiredCount} required photos uploaded
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {requirements.map((requirement) => (
          <Card key={requirement.id} className="glass-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CardTitle className="text-lg text-white">{requirement.title}</CardTitle>
                  {requirement.required && (
                    <Badge className="bg-red-500/20 text-red-400">Required</Badge>
                  )}
                  {requirement.uploaded && (
                    <Badge className="bg-green-500/20 text-green-400">
                      <Check className="h-3 w-3 mr-1" />
                      Uploaded
                    </Badge>
                  )}
                </div>
              </div>
              <p className="text-sm text-slate-300">{requirement.description}</p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="mb-4">
                <h4 className="text-sm font-medium text-slate-300 mb-2">Examples:</h4>
                <div className="flex flex-wrap gap-2">
                  {requirement.examples.map((example, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {example}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {!requirement.uploaded ? (
                  <>
                    <Button
                      onClick={() => handleCameraCapture(requirement.id)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Take Photo
                    </Button>
                    <Button
                      onClick={() => handleFileUpload(requirement.id)}
                      variant="outline"
                      className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Image
                    </Button>
                  </>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-green-400">
                        {uploadedPhotos[requirement.id]?.name}
                      </span>
                    </div>
                    <Button
                      onClick={() => removePhoto(requirement.id)}
                      variant="outline"
                      size="sm"
                      className="border-red-500 text-red-400 hover:bg-red-500/10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Hidden file inputs for camera capture */}
              <input
                ref={(el) => fileInputRefs.current[requirement.id] = el}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(requirement.id, file);
                }}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {isComplete && (
        <Card className="glass-card border-green-500/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <Check className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                All Required Photos Uploaded!
              </h3>
              <p className="text-slate-300 mb-4">
                You can now proceed to the next step or add additional photos if needed.
              </p>
              <Button
                onClick={() => onPhotosComplete(uploadedPhotos)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Continue to Quote Selection
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!isComplete && requiredCount > uploadedCount && (
        <Card className="glass-card border-yellow-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
              <div>
                <p className="text-yellow-400 font-medium">
                  {requiredCount - uploadedCount} more photos required
                </p>
                <p className="text-sm text-slate-300">
                  Please upload all required photos to continue
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}