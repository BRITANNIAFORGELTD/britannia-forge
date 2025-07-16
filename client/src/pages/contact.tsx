import React, { useState } from 'react';
import { Header } from '@/components/navigation/header';
import { Footer } from '@/components/navigation/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CameraOnlyPhoto } from '@/components/camera-only-photo';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, Upload, Shield, AlertTriangle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  photos: {
    photo1: File | null;
    photo2: File | null;
    photo3: File | null;
  };
}

export default function Contact() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    photos: {
      photo1: null,
      photo2: null,
      photo3: null,
    }
  });
  
  const [step, setStep] = useState<'form' | 'verify' | 'success'>('form');
  const [verificationCode, setVerificationCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifiedAccount, setIsVerifiedAccount] = useState(false);
  const { toast } = useToast();

  // SEO Meta Tags
  React.useEffect(() => {
    document.title = "Contact Us - Get in Touch | Britannia Forge";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Contact Britannia Forge for support, questions, or service inquiries. Our team is ready to help with your home improvement needs across the UK.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Contact Britannia Forge for support, questions, or service inquiries. Our team is ready to help with your home improvement needs across the UK.';
      document.head.appendChild(meta);
    }

    return () => {
      document.title = 'Britannia Forge - Professional Home Services';
    };
  }, []);

  const sendVerificationMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await apiRequest('POST', '/api/send-verification', { email });
      return response.json();
    },
    onSuccess: () => {
      setStep('verify');
      setIsVerifiedAccount(true); // Enable camera access after verification code is sent
      toast({
        title: "Verification Code Sent",
        description: "Please check your email for the 6-digit verification code. Camera access is now enabled.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send verification code. Please try again.",
        variant: "destructive",
      });
    }
  });

  const submitContactMutation = useMutation({
    mutationFn: async (data: any) => {
      const formDataToSend = new FormData();
      
      // Add text fields
      formDataToSend.append('name', data.name);
      formDataToSend.append('email', data.email);
      formDataToSend.append('phone', data.phone);
      formDataToSend.append('subject', data.subject);
      formDataToSend.append('message', data.message);
      formDataToSend.append('verificationCode', data.verificationCode);
      
      // Add photos
      Object.entries(data.photos).forEach(([key, file]) => {
        if (file) {
          formDataToSend.append(key, file);
        }
      });

      const response = await fetch('/api/contact/submit', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit contact form');
      }

      return response.json();
    },
    onSuccess: () => {
      setStep('success');
      toast({
        title: "Message Sent Successfully",
        description: "Thank you for contacting us. We'll get back to you within 24 hours.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.subject || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    await sendVerificationMutation.mutateAsync(formData.email);
    setIsSubmitting(false);
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter the 6-digit verification code.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    await submitContactMutation.mutateAsync({
      ...formData,
      verificationCode
    });
    setIsSubmitting(false);
  };

  const handlePhotoCapture = (photoKey: keyof typeof formData.photos) => (file: File) => {
    setFormData(prev => ({
      ...prev,
      photos: {
        ...prev.photos,
        [photoKey]: file
      }
    }));
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-britannia-green mb-4">Message Sent Successfully!</h1>
              <p className="text-gray-600 mb-6">
                Thank you for contacting us. We'll get back to you within 24 hours.
              </p>
              <Button onClick={() => window.location.href = '/'} className="bg-forge-orange hover:bg-forge-orange/90">
                Return to Home
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-white py-12 md:py-16">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-britannia-green">Get in Touch</h1>
            <p className="mt-4 text-lg max-w-2xl mx-auto text-gray-700">
              Have a question or need support? Our team is ready to help.
            </p>
          </div>
        </section>



        {/* Contact Form */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
              {step === 'form' && (
                <>
                  <h2 className="text-3xl font-bold mb-6 text-center text-britannia-green">Send us a Message</h2>
                  <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name *</Label>
                        <Input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          required
                          className="mt-1"
                          placeholder="Enter your full name"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          required
                          className="mt-1"
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        required
                        className="mt-1"
                        placeholder="Enter your email address"
                      />
                    </div>

                    <div>
                      <Label htmlFor="subject" className="text-sm font-medium text-gray-700">Subject *</Label>
                      <Input
                        id="subject"
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                        required
                        className="mt-1"
                        placeholder="Enter message subject"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-sm font-medium text-gray-700">Your Message *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        required
                        rows={5}
                        className="mt-1 resize-none"
                        placeholder="Please describe your inquiry in detail..."
                      />
                    </div>

                    {/* Account Verification Notice */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center mb-2">
                        <Shield className="w-5 h-5 text-blue-600 mr-2" />
                        <h3 className="text-lg font-semibold text-blue-800">Account Verification Required</h3>
                      </div>
                      <p className="text-sm text-blue-700">
                        To prevent security risks and ensure authentic communications, photo capture is only available to verified accounts. 
                        Complete email verification to enable camera access.
                      </p>
                    </div>

                    {/* Photo Capture Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-britannia-green">Attach Photos (Optional)</h3>
                      <p className="text-sm text-gray-600">
                        Take up to 3 photos using your device camera to help us understand your inquiry better.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <CameraOnlyPhoto
                          label="Photo 1"
                          onPhotoCapture={handlePhotoCapture('photo1')}
                          hasPhoto={!!formData.photos.photo1}
                          isVerifiedAccount={isVerifiedAccount}
                        />
                        <CameraOnlyPhoto
                          label="Photo 2"
                          onPhotoCapture={handlePhotoCapture('photo2')}
                          hasPhoto={!!formData.photos.photo2}
                          isVerifiedAccount={isVerifiedAccount}
                        />
                        <CameraOnlyPhoto
                          label="Photo 3"
                          onPhotoCapture={handlePhotoCapture('photo3')}
                          hasPhoto={!!formData.photos.photo3}
                          isVerifiedAccount={isVerifiedAccount}
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-forge-orange hover:bg-forge-orange/90 text-white py-3 text-lg font-semibold"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                      <Send className="ml-2 w-4 h-4" />
                    </Button>
                  </form>
                </>
              )}

              {step === 'verify' && (
                <>
                  <h2 className="text-3xl font-bold mb-6 text-center text-britannia-green">Verify Your Email</h2>
                  <div className="text-center mb-6">
                    <Mail className="w-16 h-16 text-forge-orange mx-auto mb-4" />
                    <p className="text-gray-600">
                      We've sent a 6-digit verification code to <strong>{formData.email}</strong>
                    </p>
                  </div>
                  
                  <form onSubmit={handleVerificationSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="verification-code" className="text-sm font-medium text-gray-700">Verification Code</Label>
                      <Input
                        id="verification-code"
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="Enter 6-digit code"
                        maxLength={6}
                        className="mt-1 text-center text-2xl tracking-widest"
                        required
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep('form')}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button 
                        type="submit" 
                        className="flex-1 bg-forge-orange hover:bg-forge-orange/90"
                        disabled={isSubmitting || verificationCode.length !== 6}
                      >
                        {isSubmitting ? 'Verifying...' : 'Verify & Send'}
                      </Button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}