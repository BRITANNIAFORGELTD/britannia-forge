import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, Check, X, Upload, AlertTriangle } from 'lucide-react';

interface SimplePhotoUploadProps {
  label: string;
  onPhotoCapture: (file: File) => void;
  hasPhoto: boolean;
  disabled?: boolean;
  required?: boolean;
}

export function SimplePhotoUpload({ 
  label, 
  onPhotoCapture, 
  hasPhoto, 
  disabled = false,
  required = false
}: SimplePhotoUploadProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPermissionHelp, setShowPermissionHelp] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if device is mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const handleCameraCapture = async () => {
    if (disabled) return;
    
    try {
      setIsCapturing(true);
      setError(null);
      
      // Trigger camera capture
      if (cameraInputRef.current) {
        cameraInputRef.current.click();
      }
    } catch (err) {
      setError("Failed to access camera");
      setIsCapturing(false);
    }
  };

  const handleFileUpload = () => {
    if (disabled) return;
    
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate that it's an image
      if (!file.type.startsWith('image/')) {
        setError("Please select an image file");
        return;
      }
      
      setError(null);
      onPhotoCapture(file);
    }
    setIsCapturing(false);
  };

  const handlePermissionHelp = () => {
    setShowPermissionHelp(true);
  };

  return (
    <Card className={`border-2 ${required ? 'border-orange-200' : 'border-gray-200'} ${disabled ? 'opacity-50' : ''}`}>
      <CardContent className="p-4">
        <div className="text-center">
          <div className="mb-4">
            <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700 mb-1">
              {label}
              {required && <span className="text-orange-500 ml-1">*</span>}
            </p>
            <p className="text-xs text-gray-500">
              {isMobile ? 'Take a photo or upload from gallery' : 'Upload a photo from your device'}
            </p>
          </div>

          {hasPhoto ? (
            <div className="space-y-2">
              <div className="flex items-center justify-center text-green-600">
                <Check className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Photo uploaded successfully</span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={isMobile ? handleCameraCapture : handleFileUpload}
                disabled={disabled}
                className="w-full"
              >
                <Camera className="w-4 h-4 mr-2" />
                Replace Photo
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {isMobile ? (
                <>
                  <Button
                    type="button"
                    onClick={handleCameraCapture}
                    disabled={disabled || isCapturing}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    {isCapturing ? 'Opening Camera...' : 'Take Photo'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleFileUpload}
                    disabled={disabled}
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload from Gallery
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  onClick={handleFileUpload}
                  disabled={disabled}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Photo
                </Button>
              )}
            </div>
          )}

          {error && (
            <Alert className="mt-3 border-red-200 bg-red-50">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <AlertDescription className="text-red-800 text-xs">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {showPermissionHelp && (
            <Alert className="mt-3 border-blue-200 bg-blue-50">
              <AlertTriangle className="w-4 h-4 text-blue-600" />
              <AlertDescription className="text-blue-800 text-xs">
                <div className="space-y-2">
                  <p><strong>Camera access blocked?</strong></p>
                  <p>• Check browser settings and allow camera access</p>
                  <p>• Use "Upload from Gallery" as an alternative</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPermissionHelp(false)}
                    className="mt-2"
                  >
                    Close
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Hidden file inputs */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
}
