import { useState } from 'react';
import { Header } from '@/components/navigation/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Settings,
  MapPin,
  Building,
  Wrench,
  Users,
  TrendingUp,
  AlertCircle,
  DollarSign,
  Calendar,
  Shield,
  Star,
  Activity,
  Zap,
  FileText,
  Database,
  LogOut,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { PricingManagement } from '@/components/admin/pricing-management';
import { PricingDashboard } from '@/components/admin/pricing-dashboard';
import { LocationManagement } from '@/components/admin/location-management';
import { EngineerManagement } from '@/components/admin/engineer-management';
import { JobManagement } from '@/components/admin/job-management';
import { AccessCostManagement } from '@/components/admin/access-cost-management';
import { FlueCostManagement } from '@/components/admin/flue-cost-management';
import { LeadCostManagement } from '@/components/admin/lead-cost-management';
import { CylinderManagement } from '@/components/admin/cylinder-management';
import { HeatingSundriesManagement } from '@/components/admin/heating-sundries-management';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const { data: stats } = useQuery({
    queryKey: ['/api/admin/stats'],
    enabled: true,
  });

  const { data: recentActivity } = useQuery({
    queryKey: ['/api/admin/activity'],
    enabled: true,
  });

  const handleLogout = async () => {
    try {
      await apiRequest('POST', '/api/auth/logout');
      // Clear localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      // Redirect to secure admin login
      window.location.href = '/britannia1074/admin/login';
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout anyway
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      window.location.href = '/britannia1074/admin/login';
    }
  };

  return (
    <div className="britannia-admin-container">
      <Header />
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="britannia-admin-header mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 mb-2">Admin Dashboard</h1>
              <p className="text-slate-600 text-lg">Manage pricing, locations, and engineers</p>
            </div>
            <Button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="britannia-admin-tabs grid w-full grid-cols-10 p-2">
            <TabsTrigger value="overview" className="britannia-admin-tab-trigger">
              <Activity className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="pricing" className="britannia-admin-tab-trigger">
              <DollarSign className="h-4 w-4 mr-2" />
              Pricing
            </TabsTrigger>
            <TabsTrigger value="locations" className="britannia-admin-tab-trigger">
              <MapPin className="h-4 w-4 mr-2" />
              Locations
            </TabsTrigger>
            <TabsTrigger value="access" className="britannia-admin-tab-trigger">
              <Building className="h-4 w-4 mr-2" />
              Access
            </TabsTrigger>
            <TabsTrigger value="flue" className="britannia-admin-tab-trigger">
              <Zap className="h-4 w-4 mr-2" />
              Flue
            </TabsTrigger>
            <TabsTrigger value="leads" className="britannia-admin-tab-trigger">
              <Users className="h-4 w-4 mr-2" />
              Leads
            </TabsTrigger>
            <TabsTrigger value="cylinders" className="britannia-admin-tab-trigger">
              <Database className="h-4 w-4 mr-2" />
              Cylinders
            </TabsTrigger>
            <TabsTrigger value="heating-sundries" className="britannia-admin-tab-trigger">
              <Settings className="h-4 w-4 mr-2" />
              Materials
            </TabsTrigger>
            <TabsTrigger value="engineers" className="britannia-admin-tab-trigger">
              <Wrench className="h-4 w-4 mr-2" />
              Engineers
            </TabsTrigger>
            <TabsTrigger value="jobs" className="britannia-admin-tab-trigger">
              <FileText className="h-4 w-4 mr-2" />
              Jobs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="britannia-admin-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-700">
                    Total Quotes
                  </CardTitle>
                  <FileText className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">
                    {stats?.totalQuotes || 0}
                  </div>
                  <p className="text-xs text-slate-600">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="britannia-admin-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-700">
                    Active Engineers
                  </CardTitle>
                  <Users className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">
                    {stats?.activeEngineers || 0}
                  </div>
                  <p className="text-xs text-slate-600">
                    +3 new this week
                  </p>
                </CardContent>
              </Card>

              <Card className="britannia-admin-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-700">
                    Revenue
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">
                    £{stats?.revenue || 0}
                  </div>
                  <p className="text-xs text-slate-600">
                    +8% from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="britannia-admin-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-700">
                    Pending Reviews
                  </CardTitle>
                  <AlertCircle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">
                    {stats?.pendingReviews || 0}
                  </div>
                  <p className="text-xs text-slate-600">
                    Requires attention
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="britannia-admin-card">
                <CardHeader>
                  <CardTitle className="text-slate-800">Recent Activity</CardTitle>
                  <CardDescription className="text-slate-600">
                    Latest system activity and changes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity?.map((activity: any, index: number) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-800">{activity.description}</p>
                          <p className="text-xs text-slate-600">{activity.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="britannia-admin-card">
                <CardHeader>
                  <CardTitle className="text-slate-800">System Status</CardTitle>
                  <CardDescription className="text-slate-600">
                    Current system health and performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-700">Database</span>
                      <Badge className="bg-green-100 text-green-700 border-green-200">Healthy</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-700">API Response</span>
                      <Badge className="bg-green-100 text-green-700 border-green-200">Fast</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-700">Quote Engine</span>
                      <Badge className="bg-green-100 text-green-700 border-green-200">Online</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-700">Payment System</span>
                      <Badge className="bg-green-100 text-green-700 border-green-200">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pricing">
            <PricingManagement />
          </TabsContent>

          <TabsContent value="locations">
            <LocationManagement />
          </TabsContent>

          <TabsContent value="access">
            <AccessCostManagement />
          </TabsContent>

          <TabsContent value="flue">
            <FlueCostManagement />
          </TabsContent>

          <TabsContent value="leads">
            <LeadCostManagement />
          </TabsContent>

          <TabsContent value="cylinders">
            <CylinderManagement />
          </TabsContent>

          <TabsContent value="heating-sundries">
            <HeatingSundriesManagement />
          </TabsContent>

          <TabsContent value="engineers">
            <EngineerManagement />
          </TabsContent>

          <TabsContent value="jobs">
            <JobManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}