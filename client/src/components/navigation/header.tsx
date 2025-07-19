import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Wrench, UserCheck, LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
// Header logo - using favicon from public directory
const logoImage = '/favicon.png';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    window.location.href = '/';
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    return user.userType === 'customer' ? '/customer-dashboard' : '/engineer-portal';
  };

  return (
    <nav className="britannia-header sticky top-0 z-50 border-b-0 rounded-none">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-24">
          <div className="flex items-center">
            <a href="/" className="cursor-pointer flex items-center gap-2">
              <img src={logoImage} alt="Britannia Forge" className="w-8 h-8 lg:w-10 lg:h-10 hover:opacity-80 transition-opacity" />
              <span className="font-bold text-lg lg:text-xl text-britannia-green">Britannia Forge</span>
            </a>
          </div>
          
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <a href="/services" className="britannia-body text-gray-700 hover:text-gray-900 transition-colors flex items-center gap-1 text-sm xl:text-base">
              <Wrench className="w-4 h-4" />
              Services
            </a>
            <a href="/about" className="britannia-body text-gray-700 hover:text-gray-900 transition-colors text-sm xl:text-base">About</a>
            <a href="/contact" className="britannia-body text-gray-700 hover:text-gray-900 transition-colors text-sm xl:text-base">Contact</a>
            
            <div className="flex items-center gap-1 lg:gap-3">
              {isAuthenticated ? (
                <>
                  <a href={getDashboardLink()} className="britannia-body text-gray-700 hover:text-gray-900 transition-colors flex items-center gap-1 text-xs lg:text-sm xl:text-base">
                    <User className="w-4 h-4" />
                    <span className="hidden xl:inline">My Dashboard</span>
                    <span className="xl:hidden">Dashboard</span>
                  </a>
                  <button 
                    onClick={handleLogout}
                    className="britannia-body text-gray-700 hover:text-gray-900 transition-colors flex items-center gap-1 text-xs lg:text-sm xl:text-base"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden xl:inline">Log Out</span>
                    <span className="xl:hidden">Logout</span>
                  </button>
                </>
              ) : (
                <a href="/login" className="britannia-body text-gray-700 hover:text-gray-900 transition-colors flex items-center gap-1 text-xs lg:text-sm xl:text-base">
                  <UserCheck className="w-4 h-4" />
                  <span className="hidden xl:inline">Log In</span>
                  <span className="xl:hidden">Login</span>
                </a>
              )}
              
              <a href="/quote" className="britannia-cta-button">
                <span className="hidden sm:inline">Get My Quote</span>
                <span className="sm:hidden">Quote</span>
              </a>
            </div>
          </div>
          
          <button 
            className="lg:hidden p-2 -mr-2 text-gray-700 hover:text-gray-900 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-6 space-y-6">
            {/* Navigation Links */}
            <div className="space-y-4">
              <a href="/services" className="britannia-body block text-gray-700 hover:text-gray-900 transition-colors flex items-center gap-2 py-2">
                <Wrench className="w-4 h-4" />
                Services
              </a>
              <a href="/about" className="britannia-body block text-gray-700 hover:text-gray-900 transition-colors py-2">About</a>
              <a href="/contact" className="britannia-body block text-gray-700 hover:text-gray-900 transition-colors py-2">Contact</a>
            </div>
            
            {/* Account Section */}
            <div className="border-t border-gray-200 pt-4">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <a href={getDashboardLink()} className="britannia-body block text-gray-700 hover:text-gray-900 transition-colors flex items-center gap-2 py-2">
                    <User className="w-4 h-4" />
                    My Dashboard
                  </a>
                  <button 
                    onClick={handleLogout}
                    className="britannia-body block text-gray-700 hover:text-gray-900 transition-colors flex items-center gap-2 w-full text-left py-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </button>
                </div>
              ) : (
                <a href="/login" className="britannia-body block text-gray-700 hover:text-gray-900 transition-colors flex items-center gap-2 py-2">
                  <UserCheck className="w-4 h-4" />
                  Log In
                </a>
              )}
            </div>
            
            {/* CTA Button */}
            <div className="border-t border-gray-200 pt-4">
              <a href="/quote" className="britannia-cta-button w-full text-center block py-3">
                Get My Quote
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
