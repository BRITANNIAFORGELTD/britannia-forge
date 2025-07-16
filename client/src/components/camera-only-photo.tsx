import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, Check, X, Shield, AlertTriangle } from 'lucide-react';

interface CameraOnlyPhotoProps {
  label: string;
  onPhotoCapture: (file: File) => void;
  hasPhoto: boolean;
  isVerifiedAccount: boolean;
  disabled?: boolean;
}

export function CameraOnlyPhoto({ 
  label, 
  onPhotoCapture, 
  hasPhoto, 
  isVerifiedAccount,
  disabled = false 
}: CameraOnlyPhotoProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPermissionHelp, setShowPermissionHelp] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCameraCapture = async () => {
    if (!isVerifiedAccount) {
      setError("Photo capture requires verified account");
      return;
    }

    try {
      setIsCapturing(true);
      setError(null);
      
      // Trigger camera capture
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    } catch (err) {
      setError("Failed to access camera");
      setIsCapturing(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate that it's an image taken by camera
      if (!file.type.startsWith('image/')) {
        setError("Please capture an image using your camera");
        return;
      }
      
      onPhotoCapture(file);
    }
    setIsCapturing(false);
  };

  const handlePermissionHelp = () => {
    setShowPermissionHelp(true);
  };

  if (!isVerifiedAccount) {
    return (
      <Card className="border-2 border-gray-200">
        <CardContent className="p-4 text-center">
          <Shield className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500 mb-2">{label}</p>
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="w-4 h-4 text-orange-600" />
            <AlertDescription className="text-orange-800 text-xs">
              Photo capture requires verified account
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-gray-200">
      <CardContent className="p-4">
        <div className="text-center">
          <div className="mb-3">
            {hasPhoto ? (
              <div className="flex items-center justify-center mb-2">
                <Check className="w-6 h-6 text-green-500" />
              </div>
            ) : (
              <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            )}
            <p className="text-sm font-medium text-gray-700">{label}</p>
          </div>

          {error && (
            <Alert className="mb-3 border-red-200 bg-red-50">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <AlertDescription className="text-red-800 text-xs">
                {error}
                {error.includes("access camera") && (
                  <Button 
                    variant="link" 
                    size="sm" 
                    onClick={handlePermissionHelp}
                    className="ml-2 text-red-600 underline p-0 h-auto"
                  >
                    Need help?
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleCameraCapture}
            disabled={disabled || isCapturing}
            className={`w-full ${hasPhoto ? 'bg-green-500 hover:bg-green-600' : 'bg-forge-orange hover:bg-forge-orange/90'}`}
            size="sm"
          >
            <Camera className="w-4 h-4 mr-2" />
            {isCapturing ? 'Opening Camera...' : hasPhoto ? 'Retake Photo' : 'Take Photo'}
          </Button>

          {/* Hidden file input with camera capture */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Security notice */}
          <div className="mt-2 text-xs text-gray-500 flex items-center justify-center">
            <Shield className="w-3 h-3 mr-1" />
            Camera only - no uploads
          </div>
        </div>

        {/* Permission Help Modal */}
        {showPermissionHelp && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-britannia-green">Camera Permission Help</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPermissionHelp(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-3 text-sm text-gray-600">
                <p>If camera access is blocked:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Click the camera icon in your address bar</li>
                  <li>Select "Allow" for camera access</li>
                  <li>Refresh the page and try again</li>
                </ul>
                <p className="text-xs text-gray-500 mt-3">
                  <Shield className="w-3 h-3 inline mr-1" />
                  We only use your camera to take photos directly - no file uploads allowed for security.
                </p>
              </div>
              <Button
                onClick={() => setShowPermissionHelp(false)}
                className="w-full mt-4 bg-forge-orange hover:bg-forge-orange/90"
              >
                Got it
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}