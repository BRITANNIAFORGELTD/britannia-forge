import React, { useState } from 'react';
import { Link } from 'wouter';
import { Header } from '@/components/navigation/header';
import { Footer } from '@/components/navigation/footer';
import { SEOHead } from '@/components/seo/seo-head';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Shield, Clock, Star, CheckCircle, Users, Award } from 'lucide-react';

export default function Home() {
  return (
    <div className="main-background">
      <SEOHead pageKey="home" />
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="britannia-heading text-5xl md:text-6xl font-bold mb-6">
            Professional Boiler Replacement
            <span className="block" style={{ color: 'var(--britannia-green)' }}>
              by Certified Engineers Across UK
            </span>
          </h1>
          <p className="britannia-body text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Get an instant quote in just a few clicks. Professional boiler replacement and swap services 
            across the UK without the hassle of home visits or parking fees.
          </p>
          <div className="flex justify-center">
            <a href="/quote" className="britannia-cta-button text-lg px-12 py-4">
              Get My Instant Quote
            </a>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="britannia-card text-center p-6">
              <Shield className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--britannia-green)' }} />
              <h3 className="britannia-heading text-lg font-semibold mb-2">Gas Safe Registered</h3>
              <p className="britannia-body text-gray-600">All our engineers are fully qualified and Gas Safe registered</p>
            </div>
            <div className="britannia-card text-center p-6">
              <Clock className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--britannia-green)' }} />
              <h3 className="britannia-heading text-lg font-semibold mb-2">24/7 Emergency</h3>
              <p className="britannia-body text-gray-600">Emergency call-out service available 24 hours a day</p>
            </div>
            <div className="britannia-card text-center p-6">
              <Star className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--britannia-green)' }} />
              <h3 className="britannia-heading text-lg font-semibold mb-2">5-Star Service</h3>
              <p className="britannia-body text-gray-600">Rated excellent by over 1,000 satisfied customers</p>
            </div>
            <div className="britannia-card text-center p-6">
              <Award className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--britannia-green)' }} />
              <h3 className="britannia-heading text-lg font-semibold mb-2">10 Year Guarantee</h3>
              <p className="britannia-body text-gray-600">Extended warranty on all boiler installations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="britannia-heading text-4xl font-bold mb-4">Our Services</h2>
            <p className="britannia-body text-xl text-gray-600">
              Professional heating solutions for your home
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="britannia-card p-8">
              <Flame className="w-16 h-16 mb-6" style={{ color: 'var(--forge-orange)' }} />
              <h3 className="britannia-heading text-2xl font-semibold mb-4">Boiler Installation</h3>
              <p className="britannia-body text-gray-600 mb-6">
                Professional installation of new boilers with full system upgrade. 
                All work guaranteed and completed by Gas Safe engineers.
              </p>
              <ul className="britannia-body text-gray-600 space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                  Same day installation available
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                  10-year manufacturer warranty
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                  Free system flush included
                </li>
              </ul>
            </div>

            <div className="britannia-card p-8">
              <Shield className="w-16 h-16 mb-6" style={{ color: 'var(--forge-orange)' }} />
              <h3 className="britannia-heading text-2xl font-semibold mb-4">Boiler Servicing</h3>
              <p className="britannia-body text-gray-600 mb-6">
                Annual boiler servicing to keep your system running efficiently 
                and safely. Essential for warranty validation.
              </p>
              <ul className="britannia-body text-gray-600 space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                  Comprehensive safety checks
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                  Efficiency optimization
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                  Gas safety certificate
                </li>
              </ul>
            </div>

            <div className="britannia-card p-8">
              <Clock className="w-16 h-16 mb-6" style={{ color: 'var(--forge-orange)' }} />
              <h3 className="britannia-heading text-2xl font-semibold mb-4">Emergency Repairs</h3>
              <p className="britannia-body text-gray-600 mb-6">
                24/7 emergency boiler repair service. Fast response times 
                and experienced engineers available around the clock.
              </p>
              <ul className="britannia-body text-gray-600 space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                  24/7 emergency call-out
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                  Fixed-price repairs
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                  No call-out charge
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="britannia-heading text-4xl font-bold mb-4">Why Choose Our Smart Quotation System?</h2>
            <p className="britannia-body text-xl text-gray-600">
              Save time and money - no travel costs, no parking fees, no quotation charges
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mr-6" 
                       style={{ backgroundColor: 'var(--britannia-green)' }}>
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="britannia-heading text-xl font-semibold mb-2">No Time Wasted</h3>
                    <p className="britannia-body text-gray-600">
                      Skip the hassle of arranging home visits, taking time off work, and dealing with 
                      parking issues. Get your fixed price quote instantly online.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mr-6" 
                       style={{ backgroundColor: 'var(--britannia-green)' }}>
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="britannia-heading text-xl font-semibold mb-2">Fixed Price Guarantee</h3>
                    <p className="britannia-body text-gray-600">
                      No surprises or hidden costs. Our intelligent system provides accurate quotes 
                      without expensive home visits or quotation fees.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mr-6" 
                       style={{ backgroundColor: 'var(--britannia-green)' }}>
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="britannia-heading text-xl font-semibold mb-2">UK-Wide Coverage</h3>
                    <p className="britannia-body text-gray-600">
                      Starting with London and expanding across the UK. Our Gas Safe registered engineers 
                      provide professional service wherever you are.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="britannia-card p-8 text-center">
              <div className="mb-6">
                <div className="text-6xl font-bold mb-2" style={{ color: 'var(--britannia-green)' }}>1000+</div>
                <p className="britannia-body text-gray-600">Happy Customers</p>
              </div>
              <div className="mb-6">
                <div className="text-6xl font-bold mb-2" style={{ color: 'var(--britannia-green)' }}>5★</div>
                <p className="britannia-body text-gray-600">Average Rating</p>
              </div>
              <div className="mb-8">
                <div className="text-6xl font-bold mb-2" style={{ color: 'var(--britannia-green)' }}>10</div>
                <p className="britannia-body text-gray-600">Years Experience</p>
              </div>
              <a href="/quote" className="britannia-cta-button w-full">
                Get Your Quote Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="britannia-heading text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="britannia-body text-xl text-gray-600 mb-8">
            Get your instant fixed-price quote today and join thousands of satisfied customers across the UK
          </p>
          <div className="flex justify-center">
            <a href="/quote" className="britannia-cta-button text-lg px-12 py-4">
              Get My Instant Quote
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
