import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, AlertCircle } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireVerification?: boolean;
  requireRole?: 'admin' | 'editor' | 'engineer' | 'customer';
  requireAdminOrEditor?: boolean;
  fallbackRoute?: string;
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  requireVerification = true,
  requireRole,
  requireAdminOrEditor = false,
  fallbackRoute = '/login'
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Check if authentication is required
  if (requireAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Lock className="w-12 h-12 mx-auto mb-4 text-red-600" />
            <CardTitle className="text-xl text-red-600">Access Denied</CardTitle>
            <CardDescription>
              You must be logged in to access this page
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <button
              onClick={() => setLocation(fallbackRoute)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Login
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if email verification is required
  if (requireVerification && user && !user.emailVerified) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-orange-600" />
            <CardTitle className="text-xl text-orange-600">Email Verification Required</CardTitle>
            <CardDescription>
              Please verify your email address to access this page
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              Check your email for the verification link
            </p>
            <button
              onClick={() => setLocation('/login')}
              className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Back to Login
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if specific role is required
  if (requireRole && user && user.userType !== requireRole) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-red-600" />
            <CardTitle className="text-xl text-red-600">Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access this page
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              This page requires {requireRole} access
            </p>
            <button
              onClick={() => setLocation('/')}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Go to Home
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If all checks pass, render the protected content
  return <>{children}</>;
}

// Convenience components for specific roles
export function AdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute 
      requireAuth={true} 
      requireVerification={true} 
      requireRole="admin"
      fallbackRoute="/britannia1074/admin/login"
    >
      {children}
    </ProtectedRoute>
  );
}

export function EditorRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute 
      requireAuth={true} 
      requireVerification={true} 
      requireRole="editor"
      fallbackRoute="/britannia1074/admin/login"
    >
      {children}
    </ProtectedRoute>
  );
}

export function AdminOrEditorRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute 
      requireAuth={true} 
      requireVerification={true} 
      requireAdminOrEditor={true}
      fallbackRoute="/britannia1074/admin/login"
    >
      {children}
    </ProtectedRoute>
  );
}

export function EngineerRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute 
      requireAuth={true} 
      requireVerification={true} 
      requireRole="engineer"
      fallbackRoute="/trade-login"
    >
      {children}
    </ProtectedRoute>
  );
}

export function CustomerRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute 
      requireAuth={true} 
      requireVerification={true} 
      requireRole="customer"
      fallbackRoute="/customer-login"
    >
      {children}
    </ProtectedRoute>
  );
}