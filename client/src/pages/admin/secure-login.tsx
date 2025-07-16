import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, Shield, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { apiRequest } from '@/lib/queryClient';
import { SEOHead } from '@/components/seo/seo-head';

export default function SecureAdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [, setLocation] = useLocation();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiRequest('POST', '/api/auth/login', {
        email,
        password,
      });

      // Parse the JSON response
      const data = await response.json();
      console.log('Login response:', data); // Debug log

      // Check if response has user data
      if (!data.user) {
        setError('Invalid login response from server');
        setLoading(false);
        return;
      }

      // Check if user is admin
      if (data.user.userType !== 'admin') {
        setError('Admin access required');
        setLoading(false);
        return;
      }

      // Check if email verification is required
      if (data.requiresVerification) {
        setError('Email verification required for admin access');
        setLoading(false);
        return;
      }

      // Login successful
      login(data.user, data.token);
      setLocation('/britannia1074/admin/dashboard');
    } catch (error: any) {
      console.error('Login error:', error); // Debug log
      setError(error.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <SEOHead 
        title="Secure Admin Access | Britannia Forge"
        description="Secure admin dashboard access for Britannia Forge administrators"
        robots="noindex, nofollow"
      />
      
      <Card className="w-full max-w-md bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-blue-400 mr-2" />
            <Lock className="w-8 h-8 text-red-400" />
          </div>
          <CardTitle className="text-2xl text-white">Secure Admin Access</CardTitle>
          <CardDescription className="text-slate-300">
            High-security admin dashboard login
          </CardDescription>
          <div className="mt-4 px-4 py-2 bg-red-900/30 border border-red-700 rounded-lg">
            <p className="text-red-300 text-sm font-medium">
              🔒 Admin-only access • Enhanced security required
            </p>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert className="border-red-700 bg-red-900/30 text-red-300">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200">
                Admin Email
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@britanniaforge.co.uk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-200">
                Admin Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Authenticating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Secure Admin Login
                </div>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              Admin access only • All attempts are logged
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}