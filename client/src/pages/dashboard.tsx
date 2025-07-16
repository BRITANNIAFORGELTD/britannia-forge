import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/navigation/header';
import { Footer } from '@/components/navigation/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { GlassCard } from '@/components/ui/glass-card';
import { 
  Calendar, 
  FileText, 
  Settings, 
  Download, 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  CreditCard,
  Bell,
  Home,
  Wrench,
  Star,
  MessageCircle
} from 'lucide-react';

interface JobStatus {
  id: string;
  status: 'pending' | 'survey-scheduled' | 'survey-completed' | 'installation-scheduled' | 'in-progress' | 'completed';
  scheduledDate?: string;
  completedDate?: string;
  engineerName?: string;
  engineerPhone?: string;
  progress: number;
}

interface DashboardData {
  user: {
    id: number;
    fullName: string;
    email: string;
    phone: string;
  };
  currentJob: JobStatus;
  recentActivity: Array<{
    id: string;
    type: 'booking' | 'survey' | 'payment' | 'installation' | 'completion';
    title: string;
    description: string;
    timestamp: string;
  }>;
  documents: Array<{
    id: string;
    name: string;
    type: 'pdf' | 'doc' | 'image';
    url: string;
    uploadDate: string;
  }>;
  paymentHistory: Array<{
    id: string;
    amount: number;
    date: string;
    status: 'paid' | 'pending' | 'failed';
    description: string;
  }>;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - in a real app, this would come from the API
  const mockData: DashboardData = {
    user: {
      id: 1,
      fullName: 'John Smith',
      email: 'john.smith@example.com',
      phone: '07123 456789'
    },
    currentJob: {
      id: 'job-001',
      status: 'survey-scheduled',
      scheduledDate: '2025-01-18T10:00:00Z',
      engineerName: 'Mike Johnson',
      engineerPhone: '07987 654321',
      progress: 30
    },
    recentActivity: [
      {
        id: '1',
        type: 'survey',
        title: 'Survey Scheduled',
        description: 'Engineer will visit on January 18th at 10:00 AM',
        timestamp: '2025-01-15T09:30:00Z'
      },
      {
        id: '2',
        type: 'booking',
        title: 'Booking Confirmed',
        description: 'Worcester Bosch Mid-Range package selected',
        timestamp: '2025-01-14T14:20:00Z'
      },
      {
        id: '3',
        type: 'payment',
        title: 'Deposit Paid',
        description: '£299 deposit payment processed',
        timestamp: '2025-01-14T14:25:00Z'
      }
    ],
    documents: [
      {
        id: '1',
        name: 'Installation Quote',
        type: 'pdf',
        url: '#',
        uploadDate: '2025-01-14T14:30:00Z'
      },
      {
        id: '2',
        name: 'Terms & Conditions',
        type: 'pdf',
        url: '#',
        uploadDate: '2025-01-14T14:30:00Z'
      },
      {
        id: '3',
        name: 'Property Photos',
        type: 'image',
        url: '#',
        uploadDate: '2025-01-14T13:45:00Z'
      }
    ],
    paymentHistory: [
      {
        id: '1',
        amount: 299,
        date: '2025-01-14T14:25:00Z',
        status: 'paid',
        description: 'Booking deposit'
      }
    ]
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockData;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'survey-scheduled': return 'bg-blue-100 text-blue-800';
      case 'survey-completed': return 'bg-green-100 text-green-800';
      case 'installation-scheduled': return 'bg-purple-100 text-purple-800';
      case 'in-progress': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'survey-scheduled': return 'Survey Scheduled';
      case 'survey-completed': return 'Survey Completed';
      case 'installation-scheduled': return 'Installation Scheduled';
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      default: return 'Unknown';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'booking': return <CheckCircle className="w-4 h-4 text-britannia-success" />;
      case 'survey': return <Calendar className="w-4 h-4 text-britannia-blue" />;
      case 'payment': return <CreditCard className="w-4 h-4 text-britannia-success" />;
      case 'installation': return <Wrench className="w-4 h-4 text-britannia-blue" />;
      case 'completion': return <CheckCircle className="w-4 h-4 text-britannia-success" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-britannia-gray to-slate-200">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-britannia-gray to-slate-200">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <GlassCard className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-britannia-dark mb-2">Unable to Load Dashboard</h2>
            <p className="text-gray-600 mb-6">Please try refreshing the page or contact support if the problem persists.</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </GlassCard>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-britannia-gray to-slate-200">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-britannia-dark">Welcome back, {data.user.fullName}!</h1>
              <p className="text-gray-600">Here's your installation progress</p>
            </div>
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-britannia-blue text-white">
                {data.user.fullName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-britannia-dark">Installation Progress</h3>
              <Badge className={`status-badge ${getStatusColor(data.currentJob.status)}`}>
                {getStatusText(data.currentJob.status)}
              </Badge>
            </div>
            <Progress value={data.currentJob.progress} className="mb-4" />
            <p className="text-sm text-gray-600">{data.currentJob.progress}% Complete</p>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-britannia-dark">Next Appointment</h3>
              <Calendar className="w-5 h-5 text-britannia-blue" />
            </div>
            {data.currentJob.scheduledDate ? (
              <div>
                <p className="font-medium text-britannia-dark">
                  {new Date(data.currentJob.scheduledDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  {new Date(data.currentJob.scheduledDate).toLocaleTimeString()}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-600">No appointments scheduled</p>
            )}
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-britannia-dark">Your Engineer</h3>
              <User className="w-5 h-5 text-britannia-blue" />
            </div>
            {data.currentJob.engineerName ? (
              <div>
                <p className="font-medium text-britannia-dark">{data.currentJob.engineerName}</p>
                <p className="text-sm text-gray-600">{data.currentJob.engineerPhone}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-600">Engineer will be assigned after survey</p>
            )}
          </GlassCard>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-britannia-dark mb-4">Installation Timeline</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-britannia-success rounded-full flex items-center justify-center mr-4">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-britannia-dark">Booking Confirmed</p>
                      <p className="text-sm text-gray-600">January 14, 2025</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-britannia-blue rounded-full flex items-center justify-center mr-4">
                      <Calendar className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-britannia-dark">Survey Scheduled</p>
                      <p className="text-sm text-gray-600">January 18, 2025 at 10:00 AM</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                      <Wrench className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-500">Installation</p>
                      <p className="text-sm text-gray-400">Pending survey completion</p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-britannia-dark mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-britannia-blue mr-3" />
                    <div>
                      <p className="font-medium text-britannia-dark">Email</p>
                      <p className="text-sm text-gray-600">{data.user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-britannia-blue mr-3" />
                    <div>
                      <p className="font-medium text-britannia-dark">Phone</p>
                      <p className="text-sm text-gray-600">{data.user.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Home className="w-5 h-5 text-britannia-blue mr-3" />
                    <div>
                      <p className="font-medium text-britannia-dark">Installation Address</p>
                      <p className="text-sm text-gray-600">123 Example Street, London, SW1A 1AA</p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-britannia-dark mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {data.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1">
                      <p className="font-medium text-britannia-dark">{activity.title}</p>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(activity.timestamp).toLocaleDateString()} at {new Date(activity.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </TabsContent>

          <TabsContent value="documents">
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-britannia-dark mb-4">Your Documents</h3>
              <div className="space-y-3">
                {data.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-britannia-blue transition-colors">
                    <div className="flex items-center space-x-3">
                      <FileText className={`w-5 h-5 ${doc.type === 'pdf' ? 'text-red-500' : doc.type === 'image' ? 'text-blue-500' : 'text-gray-500'}`} />
                      <div>
                        <p className="font-medium text-britannia-dark">{doc.name}</p>
                        <p className="text-sm text-gray-600">
                          Uploaded {new Date(doc.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="text-britannia-blue hover:text-britannia-blue/80">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </GlassCard>
          </TabsContent>

          <TabsContent value="payments">
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-britannia-dark mb-4">Payment History</h3>
              <div className="space-y-3">
                {data.paymentHistory.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-5 h-5 text-britannia-blue" />
                      <div>
                        <p className="font-medium text-britannia-dark">{payment.description}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(payment.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-britannia-dark">£{payment.amount}</p>
                      <Badge className={`status-badge ${payment.status === 'paid' ? 'status-completed' : payment.status === 'pending' ? 'status-pending' : 'bg-red-100 text-red-800'}`}>
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <GlassCard className="p-6 text-center">
            <MessageCircle className="w-12 h-12 text-britannia-blue mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-britannia-dark mb-2">Need Help?</h3>
            <p className="text-sm text-gray-600 mb-4">Contact our support team for assistance</p>
            <Button className="glass-button">Contact Support</Button>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <Star className="w-12 h-12 text-britannia-warning mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-britannia-dark mb-2">Rate Your Experience</h3>
            <p className="text-sm text-gray-600 mb-4">Help us improve by sharing your feedback</p>
            <Button variant="outline">Leave Review</Button>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <Settings className="w-12 h-12 text-britannia-blue mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-britannia-dark mb-2">Account Settings</h3>
            <p className="text-sm text-gray-600 mb-4">Update your profile and preferences</p>
            <Button variant="outline">Manage Account</Button>
          </GlassCard>
        </div>
      </div>

      <Footer />
    </div>
  );
}
