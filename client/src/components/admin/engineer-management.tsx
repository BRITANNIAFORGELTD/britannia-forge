import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, XCircle, AlertCircle, User, Shield, FileText, Phone, Mail, MapPin, Star, Wrench, Clock, Pause, Play } from 'lucide-react';

interface Engineer {
  id: number;
  name: string;
  email: string;
  phone: string;
  gasSafeNumber: string;
  status: 'pending' | 'active' | 'suspended' | 'rejected';
  rating: number;
  completedJobs: number;
  joinDate: string;
  specialties: string[];
  documents: {
    gasSafeCertificate: string;
    insurance: string;
    photo: string;
  };
  lastActivity: string;
}

interface PendingApplication {
  id: number;
  name: string;
  email: string;
  phone: string;
  gasSafeNumber: string;
  yearsExperience: number;
  specialties: string[];
  submittedAt: string;
  documents: {
    gasSafeCertificate: string;
    insurance: string;
    photo: string;
    qualifications: string[];
  };
}

export function EngineerManagement() {
  const [activeTab, setActiveTab] = useState('roster');
  const [selectedEngineer, setSelectedEngineer] = useState<Engineer | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<PendingApplication | null>(null);

  // Mock data - replace with real API calls
  const pendingApplications: PendingApplication[] = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '07700 900123',
      gasSafeNumber: 'GS123456',
      yearsExperience: 5,
      specialties: ['Boiler Installation', 'Gas Safety'],
      submittedAt: '2025-01-15T10:00:00Z',
      documents: {
        gasSafeCertificate: '/documents/gas-safe-123.pdf',
        insurance: '/documents/insurance-123.pdf',
        photo: '/api/placeholder/100/100',
        qualifications: ['/documents/qual-1.pdf', '/documents/qual-2.pdf']
      }
    }
  ];

  const activeEngineers: Engineer[] = [
    {
      id: 1,
      name: 'James Mitchell',
      email: 'james.mitchell@email.com',
      phone: '07700 900124',
      gasSafeNumber: 'GS234567',
      status: 'active',
      rating: 4.8,
      completedJobs: 142,
      joinDate: '2024-03-15',
      specialties: ['Boiler Installation', 'Gas Safety', 'Plumbing'],
      documents: {
        gasSafeCertificate: '/documents/gas-safe-234.pdf',
        insurance: '/documents/insurance-234.pdf',
        photo: '/api/placeholder/100/100'
      },
      lastActivity: '2025-01-15T14:30:00Z'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '07700 900125',
      gasSafeNumber: 'GS345678',
      status: 'suspended',
      rating: 4.2,
      completedJobs: 89,
      joinDate: '2024-06-20',
      specialties: ['Electrical', 'Plumbing'],
      documents: {
        gasSafeCertificate: '/documents/gas-safe-345.pdf',
        insurance: '/documents/insurance-345.pdf',
        photo: '/api/placeholder/100/100'
      },
      lastActivity: '2025-01-10T09:15:00Z'
    }
  ];

  const handleApproveApplication = (applicationId: number) => {
    console.log('Approving application:', applicationId);
    // API call to approve application
  };

  const handleRejectApplication = (applicationId: number, reason: string) => {
    console.log('Rejecting application:', applicationId, 'Reason:', reason);
    // API call to reject application
  };

  const handleSuspendEngineer = (engineerId: number, reason: string) => {
    console.log('Suspending engineer:', engineerId, 'Reason:', reason);
    // API call to suspend engineer
  };

  const handleReactivateEngineer = (engineerId: number) => {
    console.log('Reactivating engineer:', engineerId);
    // API call to reactivate engineer
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    active: 'bg-green-100 text-green-800',
    suspended: 'bg-red-100 text-red-800',
    rejected: 'bg-gray-100 text-gray-800'
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Engineer Management</h2>
          <p className="text-slate-300">Manage engineer applications and roster</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            {pendingApplications.length} pending
          </Badge>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            {activeEngineers.filter(e => e.status === 'active').length} active
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="applications">Pending Applications</TabsTrigger>
          <TabsTrigger value="roster">Engineer Roster</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="applications">
          <Card className="britannia-admin-card">
            <CardHeader>
              <CardTitle className="text-xl">Pending Applications</CardTitle>
              <CardDescription>Review and approve new engineer applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingApplications?.map((application: any) => (
                  <Card key={application.id} className="border">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img 
                            src={application.documents.photo} 
                            alt={application.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <h3 className="font-semibold">{application.name}</h3>
                            <p className="text-sm text-gray-600">Gas Safe: {application.gasSafeNumber}</p>
                          </div>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm"><strong>Email:</strong> {application.email}</p>
                          <p className="text-sm"><strong>Phone:</strong> {application.phone}</p>
                          <p className="text-sm"><strong>Experience:</strong> {application.yearsExperience} years</p>
                        </div>
                        <div>
                          <p className="text-sm"><strong>Submitted:</strong> {new Date(application.submittedAt).toLocaleDateString()}</p>
                          <p className="text-sm"><strong>Specialties:</strong></p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {application.specialties?.map((specialty: any) => (
                              <Badge key={specialty} variant="outline" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mb-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedApplication(application)}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          View Documents
                        </Button>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApproveApplication(application.id)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Reject Application</DialogTitle>
                              <DialogDescription>
                                Please provide a reason for rejecting this application
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <Textarea
                                placeholder="Reason for rejection..."
                                rows={4}
                              />
                              <div className="flex justify-end gap-2">
                                <Button variant="outline">Cancel</Button>
                                <Button 
                                  variant="destructive"
                                  onClick={() => handleRejectApplication(application.id, 'Rejection reason')}
                                >
                                  Reject Application
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roster">
          <Card className="britannia-admin-card">
            <CardHeader>
              <CardTitle className="text-xl">Engineer Roster</CardTitle>
              <CardDescription>Manage active engineers and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Engineer</TableHead>
                    <TableHead>Gas Safe</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Jobs</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeEngineers?.map((engineer: any) => (
                    <TableRow key={engineer.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img 
                            src={engineer.documents.photo} 
                            alt={engineer.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium">{engineer.name}</p>
                            <p className="text-sm text-gray-600">{engineer.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{engineer.gasSafeNumber}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[engineer.status]}>
                          {engineer.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {renderStars(Math.floor(engineer.rating))}
                          <span className="text-sm text-gray-600">({engineer.rating})</span>
                        </div>
                      </TableCell>
                      <TableCell>{engineer.completedJobs}</TableCell>
                      <TableCell>
                        {new Date(engineer.lastActivity).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedEngineer(engineer)}
                          >
                            <User className="w-4 h-4" />
                          </Button>
                          {engineer.status === 'active' ? (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="destructive">
                                  <Pause className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Suspend Engineer</DialogTitle>
                                  <DialogDescription>
                                    Please provide a reason for suspending this engineer
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <Textarea
                                    placeholder="Reason for suspension..."
                                    rows={4}
                                  />
                                  <div className="flex justify-end gap-2">
                                    <Button variant="outline">Cancel</Button>
                                    <Button 
                                      variant="destructive"
                                      onClick={() => handleSuspendEngineer(engineer.id, 'Suspension reason')}
                                    >
                                      Suspend Engineer
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleReactivateEngineer(engineer.id)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Play className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card className="britannia-admin-card">
            <CardHeader>
              <CardTitle className="text-xl">Performance Overview</CardTitle>
              <CardDescription>Monitor engineer performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-green-800">Top Performers</h3>
                  </div>
                  <div className="space-y-2">
                    {activeEngineers
                      .filter(e => e.status === 'active')
                      .sort((a, b) => b.rating - a.rating)
                      .slice(0, 3)
                      ?.map((engineer: any) => (
                        <div key={engineer.id} className="flex items-center justify-between">
                          <span className="text-sm">{engineer.name}</span>
                          <span className="text-sm font-medium">{engineer.rating}★</span>
                        </div>
                      ))}
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Wrench className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-800">Most Active</h3>
                  </div>
                  <div className="space-y-2">
                    {activeEngineers
                      .filter(e => e.status === 'active')
                      .sort((a, b) => b.completedJobs - a.completedJobs)
                      .slice(0, 3)
                      ?.map((engineer: any) => (
                        <div key={engineer.id} className="flex items-center justify-between">
                          <span className="text-sm">{engineer.name}</span>
                          <span className="text-sm font-medium">{engineer.completedJobs} jobs</span>
                        </div>
                      ))}
                  </div>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <h3 className="font-semibold text-yellow-800">Needs Attention</h3>
                  </div>
                  <div className="space-y-2">
                    {activeEngineers
                      .filter(e => e.status === 'suspended' || e.rating < 4.0)
                      ?.map((engineer: any) => (
                        <div key={engineer.id} className="flex items-center justify-between">
                          <span className="text-sm">{engineer.name}</span>
                          <Badge className={statusColors[engineer.status]}>
                            {engineer.status}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Engineer Detail Modal */}
      {selectedEngineer && (
        <Dialog open={!!selectedEngineer} onOpenChange={() => setSelectedEngineer(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Engineer Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img 
                  src={selectedEngineer.documents.photo} 
                  alt={selectedEngineer.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-xl font-semibold">{selectedEngineer.name}</h3>
                  <p className="text-gray-600">Gas Safe: {selectedEngineer.gasSafeNumber}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {renderStars(Math.floor(selectedEngineer.rating))}
                    <span className="text-sm text-gray-600">({selectedEngineer.rating})</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm"><strong>Email:</strong> {selectedEngineer.email}</p>
                  <p className="text-sm"><strong>Phone:</strong> {selectedEngineer.phone}</p>
                  <p className="text-sm"><strong>Completed Jobs:</strong> {selectedEngineer.completedJobs}</p>
                </div>
                <div>
                  <p className="text-sm"><strong>Join Date:</strong> {new Date(selectedEngineer.joinDate).toLocaleDateString()}</p>
                  <p className="text-sm"><strong>Last Active:</strong> {new Date(selectedEngineer.lastActivity).toLocaleDateString()}</p>
                  <p className="text-sm"><strong>Status:</strong> 
                    <Badge className={`${statusColors[selectedEngineer.status]} ml-2`}>
                      {selectedEngineer.status}
                    </Badge>
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Specialties:</p>
                <div className="flex flex-wrap gap-1">
                  {selectedEngineer.specialties?.map((specialty: any) => (
                    <Badge key={specialty} variant="outline">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}