import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Upload, X, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface PhotoUploadProps {
  label: string;
  description: string;
  required?: boolean;
  onPhotoCapture: (file: File) => void;
  onPhotoRemove: () => void;
  photo?: File;
  className?: string;
}

export function MobilePhotoUpload({ 
  label, 
  description, 
  required = false, 
  onPhotoCapture, 
  onPhotoRemove, 
  photo, 
  className = '' 
}: PhotoUploadProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [showPermissionHelp, setShowPermissionHelp] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const handleCameraCapture = () => {
    if (cameraInputRef.current) {
      setIsCapturing(true);
      cameraInputRef.current.click();
    }
  };

  const handleGalleryUpload = () => {
    if (galleryInputRef.current) {
      galleryInputRef.current.click();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onPhotoCapture(file);
    }
    setIsCapturing(false);
  };

  const handlePermissionDenied = () => {
    setIsCapturing(false);
    setShowPermissionHelp(true);
  };

  return (
    <Card className={`${className} border-2 ${required ? 'border-orange-200' : 'border-gray-200'}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          {label}
          {required && <span className="text-orange-500 text-sm font-medium">*Required</span>}
        </CardTitle>
        <CardDescription className="text-sm text-gray-600">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {photo ? (
          <div className="relative">
            <img 
              src={URL.createObjectURL(photo)} 
              alt={label}
              className="w-full h-48 object-cover rounded-lg border-2 border-green-200"
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <div className="bg-green-100 border border-green-300 rounded-full p-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <button
                onClick={onPhotoRemove}
                className="bg-red-100 border border-red-300 rounded-full p-2 hover:bg-red-200 transition-colors"
              >
                <X className="w-4 h-4 text-red-600" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {isMobile ? (
              <>
                <Button
                  type="button"
                  onClick={handleCameraCapture}
                  disabled={isCapturing}
                  className="w-full py-6 bg-orange-500 hover:bg-orange-600 text-white font-medium text-lg"
                >
                  <Camera className="w-6 h-6 mr-3" />
                  {isCapturing ? 'Opening Camera...' : 'Take Photo'}
                </Button>
                
                <Button
                  type="button"
                  onClick={handleGalleryUpload}
                  variant="outline"
                  className="w-full py-4 border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Upload from Gallery
                </Button>
              </>
            ) : (
              <Button
                type="button"
                onClick={handleGalleryUpload}
                className="w-full py-6 bg-orange-500 hover:bg-orange-600 text-white font-medium text-lg"
              >
                <Upload className="w-6 h-6 mr-3" />
                Upload Photo
              </Button>
            )}
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Camera className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-gray-500 text-sm">
                {isMobile ? 'Tap "Take Photo" to use your camera' : 'Click to upload a photo'}
              </p>
            </div>
          </div>
        )}
        
        {/* Hidden inputs for camera and gallery */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {/* Permission Help Modal */}
        {showPermissionHelp && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-500" />
                  Camera Permission Help
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  To take photos, please allow camera access:
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Look for a camera icon in your address bar</li>
                  <li>• Click "Allow" when prompted</li>
                  <li>• Or go to Settings → Site permissions → Camera</li>
                </ul>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowPermissionHelp(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Got it
                  </Button>
                  <Button
                    onClick={handleGalleryUpload}
                    className="flex-1"
                  >
                    Use Gallery Instead
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}