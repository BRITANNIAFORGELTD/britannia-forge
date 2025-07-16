import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Check, Upload, AlertCircle, X, Smartphone, FileImage, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface PhotoUploadProps {
  id: string;
  title: string;
  description: string;
  previewImage?: string;
  onUpload: (file: File) => void;
  uploaded?: boolean;
  className?: string;
}

export function PhotoUpload({ 
  id, 
  title, 
  description, 
  previewImage, 
  onUpload, 
  uploaded = false,
  className 
}: PhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showPermissionHelp, setShowPermissionHelp] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Check if device is mobile/tablet
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsMobile(isMobileDevice || isTouchDevice);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setShowOptions(false);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setCapturedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    
    // Simulate upload delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    onUpload(file);
    setIsUploading(false);
  };

  const handleCameraCapture = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handlePermissionHelp = () => {
    setShowPermissionHelp(true);
  };

  return (
    <div className={cn(
      "relative bg-white/80 backdrop-blur-sm rounded-xl p-4 border-2 transition-all duration-300",
      uploaded ? "border-green-300 bg-green-50/80" : "border-gray-200 hover:border-orange-300",
      className
    )}>
      {/* Preview Image */}
      <div className="mb-4">
        {(capturedImage || previewImage) && (
          <div className="relative">
            <img 
              src={capturedImage || previewImage} 
              alt={title}
              className="w-full h-32 sm:h-40 object-cover rounded-lg"
            />
            {uploaded && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Title and Description */}
      <div className="mb-4">
        <h5 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">{title}</h5>
        <p className="text-xs sm:text-sm text-gray-600">{description}</p>
      </div>
      
      {/* Upload Options */}
      <AnimatePresence>
        {!uploaded && !isUploading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            {/* Mobile-First Design: Show both options prominently */}
            {isMobile ? (
              <div className="space-y-2">
                <Button
                  type="button"
                  onClick={handleCameraCapture}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg py-3 px-4 font-medium transition-all duration-300"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Take Photo
                </Button>
                
                <Button
                  type="button"
                  onClick={handleFileUpload}
                  variant="outline"
                  className="w-full border-orange-200 text-orange-600 hover:bg-orange-50 rounded-lg py-3 px-4 font-medium transition-all duration-300"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload from Gallery
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Button
                  type="button"
                  onClick={handleFileUpload}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg py-3 px-4 font-medium transition-all duration-300"
                >
                  <FileImage className="w-4 h-4 mr-2" />
                  Upload Photo
                </Button>
                
                <Button
                  type="button"
                  onClick={handleCameraCapture}
                  variant="outline"
                  className="w-full border-orange-200 text-orange-600 hover:bg-orange-50 rounded-lg py-3 px-4 font-medium transition-all duration-300"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Use Camera
                </Button>
              </div>
            )}
            
            {/* Permission Help Link */}
            <button
              onClick={handlePermissionHelp}
              className="w-full text-xs text-blue-600 hover:text-blue-800 transition-colors underline"
            >
              <Info className="w-3 h-3 mr-1 inline" />
              Having trouble with camera access?
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      {isUploading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-center py-6"
        >
          <div className="animate-spin w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full mr-3" />
          <span className="text-orange-600 font-medium">Processing photo...</span>
        </motion.div>
      )}

      {/* Success State */}
      {uploaded && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-center py-2"
        >
          <Check className="w-5 h-5 text-green-600 mr-2" />
          <span className="text-green-700 font-medium">Photo uploaded successfully</span>
        </motion.div>
      )}

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Permission Help Modal */}
      <AnimatePresence>
        {showPermissionHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowPermissionHelp(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Camera Access Help</h3>
                <button
                  onClick={() => setShowPermissionHelp(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4 text-sm text-gray-600">
                <div className="flex items-start gap-3">
                  <Smartphone className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800 mb-1">Allow Camera Permission</p>
                    <p>Your browser will ask for camera permission. Please click "Allow" to use your camera for taking photos.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800 mb-1">If Camera is Blocked</p>
                    <p>Look for the camera icon in your browser's address bar and click it to change permissions.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Upload className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800 mb-1">Alternative: Upload from Gallery</p>
                    <p>You can also select "Upload from Gallery" to choose existing photos from your device.</p>
                  </div>
                </div>
                
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <p className="text-orange-800 font-medium">
                    ✓ Your privacy is protected - we only access your camera when you explicitly choose to take a photo.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button
                  onClick={() => setShowPermissionHelp(false)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Got it
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
