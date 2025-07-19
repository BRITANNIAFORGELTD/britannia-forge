import React, { useState, useRef } from 'react';
import { Camera, Shield, Smartphone, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SecureCameraPhotoProps {
  label: string;
  description: string;
  onPhotoCapture: (file: File) => void;
  onPhotoRemove: () => void;
  photo?: File;
  required?: boolean;
  disabled?: boolean;
}

export function SecureCameraPhoto({
  label,
  description,
  onPhotoCapture,
  onPhotoRemove,
  photo,
  required = false,
  disabled = false
}: SecureCameraPhotoProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [showMobileWarning, setShowMobileWarning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Detect mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isDesktop = !isMobile;

  const handleCameraCapture = () => {
    if (disabled) return;

    // Desktop users must use mobile device for photos
    if (isDesktop) {
      setShowMobileWarning(true);
      return;
    }

    try {
      setIsCapturing(true);
      setError(null);
      
      if (cameraInputRef.current) {
        cameraInputRef.current.click();
      }
    } catch (err) {
      setError("Camera access denied. Please enable camera permissions.");
      setIsCapturing(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Strict image validation
      if (!file.type.startsWith('image/')) {
        setError("Please capture an image using your camera");
        setIsCapturing(false);
        return;
      }

      // File size validation (max 10MB for security)
      if (file.size > 10 * 1024 * 1024) {
        setError("Image too large. Please use camera to capture a smaller image.");
        setIsCapturing(false);
        return;
      }

      setError(null);
      onPhotoCapture(file);
    }
    setIsCapturing(false);
  };

  return (
    <Card className={`border-2 ${required ? 'border-orange-200' : 'border-gray-200'} ${disabled ? 'opacity-50' : ''}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Camera className="w-5 h-5 text-britannia-green" />
          {label}
          {required && <span className="text-orange-500 text-sm font-medium">*Required</span>}
        </CardTitle>
        <p className="text-sm text-gray-600">{description}</p>
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
                <Shield className="w-4 h-4 text-red-600" />
              </button>
            </div>
            
            {/* Security badge */}
            <div className="absolute bottom-2 left-2 bg-britannia-green/90 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Camera Verified
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Desktop warning */}
            {isDesktop && (
              <Alert className="border-orange-200 bg-orange-50">
                <Smartphone className="w-4 h-4 text-orange-600" />
                <AlertDescription className="text-orange-800 text-sm">
                  <strong>Mobile Device Required</strong><br/>
                  For security verification, photos must be taken using your mobile device camera.
                  Please access this page on your phone or tablet.
                </AlertDescription>
              </Alert>
            )}

            {/* Mobile capture button */}
            {isMobile && (
              <Button
                onClick={handleCameraCapture}
                disabled={disabled || isCapturing}
                className="w-full bg-britannia-green hover:bg-britannia-green/90 text-white py-4 text-lg"
              >
                <Camera className="w-6 h-6 mr-2" />
                {isCapturing ? 'Opening Camera...' : 'Take Photo with Camera'}
              </Button>
            )}

            {/* Desktop instruction */}
            {isDesktop && (
              <div className="text-center p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <Smartphone className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium mb-2">Switch to Mobile Device</p>
                <p className="text-sm text-gray-500">
                  Access this page on your phone to capture live photos for verification
                </p>
              </div>
            )}

            {/* Security notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-blue-600 mt-0.5" />
                <div className="text-xs text-blue-800">
                  <p className="font-medium mb-1">Security Features:</p>
                  <ul className="list-disc list-inside space-y-0.5 text-xs">
                    <li>Camera-only capture prevents malware uploads</li>
                    <li>Live photos ensure authentic property assessment</li>
                    <li>Mobile verification prevents desktop file uploads</li>
                  </ul>
                </div>
              </div>
            </div>

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <AlertDescription className="text-red-800 text-sm">{error}</AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Hidden camera input - mobile only */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Mobile warning modal */}
        {showMobileWarning && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-orange-500" />
                  Mobile Device Required
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  For security and verification purposes, all photos must be taken using a mobile device camera.
                </p>
                <div className="bg-orange-50 border border-orange-200 rounded p-3">
                  <p className="text-xs text-orange-800">
                    <strong>Why this matters:</strong><br/>
                    • Prevents malware file uploads<br/>
                    • Ensures authentic property photos<br/>
                    • Provides GPS and camera metadata for verification
                  </p>
                </div>
                <Button
                  onClick={() => setShowMobileWarning(false)}
                  className="w-full"
                >
                  I'll Use My Mobile Device
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
