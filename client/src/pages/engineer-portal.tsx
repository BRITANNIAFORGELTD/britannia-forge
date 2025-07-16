import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Header } from '@/components/navigation/header';
import { Footer } from '@/components/navigation/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { SEOHead } from '@/components/seo/seo-head';
import { 
  MapPin, 
  Clock, 
  PoundSterling, 
  User, 
  Phone, 
  Mail, 
  Star,
  Eye,
  CreditCard,
  Filter,
  Search,
  Briefcase,
  Shield,
  CheckCircle,
  AlertCircle,
  Calendar
} from 'lucide-react';

interface ServiceLead {
  id: string;
  serviceType: string;
  serviceName: string;
  serviceIcon: string;
  description: string;
  urgency: 'low' | 'medium' | 'high';
  postcode: string;
  createdAt: string;
  leadPrice: number;
  isPurchased: boolean;
  customerDetails?: {
    name: string;
    email: string;
    phone: string;
    fullAddress: string;
  };
}

const urgencyColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800'
};

const urgencyLabels = {
  low: 'Low Priority - Within 1 week',
  medium: 'Medium Priority - Within 2-3 days',
  high: 'High Priority - Within 24 hours'
};

export default function EngineerPortal() {
  const [selectedService, setSelectedService] = useState<string>('all');
  const [postcodeFilter, setPostcodeFilter] = useState('');
  const [showPurchasedOnly, setShowPurchasedOnly] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch available leads
  const { data: leads = [], isLoading } = useQuery<ServiceLead[]>({
    queryKey: ['/api/engineer/leads', selectedService, postcodeFilter, showPurchasedOnly],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Purchase lead mutation
  const purchaseLeadMutation = useMutation({
    mutationFn: async (leadId: string) => {
      return await apiRequest('POST', `/api/engineer/purchase-lead/${leadId}`);
    },
    onSuccess: (data, leadId) => {
      toast({
        title: "Lead Purchased Successfully",
        description: "Customer contact details are now available",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/engineer/leads'] });
    },
    onError: (error) => {
      toast({
        title: "Purchase Failed",
        description: "Failed to purchase lead. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handlePurchaseLead = async (leadId: string) => {
    if (confirm("Purchase this lead for £15? Customer contact details will be revealed.")) {
      purchaseLeadMutation.mutate(leadId);
    }
  };

  const filteredLeads = leads.filter(lead => {
    if (selectedService !== 'all' && lead.serviceType !== selectedService) return false;
    if (postcodeFilter && !lead.postcode.toLowerCase().includes(postcodeFilter.toLowerCase())) return false;
    if (showPurchasedOnly && !lead.isPurchased) return false;
    return true;
  });

  const availableServices = [
    { id: 'all', name: 'All Services', icon: '🔧' },
    { id: 'electrician', name: 'Electrician', icon: '⚡' },
    { id: 'plumber', name: 'Plumber', icon: '🔧' },
    { id: 'gardener', name: 'Gardener', icon: '🌱' },
    { id: 'decorator', name: 'Decorator', icon: '🎨' },
    { id: 'handyman', name: 'Handyman', icon: '🔨' },
    { id: 'gas-engineer', name: 'Gas Engineer', icon: '🔥' },
    { id: 'boiler-repair', name: 'Boiler Repair', icon: '🔥' },
    { id: 'landlord-certificate', name: 'Landlord Certificate', icon: '📋' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead pageKey="engineer-portal" />
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="britannia-heading text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Engineer Portal</h1>
          <p className="britannia-body text-base sm:text-lg text-gray-600">
            Browse and purchase service leads in your area
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Filter className="w-5 h-5" />
              Filter Leads
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="service-filter" className="text-sm font-medium text-gray-700">Service Type</Label>
                <select
                  id="service-filter"
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-md text-sm sm:text-base"
                >
                  {availableServices.map(service => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="postcode-filter" className="text-sm font-medium text-gray-700">Postcode Area</Label>
                <Input
                  id="postcode-filter"
                  value={postcodeFilter}
                  onChange={(e) => setPostcodeFilter(e.target.value)}
                  placeholder="e.g., SW1, EC1"
                  className="w-full"
                />
              </div>
              
              <div className="flex flex-col justify-end space-y-2">
                <Label className="text-sm font-medium text-gray-700 sm:hidden">Filter Options</Label>
                <Button
                  variant={showPurchasedOnly ? "default" : "outline"}
                  onClick={() => setShowPurchasedOnly(!showPurchasedOnly)}
                  className="w-full py-2 sm:py-3 text-sm sm:text-base"
                >
                  {showPurchasedOnly ? 'Show All' : 'My Purchased Leads'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 truncate">Available Leads</p>
                  <p className="text-lg sm:text-2xl font-bold">{filteredLeads.filter(l => !l.isPurchased).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 truncate">Purchased</p>
                  <p className="text-lg sm:text-2xl font-bold">{filteredLeads.filter(l => l.isPurchased).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 truncate">High Priority</p>
                  <p className="text-lg sm:text-2xl font-bold">{filteredLeads.filter(l => l.urgency === 'high').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2">
                <PoundSterling className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 truncate">Lead Price</p>
                  <p className="text-lg sm:text-2xl font-bold">£15</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leads List */}
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading leads...</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No leads found</h3>
              <p className="text-gray-600">Try adjusting your filters or check back later for new leads</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredLeads.map((lead) => (
              <Card key={lead.id} className={`${lead.isPurchased ? 'bg-green-50 border-green-200' : 'bg-white'}`}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-xl sm:text-2xl flex-shrink-0">{lead.serviceIcon}</div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-base sm:text-lg truncate">{lead.serviceName}</h3>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span>{lead.postcode}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <Badge className={`${urgencyColors[lead.urgency]} text-xs`}>
                          <Clock className="w-3 h-3 mr-1" />
                          {urgencyLabels[lead.urgency]}
                        </Badge>
                        {lead.isPurchased && (
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Purchased
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-gray-700 mb-4 text-sm sm:text-base">{lead.description}</p>
                      
                      {lead.isPurchased && lead.customerDetails && (
                        <div className="bg-white p-3 sm:p-4 rounded-lg border border-green-200">
                          <h4 className="font-semibold mb-2 text-green-800 text-sm sm:text-base">Customer Details</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                            <div className="flex items-center gap-2">
                              <User className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span className="truncate">{lead.customerDetails.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span className="truncate">{lead.customerDetails.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span className="truncate">{lead.customerDetails.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span className="truncate">{lead.customerDetails.fullAddress}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-shrink-0 w-full sm:w-auto sm:ml-4 sm:text-right">
                      {!lead.isPurchased ? (
                        <Button
                          onClick={() => handlePurchaseLead(lead.id)}
                          disabled={purchaseLeadMutation.isPending}
                          className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white text-sm sm:text-base py-2 sm:py-3"
                        >
                          <CreditCard className="w-4 h-4 mr-2" />
                          Purchase for £{lead.leadPrice}
                        </Button>
                      ) : (
                        <div className="flex items-center justify-center sm:justify-end gap-2 text-green-600 text-sm sm:text-base">
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span className="font-semibold">Purchased</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}