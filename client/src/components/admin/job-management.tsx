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
import { Calendar, Clock, MapPin, Phone, Mail, User, Wrench, AlertTriangle, CheckCircle, XCircle, FileText, Camera, MessageSquare } from 'lucide-react';

interface Job {
  id: number;
  type: 'installation' | 'service';
  serviceType: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  engineer?: {
    name: string;
    phone: string;
    gasSafeNumber: string;
  };
  status: 'new' | 'assigned' | 'in_progress' | 'completed' | 'disputed';
  urgency: 'low' | 'medium' | 'high';
  scheduledDate?: string;
  completedDate?: string;
  description: string;
  photos: string[];
  documents: string[];
  priceQuote?: number;
  finalPrice?: number;
  dispute?: {
    reason: string;
    submittedBy: 'customer' | 'engineer';
    submittedAt: string;
    status: 'open' | 'resolved';
  };
}

interface SupportTicket {
  id: number;
  customerName: string;
  email: string;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved';
  submittedAt: string;
  assignedTo?: string;
  responses: {
    from: string;
    message: string;
    timestamp: string;
  }[];
}

export function JobManagement() {
  const [activeTab, setActiveTab] = useState('jobs');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [ticketResponse, setTicketResponse] = useState('');

  // Mock data - replace with real API calls
  const jobs: Job[] = [
    {
      id: 1,
      type: 'installation',
      serviceType: 'Boiler Installation',
      customer: {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '07700 900123',
        address: '123 Oak Street, London SW1A 1AA'
      },
      engineer: {
        name: 'James Mitchell',
        phone: '07700 900124',
        gasSafeNumber: 'GS234567'
      },
      status: 'in_progress',
      urgency: 'medium',
      scheduledDate: '2025-01-20T10:00:00Z',
      description: 'Replace old boiler with new Worcester Bosch combi boiler',
      photos: ['/api/placeholder/200/150', '/api/placeholder/200/150'],
      documents: [],
      priceQuote: 2650
    },
    {
      id: 2,
      type: 'service',
      serviceType: 'Emergency Plumbing',
      customer: {
        name: 'David Wilson',
        email: 'david.wilson@email.com',
        phone: '07700 900125',
        address: '456 High Street, London E1 6AN'
      },
      status: 'disputed',
      urgency: 'high',
      completedDate: '2025-01-15T16:00:00Z',
      description: 'Kitchen tap repair - customer claims job was incomplete',
      photos: ['/api/placeholder/200/150'],
      documents: [],
      finalPrice: 120,
      dispute: {
        reason: 'Job marked complete but tap still leaking',
        submittedBy: 'customer',
        submittedAt: '2025-01-16T09:00:00Z',
        status: 'open'
      }
    }
  ];

  const supportTickets: SupportTicket[] = [
    {
      id: 1,
      customerName: 'Emma Thompson',
      email: 'emma.thompson@email.com',
      subject: 'Booking confirmation not received',
      message: 'I completed my boiler installation booking yesterday but haven\'t received confirmation email.',
      priority: 'medium',
      status: 'open',
      submittedAt: '2025-01-15T14:30:00Z',
      responses: []
    },
    {
      id: 2,
      customerName: 'Michael Brown',
      email: 'michael.brown@email.com',
      subject: 'Engineer contact issue',
      message: 'My assigned engineer hasn\'t responded to my calls for 2 days.',
      priority: 'high',
      status: 'in_progress',
      submittedAt: '2025-01-14T11:00:00Z',
      assignedTo: 'Admin Support',
      responses: [
        {
          from: 'Admin Support',
          message: 'We\'ve contacted the engineer and they will call you within 2 hours.',
          timestamp: '2025-01-14T13:00:00Z'
        }
      ]
    }
  ];

  const handleResolveDispute = (jobId: number, resolution: string) => {
    console.log('Resolving dispute for job:', jobId, 'Resolution:', resolution);
    // API call to resolve dispute
  };

  const handleTicketResponse = (ticketId: number, response: string) => {
    console.log('Responding to ticket:', ticketId, 'Response:', response);
    // API call to add response to ticket
    setTicketResponse('');
  };

  const statusColors = {
    new: 'bg-blue-100 text-blue-800',
    assigned: 'bg-purple-100 text-purple-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    disputed: 'bg-red-100 text-red-800'
  };

  const urgencyColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  const ticketStatusColors = {
    open: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    resolved: 'bg-green-100 text-green-800'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Job & Customer Management</h2>
          <p className="text-slate-300">Monitor jobs and handle customer support</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            {jobs.filter(j => j.status === 'disputed').length} disputes
          </Badge>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            {supportTickets.filter(t => t.status === 'open').length} open tickets
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="jobs">Master Job Dashboard</TabsTrigger>
          <TabsTrigger value="disputes">Dispute Resolution</TabsTrigger>
          <TabsTrigger value="support">Support Tickets</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs">
          <Card className="britannia-admin-card">
            <CardHeader>
              <CardTitle className="text-xl">Master Job Dashboard</CardTitle>
              <CardDescription>View and manage all jobs across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Engineer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Urgency</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs?.map((job: any) => (
                    <TableRow key={job.id}>
                      <TableCell>#{job.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Wrench className="w-4 h-4" />
                          {job.serviceType}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{job.customer.name}</p>
                          <p className="text-sm text-gray-600">{job.customer.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {job.engineer ? (
                          <div>
                            <p className="font-medium">{job.engineer.name}</p>
                            <p className="text-sm text-gray-600">{job.engineer.gasSafeNumber}</p>
                          </div>
                        ) : (
                          <span className="text-gray-500">Not assigned</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[job.status]}>
                          {job.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={urgencyColors[job.urgency]}>
                          {job.urgency}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {job.scheduledDate && new Date(job.scheduledDate).toLocaleDateString()}
                        {job.completedDate && new Date(job.completedDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedJob(job)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disputes">
          <Card className="britannia-admin-card">
            <CardHeader>
              <CardTitle className="text-xl">Dispute Resolution</CardTitle>
              <CardDescription>Handle customer and engineer disputes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobs.filter(job => job.status === 'disputed')?.map((job: any) => (
                  <Card key={job.id} className="border-l-4 border-l-red-500">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">Job #{job.id} - {job.serviceType}</CardTitle>
                          <CardDescription>
                            Customer: {job.customer.name} | Submitted: {job.dispute && new Date(job.dispute.submittedAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge className="bg-red-100 text-red-800">
                          {job.dispute?.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="bg-red-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-red-800 mb-2">Dispute Details</h4>
                          <p className="text-red-700">{job.dispute?.reason}</p>
                          <p className="text-sm text-red-600 mt-2">
                            Submitted by: {job.dispute?.submittedBy}
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">Customer Information</h4>
                            <p className="text-sm">Name: {job.customer.name}</p>
                            <p className="text-sm">Email: {job.customer.email}</p>
                            <p className="text-sm">Phone: {job.customer.phone}</p>
                            <p className="text-sm">Address: {job.customer.address}</p>
                          </div>
                          
                          {job.engineer && (
                            <div>
                              <h4 className="font-semibold mb-2">Engineer Information</h4>
                              <p className="text-sm">Name: {job.engineer.name}</p>
                              <p className="text-sm">Phone: {job.engineer.phone}</p>
                              <p className="text-sm">Gas Safe: {job.engineer.gasSafeNumber}</p>
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Job Archive</h4>
                          <div className="flex gap-2">
                            {job.photos?.map((photo, index) => (
                              <img 
                                key={index}
                                src={photo} 
                                alt={`Job photo ${index + 1}`}
                                className="w-20 h-20 object-cover rounded"
                              />
                            ))}
                          </div>
                        </div>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="bg-green-600 hover:bg-green-700 text-white">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Resolve Dispute
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Resolve Dispute</DialogTitle>
                              <DialogDescription>
                                Provide resolution details for Job #{job.id}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <Textarea
                                placeholder="Resolution details and actions taken..."
                                rows={4}
                              />
                              <div className="flex justify-end gap-2">
                                <Button variant="outline">Cancel</Button>
                                <Button 
                                  onClick={() => handleResolveDispute(job.id, 'Resolution details')}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  Mark as Resolved
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

        <TabsContent value="support">
          <Card className="britannia-admin-card">
            <CardHeader>
              <CardTitle className="text-xl">Customer Support Tickets</CardTitle>
              <CardDescription>Handle customer inquiries and issues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {supportTickets?.map((ticket: any) => (
                  <Card key={ticket.id} className="border">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">#{ticket.id} - {ticket.subject}</CardTitle>
                          <CardDescription>
                            {ticket.customerName} | {new Date(ticket.submittedAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={priorityColors[ticket.priority]}>
                            {ticket.priority} priority
                          </Badge>
                          <Badge className={ticketStatusColors[ticket.status]}>
                            {ticket.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Customer Message</h4>
                          <p className="text-gray-700">{ticket.message}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">Contact Information</h4>
                            <p className="text-sm">Name: {ticket.customerName}</p>
                            <p className="text-sm">Email: {ticket.email}</p>
                          </div>
                          
                          {ticket.assignedTo && (
                            <div>
                              <h4 className="font-semibold mb-2">Assignment</h4>
                              <p className="text-sm">Assigned to: {ticket.assignedTo}</p>
                            </div>
                          )}
                        </div>
                        
                        {ticket.responses.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2">Response History</h4>
                            <div className="space-y-2">
                              {ticket.responses?.map((response, index) => (
                                <div key={index} className="bg-blue-50 p-3 rounded">
                                  <div className="flex justify-between items-start mb-2">
                                    <span className="font-medium text-blue-800">{response.from}</span>
                                    <span className="text-sm text-blue-600">
                                      {new Date(response.timestamp).toLocaleString()}
                                    </span>
                                  </div>
                                  <p className="text-blue-700">{response.message}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div>
                          <Label className="font-medium mb-2 block">Add Response</Label>
                          <Textarea
                            value={ticketResponse}
                            onChange={(e) => setTicketResponse(e.target.value)}
                            placeholder="Type your response here..."
                            rows={3}
                          />
                          <div className="flex justify-end gap-2 mt-2">
                            <Button
                              onClick={() => handleTicketResponse(ticket.id, ticketResponse)}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Send Response
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Job Detail Modal */}
      {selectedJob && (
        <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Job #{selectedJob.id} - {selectedJob.serviceType}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Customer Information</h4>
                  <p className="text-sm">Name: {selectedJob.customer.name}</p>
                  <p className="text-sm">Email: {selectedJob.customer.email}</p>
                  <p className="text-sm">Phone: {selectedJob.customer.phone}</p>
                  <p className="text-sm">Address: {selectedJob.customer.address}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Job Details</h4>
                  <p className="text-sm">Status: <Badge className={statusColors[selectedJob.status]}>{selectedJob.status}</Badge></p>
                  <p className="text-sm">Urgency: <Badge className={urgencyColors[selectedJob.urgency]}>{selectedJob.urgency}</Badge></p>
                  {selectedJob.priceQuote && <p className="text-sm">Quote: £{selectedJob.priceQuote}</p>}
                  {selectedJob.finalPrice && <p className="text-sm">Final Price: £{selectedJob.finalPrice}</p>}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-gray-700">{selectedJob.description}</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Photos</h4>
                <div className="flex gap-2">
                  {selectedJob.photos?.map((photo, index) => (
                    <img 
                      key={index}
                      src={photo} 
                      alt={`Job photo ${index + 1}`}
                      className="w-32 h-32 object-cover rounded"
                    />
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