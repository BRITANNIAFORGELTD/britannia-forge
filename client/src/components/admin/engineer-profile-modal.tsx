import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Award, 
  Shield, 
  FileText, 
  Camera, 
  Star, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Upload,
  Calendar,
  Building,
  CreditCard,
  Briefcase,
  Wrench,
  Zap,
  Droplets,
  Paintbrush,
  Hammer
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface EngineerProfileModalProps {
  engineer: any;
  isOpen: boolean;
  onClose: () => void;
}

export function EngineerProfileModal({ engineer, isOpen, onClose }: EngineerProfileModalProps) {
  const [verificationNotes, setVerificationNotes] = useState(engineer?.verificationNotes || '');
  const [documentsRequired, setDocumentsRequired] = useState(engineer?.documentsRequired?.join(', ') || '');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateEngineerMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return apiRequest('PUT', `/api/admin/engineers/${id}`, data);
    },
    onSuccess: () => {
      toast({
        title: 'Engineer updated',
        description: 'Engineer status has been updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/engineers'] });
      onClose();
    },
    onError: () => {
      toast({
        title: 'Update failed',
        description: 'Failed to update engineer status',
        variant: 'destructive',
      });
    },
  });

  const handleStatusUpdate = (newStatus: string) => {
    updateEngineerMutation.mutate({
      id: engineer.id.toString(),
      data: { 
        status: newStatus,
        verificationNotes,
        documentsRequired: documentsRequired.split(',')?.map((d: string) => d.trim()).filter((d: string) => d.length > 0)
      }
    });
  };

  const getServiceIcon = (service: string) => {
    switch (service.toLowerCase()) {
      case 'heating': return Wrench;
      case 'electrical': return Zap;
      case 'plumbing': return Droplets;
      case 'decoration': return Paintbrush;
      case 'handyman': return Hammer;
      default: return Briefcase;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-500/20 text-green-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'suspended': return 'bg-orange-500/20 text-orange-400';
      case 'rejected': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return `£${(amount / 100).toFixed(2)}`;
  };

  if (!engineer) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center space-x-3">
            <div className="relative">
              {engineer.profilePhotoUrl ? (
                <img 
                  src={engineer.profilePhotoUrl} 
                  alt={engineer.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center">
                  <User className="h-6 w-6 text-slate-400" />
                </div>
              )}
              <Badge className={`absolute -top-1 -right-1 ${getStatusColor(engineer.status)}`}>
                {engineer.status}
              </Badge>
            </div>
            <div>
              <h2 className="text-xl font-bold">{engineer.name}</h2>
              <p className="text-slate-400 text-sm">{engineer.businessName || 'Individual Contractor'}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800">
            <TabsTrigger value="overview" className="text-white">Overview</TabsTrigger>
            <TabsTrigger value="documents" className="text-white">Documents</TabsTrigger>
            <TabsTrigger value="portfolio" className="text-white">Portfolio</TabsTrigger>
            <TabsTrigger value="business" className="text-white">Business</TabsTrigger>
            <TabsTrigger value="verification" className="text-white">Verification</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span className="text-white">{engineer.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span className="text-white">{engineer.phone || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span className="text-white">{engineer.postcode || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span className="text-white">Joined {formatDate(engineer.createdAt)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Briefcase className="h-5 w-5 mr-2" />
                    Professional Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-slate-400" />
                    <span className="text-white">{engineer.experienceYears || 0} years experience</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span className="text-white">{formatCurrency(engineer.hourlyRate || 0)}/hour</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="text-white">{engineer.rating || '0.00'} rating</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-white">{engineer.completedJobs || 0} jobs completed</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white">Services Offered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {engineer.serviceTypes?.map((service: string, index: number) => {
                    const IconComponent = getServiceIcon(service);
                    return (
                      <Badge key={index} variant="outline" className="text-white border-slate-600">
                        <IconComponent className="h-3 w-3 mr-1" />
                        {service}
                      </Badge>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white">About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">{engineer.about || 'No description provided'}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Identification
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {engineer.idDocumentUrl ? (
                    <div className="space-y-2">
                      <img 
                        src={engineer.idDocumentUrl} 
                        alt="ID Document"
                        className="w-full h-32 object-cover rounded border border-slate-600"
                      />
                      <Button size="sm" variant="outline" className="w-full">
                        <FileText className="h-4 w-4 mr-2" />
                        View Full Document
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-400">
                      <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No ID document uploaded</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Insurance Certificate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {engineer.insuranceDocumentUrl ? (
                    <div className="space-y-2">
                      <img 
                        src={engineer.insuranceDocumentUrl} 
                        alt="Insurance Certificate"
                        className="w-full h-32 object-cover rounded border border-slate-600"
                      />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-300">Coverage: {formatCurrency(engineer.liabilityInsurance || 0)}</span>
                        <span className="text-slate-300">Expires: {engineer.insuranceExpiryDate ? formatDate(engineer.insuranceExpiryDate) : 'Unknown'}</span>
                      </div>
                      <Button size="sm" variant="outline" className="w-full">
                        <Shield className="h-4 w-4 mr-2" />
                        View Certificate
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-400">
                      <Shield className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No insurance certificate uploaded</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Qualifications & Certificates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {engineer.gasSafeNumber && (
                    <div className="p-3 bg-slate-800 rounded border border-slate-600">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">Gas Safe Registration</span>
                        <Badge variant="outline" className="text-green-400 border-green-400">
                          {engineer.gasSafeNumber}
                        </Badge>
                      </div>
                    </div>
                  )}
                  
                  {engineer.electricalQualification && (
                    <div className="p-3 bg-slate-800 rounded border border-slate-600">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">Electrical Qualification</span>
                        <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                          {engineer.electricalQualification}
                        </Badge>
                      </div>
                    </div>
                  )}

                  {engineer.plumbingQualification && (
                    <div className="p-3 bg-slate-800 rounded border border-slate-600">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">Plumbing Qualification</span>
                        <Badge variant="outline" className="text-blue-400 border-blue-400">
                          {engineer.plumbingQualification}
                        </Badge>
                      </div>
                    </div>
                  )}

                  {engineer.certificateUrls?.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {engineer.certificateUrls?.map((url: string, index: number) => (
                        <img 
                          key={index}
                          src={url} 
                          alt={`Certificate ${index + 1}`}
                          className="w-full h-24 object-cover rounded border border-slate-600 cursor-pointer hover:opacity-80"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Camera className="h-5 w-5 mr-2" />
                  Work Portfolio
                </CardTitle>
              </CardHeader>
              <CardContent>
                {engineer.portfolioUrls?.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {engineer.portfolioUrls?.map((url: string, index: number) => (
                      <img 
                        key={index}
                        src={url} 
                        alt={`Portfolio ${index + 1}`}
                        className="w-full h-32 object-cover rounded border border-slate-600 cursor-pointer hover:opacity-80"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400">
                    <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>No portfolio images uploaded</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="business" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Building className="h-5 w-5 mr-2" />
                    Business Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-slate-400">Business Name</Label>
                    <p className="text-white">{engineer.businessName || 'Individual Contractor'}</p>
                  </div>
                  <div>
                    <Label className="text-slate-400">Registration Number</Label>
                    <p className="text-white">{engineer.businessRegistrationNumber || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-slate-400">VAT Number</Label>
                    <p className="text-white">{engineer.vatNumber || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-slate-400">Service Radius</Label>
                    <p className="text-white">{engineer.serviceRadius || 10} miles</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Banking Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-slate-400">Sort Code</Label>
                    <p className="text-white font-mono">{engineer.bankSortCode || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-slate-400">Account Number</Label>
                    <p className="text-white font-mono">
                      {engineer.bankAccountNumber ? 
                        `****${engineer.bankAccountNumber.slice(-4)}` : 
                        'Not provided'
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="verification" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Verification Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-slate-400">Verification Notes</Label>
                  <Textarea
                    value={verificationNotes}
                    onChange={(e) => setVerificationNotes(e.target.value)}
                    placeholder="Add notes about verification process..."
                    className="bg-slate-800 border-slate-600 text-white mt-2"
                  />
                </div>

                <div>
                  <Label className="text-slate-400">Required Documents</Label>
                  <Input
                    value={documentsRequired}
                    onChange={(e) => setDocumentsRequired(e.target.value)}
                    placeholder="e.g., Insurance certificate, Gas Safe certificate"
                    className="bg-slate-800 border-slate-600 text-white mt-2"
                  />
                  <p className="text-xs text-slate-500 mt-1">Comma-separated list of required documents</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => handleStatusUpdate('verified')}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Verify Engineer
                  </Button>
                  
                  <Button
                    onClick={() => handleStatusUpdate('suspended')}
                    variant="outline"
                    className="border-orange-500 text-orange-400 hover:bg-orange-500/10"
                  >
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Suspend
                  </Button>
                  
                  <Button
                    onClick={() => handleStatusUpdate('rejected')}
                    variant="outline"
                    className="border-red-500 text-red-400 hover:bg-red-500/10"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  
                  <Button
                    onClick={() => handleStatusUpdate('pending')}
                    variant="outline"
                    className="border-yellow-500 text-yellow-400 hover:bg-yellow-500/10"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Request Documents
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}