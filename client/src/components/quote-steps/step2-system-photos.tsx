import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Camera } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { PhotoUpload } from '@/components/ui/photo-upload';
import { QuoteData, PhotoRequirement } from '@/types/quote';

interface Step2Props {
  data: QuoteData;
  onUpdate: (updates: Partial<QuoteData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function Step2SystemPhotos({ data, onUpdate, onNext, onPrev }: Step2Props) {
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>(data.photos || []);

  const mandatoryPhotos: PhotoRequirement[] = [
    {
      id: 'boiler-close',
      title: 'Boiler (Close-Up)',
      description: 'A clear photo of your current boiler',
      mandatory: true
    },
    {
      id: 'boiler-distant',
      title: 'Boiler (Distant View)',
      description: 'Show boiler & surrounding area',
      mandatory: true
    },
    {
      id: 'pipework',
      title: 'Boiler (Pipework Below)',
      description: 'Photo looking up under boiler',
      mandatory: true
    },
    {
      id: 'flue-above',
      title: 'Boiler (Flue Above)',
      description: 'Photo of flue connection on top',
      mandatory: true
    },
    {
      id: 'flue-external',
      title: 'External Flue Terminal',
      description: 'Photo of flue outside building',
      mandatory: true
    },
    {
      id: 'gas-meter',
      title: 'Gas Meter',
      description: 'A clear photo of your gas meter',
      mandatory: true
    },
    {
      id: 'stopcock',
      title: 'Main Water Stopcock',
      description: 'Main water shut-off valve',
      mandatory: true
    },
    {
      id: 'fuse-box',
      title: 'Main Electrical Fuse Box',
      description: 'Photo of your main fuse box',
      mandatory: true
    }
  ];

  const conditionalPhotos: PhotoRequirement[] = [
    {
      id: 'cylinder',
      title: 'Hot Water Cylinder',
      description: 'Clear photo of hot water cylinder',
      mandatory: false,
      condition: (data.currentBoiler === 'System' || data.currentBoiler === 'Regular')
    },
    {
      id: 'loft-tanks',
      title: 'Loft Tank(s)',
      description: 'Photo of water tank(s) in loft',
      mandatory: false,
      condition: (data.currentBoiler === 'Regular')
    }
  ];

  const optionalPhotos: PhotoRequirement[] = [
    {
      id: 'optional-1',
      title: 'Optional Photo 1',
      description: 'Add any other relevant photo',
      mandatory: false
    },
    {
      id: 'optional-2',
      title: 'Optional Photo 2', 
      description: 'Add any other relevant photo',
      mandatory: false
    },
    {
      id: 'optional-3',
      title: 'Optional Photo 3',
      description: 'Add any other relevant photo',
      mandatory: false
    },
    {
      id: 'optional-4',
      title: 'Optional Photo 4',
      description: 'Add any other relevant photo',
      mandatory: false
    }
  ];

  const handlePhotoUpload = (photoId: string, file: File) => {
    const newPhoto = `${photoId}-${Date.now()}`;
    const newPhotos = [...uploadedPhotos, newPhoto];
    setUploadedPhotos(newPhotos);
    onUpdate({ photos: newPhotos });
  };

  const isPhotoUploaded = (photoId: string) => {
    return uploadedPhotos.some(photo => photo.startsWith(photoId));
  };

  const canProceed = () => {
    // Check if all mandatory photos are uploaded
    const allMandatoryUploaded = mandatoryPhotos.every(photo => 
      isPhotoUploaded(photo.id)
    );
    
    // Check if all conditional photos are uploaded (if required)
    const allConditionalUploaded = conditionalPhotos
      .filter(photo => photo.condition)
      .every(photo => isPhotoUploaded(photo.id));
    
    return allMandatoryUploaded && allConditionalUploaded;
  };

  const stockImages = [
    "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop"
  ];

  return (
    <GlassCard className="mb-8 fade-in">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl sm:text-2xl font-bold text-britannia-dark">Please Provide Photos of Your System</h3>
          <div className="flex items-center space-x-2">
            <span className="text-xs sm:text-sm text-gray-600">Step 2 of 6</span>
            <ProgressBar value={2} max={6} />
          </div>
        </div>
        <p className="text-sm sm:text-base text-gray-600 mb-4">Clear photos help our experts confirm your quote and prepare perfectly for the installation</p>
        
        {/* Mobile-friendly instructions */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <Camera className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-orange-800 mb-2">Photo Requirements</h4>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• Take clear, well-lit photos</li>
                <li>• Make sure boiler model numbers are visible</li>
                <li>• Include surrounding area for context</li>
                <li>• All mandatory photos must be uploaded to continue</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h4 className="text-base sm:text-lg font-semibold text-britannia-dark mb-4">Mandatory Photos</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {mandatoryPhotos.map((photo, index) => (
            <PhotoUpload
              key={photo.id}
              id={photo.id}
              title={photo.title}
              description={photo.description}
              previewImage={stockImages[index]}
              onUpload={(file) => handlePhotoUpload(photo.id, file)}
              uploaded={isPhotoUploaded(photo.id)}
            />
          ))}
        </div>
      </div>

      {conditionalPhotos.some(photo => photo.condition) && (
        <div className="mb-8">
          <h4 className="text-base sm:text-lg font-semibold text-britannia-dark mb-4">Additional Required Photos</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {conditionalPhotos.filter(photo => photo.condition).map((photo, index) => (
              <PhotoUpload
                key={photo.id}
                id={photo.id}
                title={photo.title}
                description={photo.description}
                previewImage={stockImages[index % stockImages.length]}
                onUpload={(file) => handlePhotoUpload(photo.id, file)}
                uploaded={isPhotoUploaded(photo.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Optional Photos */}
      <div className="mb-8">
        <h4 className="text-base sm:text-lg font-semibold text-britannia-dark mb-4">Optional Photos</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {optionalPhotos.map((photo, index) => (
            <PhotoUpload
              key={photo.id}
              id={photo.id}
              title={photo.title}
              description={photo.description}
              previewImage={stockImages[index % stockImages.length]}
              onUpload={(file) => handlePhotoUpload(photo.id, file)}
              uploaded={isPhotoUploaded(photo.id)}
            />
          ))}
        </div>
      </div>

      {/* Progress Summary */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Photo Upload Progress</span>
          <span className="text-sm text-gray-600">
            {uploadedPhotos.length} / {mandatoryPhotos.length + conditionalPhotos.filter(p => p.condition).length} required
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${Math.min(100, (uploadedPhotos.length / (mandatoryPhotos.length + conditionalPhotos.filter(p => p.condition).length)) * 100)}%` 
            }}
          />
        </div>
        {!canProceed() && (
          <p className="text-sm text-red-600 mt-2">
            Please upload all mandatory photos to continue
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0">
        <Button
          variant="outline"
          onClick={onPrev}
          className="px-6 sm:px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors order-2 sm:order-1"
        >
          <ArrowLeft className="w-4 h-4 mr-2 sm:mr-3" />
          Back
        </Button>
        <Button
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 sm:px-10 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onNext}
          disabled={!canProceed()}
        >
          {canProceed() ? (
            <>Continue <ArrowRight className="w-4 h-4 ml-2 sm:ml-3" /></>
          ) : (
            <>Upload All Photos to Continue</>
          )}
        </Button>
      </div>
    </GlassCard>
  );
}
