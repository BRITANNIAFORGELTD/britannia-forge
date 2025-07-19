import React from 'react';
import { Flame, Clock, Mail, MapPin } from 'lucide-react';
import { FaYoutube, FaInstagram, FaTwitter, FaPinterest, FaFacebook } from 'react-icons/fa';
// Footer logo - using main logo from public directory
const logoImage = '/footer-logo.png';

export function Footer() {
  return (
    <footer className="britannia-footer py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <img src={logoImage} alt="Britannia Forge" className="w-32 h-32 brightness-0 invert" />
            </div>
            <p className="text-gray-300 britannia-body">UK's intelligent boiler installation service. Professional, reliable, and efficient across the nation.</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Services</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="britannia-body hover:text-white transition-colors">Boiler Installation</a></li>
              <li><a href="#" className="britannia-body hover:text-white transition-colors">Boiler Repairs</a></li>
              <li><a href="#" className="britannia-body hover:text-white transition-colors">Annual Service</a></li>
              <li><a href="#" className="britannia-body hover:text-white transition-colors">Emergency Call-out</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Support</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/dashboard" className="britannia-body hover:text-white transition-colors">Customer Portal</a></li>
              <li><a href="/dashboard" className="britannia-body hover:text-white transition-colors">Track Installation</a></li>
              <li><a href="/dashboard" className="britannia-body hover:text-white transition-colors">Submit Support Ticket</a></li>
              <li><a href="/dashboard" className="britannia-body hover:text-white transition-colors">Account Management</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Customer Service</h4>
            <div className="space-y-2 text-gray-300">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                <span className="britannia-body">info@britanniaforge.co.uk</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="britannia-body">London, UK</span>
              </div>
              <div className="flex items-start">
                <Clock className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
                <div>
                  <span className="britannia-body">Support Tickets</span>
                  <p className="britannia-body text-sm text-gray-400">Response within 3 hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Social Media Section */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="text-center mb-6">
            <h4 className="font-semibold mb-4 text-white">Follow Us</h4>
            <div className="flex justify-center space-x-6">
              <a 
                href="https://www.youtube.com/@BritanniaForge" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-red-500 transition-colors duration-300"
                aria-label="YouTube"
              >
                <FaYoutube className="w-6 h-6" />
              </a>
              <a 
                href="https://www.instagram.com/britanniaforge/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-pink-500 transition-colors duration-300"
                aria-label="Instagram"
              >
                <FaInstagram className="w-6 h-6" />
              </a>
              <a 
                href="https://x.com/BRITANNIAFORGE" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-blue-400 transition-colors duration-300"
                aria-label="X (Twitter)"
              >
                <FaTwitter className="w-6 h-6" />
              </a>
              <a 
                href="https://uk.pinterest.com/BritanniaForgeLtd/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-red-600 transition-colors duration-300"
                aria-label="Pinterest"
              >
                <FaPinterest className="w-6 h-6" />
              </a>
              <a 
                href="https://www.facebook.com/BritanniaForge" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-blue-600 transition-colors duration-300"
                aria-label="Facebook"
              >
                <FaFacebook className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
          <p className="britannia-body">&copy; 2025 Britannia Forge Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
