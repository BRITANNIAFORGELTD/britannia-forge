import React, { useState, useEffect } from 'react';
import { Mail, Shield, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface EmailVerificationProps {
  email: string;
  onEmailChange: (email: string) => void;
  onVerificationComplete: (verified: boolean) => void;
  isVerified: boolean;
  required?: boolean;
}

export function EmailVerification({
  email,
  onEmailChange,
  onVerificationComplete,
  isVerified,
  required = true
}: EmailVerificationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'email' | 'verify' | 'complete'>('email');
  const [error, setError] = useState<string | null>(null);
  const [resendCount, setResendCount] = useState(0);
  const [cooldown, setCooldown] = useState(0);

  // Email validation
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const sendVerificationCode = async () => {
    if (!isValidEmail || isLoading || cooldown > 0) return;

    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call to send verification email
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In real implementation, this would call your email service
      // await apiRequest('/api/auth/send-verification', { 
      //   method: 'POST', 
      //   body: { email } 
      // });
      
      setStep('verify');
      setResendCount(prev => prev + 1);
      setCooldown(60); // 1 minute cooldown
      
    } catch (err) {
      setError('Failed to send verification email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter the 6-digit verification code');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call to verify code
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock verification - in real app, verify with backend
      const isValidCode = verificationCode === '123456' || verificationCode.match(/^[0-9]{6}$/);
      
      if (isValidCode) {
        setStep('complete');
        onVerificationComplete(true);
      } else {
        setError('Invalid verification code. Please check and try again.');
      }
      
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    if (cooldown === 0) {
      sendVerificationCode();
    }
  };

  if (isVerified || step === 'complete') {
    return (
      <Card className="border-2 border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 rounded-full p-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-green-800">Email Verified</p>
              <p className="text-sm text-green-600">{email}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-2 ${required ? 'border-orange-200' : 'border-gray-200'}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Mail className="w-5 h-5 text-britannia-green" />
          Email Verification
          {required && <span className="text-orange-500 text-sm font-medium">*Required</span>}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {step === 'email' && (
          <>
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                className="text-base"
              />
              {email && !isValidEmail && (
                <p className="text-sm text-red-500">Please enter a valid email address</p>
              )}
            </div>

            <Alert className="border-blue-200 bg-blue-50">
              <Shield className="w-4 h-4 text-blue-600" />
              <AlertDescription className="text-blue-800 text-sm">
                <strong>Why verify your email?</strong><br/>
                • Required for job confirmations and updates<br/>
                • Enables secure photo capture functionality<br/>
                • Protects against fraudulent service requests
              </AlertDescription>
            </Alert>

            <Button
              onClick={sendVerificationCode}
              disabled={!isValidEmail || isLoading}
              className="w-full bg-britannia-green hover:bg-britannia-green/90"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Send Verification Code
                </>
              )}
            </Button>
          </>
        )}

        {step === 'verify' && (
          <>
            <div className="text-center">
              <Mail className="w-12 h-12 text-britannia-green mx-auto mb-3" />
              <p className="font-medium text-gray-800 mb-2">Check Your Email</p>
              <p className="text-sm text-gray-600 mb-4">
                We've sent a 6-digit verification code to:<br/>
                <strong>{email}</strong>
              </p>
            </div>

            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="text-center text-xl tracking-wider font-mono"
                maxLength={6}
              />
            </div>

            <Button
              onClick={verifyCode}
              disabled={verificationCode.length !== 6 || isLoading}
              className="w-full bg-britannia-green hover:bg-britannia-green/90"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Email'
              )}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
              <Button
                variant="outline"
                onClick={handleResend}
                disabled={cooldown > 0 || isLoading}
                className="text-sm"
              >
                {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Code'}
              </Button>
              {resendCount > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Attempts: {resendCount}/3
                </p>
              )}
            </div>

            <Button
              variant="ghost"
              onClick={() => setStep('email')}
              className="w-full text-sm"
            >
              Change Email Address
            </Button>
          </>
        )}

        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <AlertDescription className="text-red-800 text-sm">{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
