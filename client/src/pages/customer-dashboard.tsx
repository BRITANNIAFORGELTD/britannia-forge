import React, { useState, useEffect } from 'react';
import { Header } from '@/components/navigation/header';
import { Footer } from '@/components/navigation/footer';
import { SEOHead } from '@/components/seo/seo-head';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Star, Calendar, MapPin, Phone, Mail, FileText, Camera, User, Wrench, MessageSquare, Plus, Clock, Shield, CheckCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';

interface Job {
  id: number;
  status: 'scheduled' | 'in_progress' | 'completed';
  installationDate: string;
  engineer: {
    name: string;
    photo: string;
    gasSafeNumber: string;
    phone: string;
    rating: number;
  };
  priceBreakdown: {
    totalPrice: number;
    components: Array<{
      name: string;
      price: number;
    }>;
  };
  photos: {
    customer: string[];
    beforeWork: string[];
    afterWork: string[];
  };
  documents: string[];
}

interface ServiceRequest {
  id: number;
  type: string;
  description: string;
  status: 'pending' | 'matched' | 'completed';
  submittedAt: string;
  photos: string[];
}

export default function CustomerDashboard() {
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const { user, isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access your dashboard.",
        variant: "destructive",
      });
      setLocation('/login');
    }
  }, [isAuthenticated, isLoading, setLocation, toast]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // Show nothing if not authenticated (will redirect)
  if (!isAuthenticated || !user) {
    return null;
  }

  // Mock data - replace with real API calls
  const jobs: Job[] = [
    {
      id: 1,
      status: 'scheduled',
      installationDate: '2025-01-20',
      engineer: {
        name: 'James Mitchell',
        photo: '/api/placeholder/64/64',
        gasSafeNumber: 'GS123456',
        phone: '07700 900123',
        rating: 4.8
      },
      priceBreakdown: {
        totalPrice: 2650,
        components: [
          { name: 'Worcester Bosch Greenstar 8000 Life 30kW', price: 1800 },
          { name: 'Labour & Installation', price: 650 },
          { name: 'Flue Extension (2m)', price: 120 },
          { name: 'VAT (20%)', price: 514 }
        ]
      },
      photos: {
        customer: ['/api/placeholder/200/200', '/api/placeholder/200/200'],
        beforeWork: [],
        afterWork: []
      },
      documents: []
    }
  ];

  const serviceRequests: ServiceRequest[] = [
    {
      id: 1,
      type: 'Plumbing',
      description: 'Kitchen tap leaking, needs urgent repair',
      status: 'pending',
      submittedAt: '2025-01-15',
      photos: ['/api/placeholder/200/200']
    }
  ];

  const handleReviewSubmit = () => {
    // Submit review API call
    console.log('Review submitted:', { rating: reviewRating, text: reviewText });
  };

  const renderStars = (rating: number, onRate?: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} ${onRate ? 'cursor-pointer' : ''}`}
        onClick={() => onRate?.(i + 1)}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead pageKey="customer-dashboard" />
      <Header />
      
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="mb-4 sm:mb-8">
          <h1 className="britannia-heading text-2xl sm:text-3xl font-bold mb-2">My Dashboard</h1>
          <p className="britannia-body text-sm sm:text-base text-gray-600">Manage your boiler installations and service requests</p>
        </div>

        <Tabs defaultValue="jobs" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1 h-auto p-1">
            <TabsTrigger value="jobs" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
              <span className="truncate">My Jobs</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
              <span className="truncate">Services</span>
            </TabsTrigger>
            <TabsTrigger value="photos" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
              <span className="truncate">Photos</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
              <span className="truncate">Account</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="jobs">
            <div className="space-y-6">
              {jobs.map((job) => (
                <Card key={job.id} className="britannia-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="britannia-heading text-lg sm:text-xl">Boiler Installation #{job.id}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-2 text-xs sm:text-sm">
                          <Calendar className="w-4 h-4" />
                          Scheduled: {new Date(job.installationDate).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge variant={job.status === 'completed' ? 'default' : 'secondary'}>
                        {job.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      {/* Engineer Info */}
                      <div className="space-y-3 sm:space-y-4">
                        <h3 className="britannia-heading font-semibold text-sm sm:text-base">Assigned Engineer</h3>
                        <div className="flex items-center gap-3">
                          <img 
                            src={job.engineer.photo} 
                            alt={job.engineer.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <p className="britannia-body font-medium text-sm sm:text-base">{job.engineer.name}</p>
                            <p className="britannia-body text-xs sm:text-sm text-gray-600">Gas Safe: {job.engineer.gasSafeNumber}</p>
                            <div className="flex items-center gap-1">
                              {renderStars(Math.floor(job.engineer.rating))}
                              <span className="britannia-body text-xs sm:text-sm text-gray-600">({job.engineer.rating})</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                          <Phone className="w-4 h-4" />
                          {job.engineer.phone}
                        </div>
                      </div>

                      {/* Price Breakdown */}
                      <div className="space-y-3 sm:space-y-4">
                        <h3 className="britannia-heading font-semibold text-sm sm:text-base">Price Breakdown</h3>
                        <div className="space-y-2">
                          {job.priceBreakdown.components.map((item, index) => (
                            <div key={index} className="flex justify-between text-xs sm:text-sm gap-2">
                              <span className="britannia-body truncate">{item.name}</span>
                              <span className="britannia-body flex-shrink-0">£{item.price}</span>
                            </div>
                          ))}
                          <div className="border-t pt-2">
                            <div className="flex justify-between font-semibold text-xs sm:text-sm">
                              <span className="britannia-body">Total Paid</span>
                              <span className="britannia-body">£{job.priceBreakdown.totalPrice}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <Button 
                        variant="outline" 
                        onClick={() => setSelectedJob(job)}
                        className="flex items-center gap-2 text-xs sm:text-sm w-full sm:w-auto"
                      >
                        <FileText className="w-4 h-4" />
                        View Details
                      </Button>
                      
                      {job.status === 'completed' && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="britannia-cta-button flex items-center gap-2 text-xs sm:text-sm w-full sm:w-auto">
                              <Star className="w-4 h-4" />
                              Leave Review
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Leave a Review</DialogTitle>
                              <DialogDescription>
                                Rate your experience with {job.engineer.name}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <label className="britannia-body text-sm font-medium mb-2 block">Rating</label>
                                <div className="flex gap-1">
                                  {renderStars(reviewRating, setReviewRating)}
                                </div>
                              </div>
                              <div>
                                <label className="britannia-body text-sm font-medium mb-2 block">Review</label>
                                <Textarea
                                  value={reviewText}
                                  onChange={(e) => setReviewText(e.target.value)}
                                  placeholder="Share your experience..."
                                  rows={4}
                                />
                              </div>
                              <Button onClick={handleReviewSubmit} className="britannia-cta-button w-full">
                                Submit Review
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="services">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                <h2 className="britannia-heading text-xl sm:text-2xl font-bold">Service Requests</h2>
                <Button className="britannia-cta-button flex items-center gap-2 text-xs sm:text-sm">
                  <Plus className="w-4 h-4" />
                  New Request
                </Button>
              </div>
              
              {serviceRequests.map((request) => (
                <Card key={request.id} className="britannia-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="britannia-heading text-base sm:text-lg">{request.type} Service</CardTitle>
                        <CardDescription className="britannia-body mt-1 text-xs sm:text-sm">
                          Submitted: {new Date(request.submittedAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge variant={request.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                        {request.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="britannia-body text-gray-700 mb-4 text-sm sm:text-base">{request.description}</p>
                    <div className="flex gap-2 flex-wrap">
                      {request.photos.map((photo, index) => (
                        <img 
                          key={index}
                          src={photo} 
                          alt={`Service request ${index + 1}`}
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="photos">
            <div className="space-y-4 sm:space-y-6">
              <h2 className="britannia-heading text-xl sm:text-2xl font-bold">Photo Archive</h2>
              
              {jobs.map((job) => (
                <Card key={job.id} className="britannia-card">
                  <CardHeader>
                    <CardTitle className="britannia-heading text-base sm:text-lg">Job #{job.id} Photos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 sm:space-y-6">
                      <div>
                        <h4 className="britannia-body font-semibold mb-3 text-sm sm:text-base">Customer Submitted Photos</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
                          {job.photos.customer.map((photo, index) => (
                            <img 
                              key={index}
                              src={photo} 
                              alt={`Customer photo ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
                            />
                          ))}
                        </div>
                      </div>
                      
                      {job.photos.beforeWork.length > 0 && (
                        <div>
                          <h4 className="britannia-body font-semibold mb-3">Before Work Photos</h4>
                          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                            {job.photos.beforeWork.map((photo, index) => (
                              <img 
                                key={index}
                                src={photo} 
                                alt={`Before work ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {job.photos.afterWork.length > 0 && (
                        <div>
                          <h4 className="britannia-body font-semibold mb-3">After Work Photos</h4>
                          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                            {job.photos.afterWork.map((photo, index) => (
                              <img 
                                key={index}
                                src={photo} 
                                alt={`After work ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="account">
            <Card className="britannia-card">
              <CardHeader>
                <CardTitle className="britannia-heading text-2xl">Account Settings</CardTitle>
                <CardDescription className="britannia-body">Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="britannia-heading font-semibold mb-3">Support</h3>
                    <p className="britannia-body text-gray-600 mb-4">
                      Need help? Submit a support ticket and we'll respond within 3 hours.
                    </p>
                    <Button className="britannia-cta-button">Submit Support Ticket</Button>
                  </div>
                  
                  <div>
                    <h3 className="britannia-heading font-semibold mb-3">Contact Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span className="britannia-body">info@britanniaforge.co.uk</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className="britannia-body">Support tickets: 3-hour response guarantee</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
}