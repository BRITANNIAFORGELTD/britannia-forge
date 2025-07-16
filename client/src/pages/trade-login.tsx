import { useState } from 'react';
import { Link } from 'wouter';
import { Header } from '@/components/navigation/header';
import { Footer } from '@/components/navigation/footer';
import { SEOHead } from '@/components/seo/seo-head';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuthContext } from '@/components/auth/auth-provider';
import { HardHat, Mail, Lock, ArrowLeft } from 'lucide-react';

export default function TradeLogin() {
  const { toast } = useToast();
  const { login } = useAuthContext();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate login process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set user authentication state
      login({
        id: 'trade-1',
        email: formData.email,
        name: formData.email.split('@')[0],
        userType: 'trade',
        isVerified: true
      });
      
      toast({
        title: "Login Successful",
        description: "Welcome back! Redirecting to your dashboard...",
      });
      
      // Redirect to trade dashboard
      window.location.href = '/engineer-portal';
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead 
        title="Trade Professional Login | Britannia Forge"
        description="Login to your Britannia Forge trade professional account to view job leads, manage your schedule, and update your profile."
      />
      <Header />
      
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-6">
          <Link href="/login">
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 p-2 -ml-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Login Options
            </button>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <HardHat className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Trade Professional Login</CardTitle>
            <CardDescription>
              Access your Britannia Forge professional dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/forgot-password" className="text-sm text-green-600 hover:text-green-800">
                Forgot your password?
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600 mb-2">
                Don't have an account?
              </p>
              <Link href="/trade-register" className="text-forge-orange hover:text-orange-600 font-medium">
                Become a Britannia Forge certified professional today
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
}