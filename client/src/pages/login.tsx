import React from 'react';
import { SecureLogin } from '@/components/auth/secure-login';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'wouter';

export default function LoginPage() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();

  const handleLoginSuccess = (user: any, token: string) => {
    login(user, token);
    
    // Redirect based on user type
    if (user.userType === 'admin') {
      setLocation('/admin/dashboard');
    } else if (user.userType === 'engineer') {
      setLocation('/engineer-portal');
    } else {
      setLocation('/customer-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SecureLogin onLoginSuccess={handleLoginSuccess} />
    </div>
  );
}