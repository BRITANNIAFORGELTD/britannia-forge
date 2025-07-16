import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Calendar, FileText, Settings, Download } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { QuoteData } from '@/types/quote';
import { useLocation } from 'wouter';

interface Step6Props {
  data: QuoteData;
  onUpdate: (updates: Partial<QuoteData>) => void;
}

export function Step6Confirmation({ data, onUpdate }: Step6Props) {
  const [password, setPassword] = useState('');
  const [, setLocation] = useLocation();

  const handleCreateAccount = () => {
    if (password.length >= 8) {
      // In a real app, this would create the account
      onUpdate({ ...data, accountCreated: true });
      setLocation('/dashboard');
    }
  };

  const selectedQuote = data.quotes?.find(q => q.tier === data.selectedPackage);

  return (
    <GlassCard className="mb-8 fade-in">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-3xl font-bold text-britannia-dark mb-2">Booking Confirmed!</h3>
        <p className="text-gray-600">Your installation is scheduled and our team will be in touch shortly</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="dashboard-card rounded-xl p-6">
          <h4 className="text-lg font-semibold text-britannia-dark mb-4">Installation Details</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Package:</span>
              <span className="font-medium">{selectedQuote?.boilerMake} {selectedQuote?.boilerModel} ({data.selectedPackage})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Installation Date:</span>
              <span className="font-medium">TBC (within 2 weeks)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Engineer:</span>
              <span className="font-medium">Assigned upon survey</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <Badge className="status-badge status-pending">Survey Pending</Badge>
            </div>
          </div>
        </div>

        <div className="dashboard-card rounded-xl p-6">
          <h4 className="text-lg font-semibold text-britannia-dark mb-4">What's Next?</h4>
          <div className="space-y-3">
            <div className="flex items-start">
              <Calendar className="w-5 h-5 text-britannia-success mr-3 mt-1" />
              <div>
                <div className="font-medium">Survey Scheduled</div>
                <div className="text-sm text-gray-600">We'll call within 24 hours to arrange</div>
              </div>
            </div>
            <div className="flex items-start">
              <FileText className="w-5 h-5 text-britannia-blue mr-3 mt-1" />
              <div>
                <div className="font-medium">Final Quote</div>
                <div className="text-sm text-gray-600">Confirmed after survey</div>
              </div>
            </div>
            <div className="flex items-start">
              <Settings className="w-5 h-5 text-gray-400 mr-3 mt-1" />
              <div>
                <div className="font-medium">Installation</div>
                <div className="text-sm text-gray-600">Professional installation by certified engineers</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-card rounded-xl p-6 mb-8">
        <h4 className="text-lg font-semibold text-britannia-dark mb-4">Create Your Account</h4>
        <p className="text-gray-600 mb-4">Track your installation progress and manage your booking</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">Email</Label>
            <Input
              type="email"
              value={data.customerDetails.email}
              className="w-full bg-gray-50"
              readOnly
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">Create Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter at least 8 characters"
              className="w-full"
            />
          </div>
        </div>
        <Button
          className="glass-button mt-4 px-6 py-3 rounded-lg text-white font-medium"
          onClick={handleCreateAccount}
          disabled={password.length < 8}
        >
          Create Account & Access Dashboard
        </Button>
      </div>

      {/* Preview of Dashboard */}
      <div className="dashboard-card rounded-xl p-6">
        <h4 className="text-lg font-semibold text-britannia-dark mb-4">Your Dashboard Preview</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Check className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="font-medium">Booking Confirmed</div>
            <div className="text-sm text-gray-600">Your installation is scheduled</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="font-medium">Survey Pending</div>
            <div className="text-sm text-gray-600">Engineer will contact you soon</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Settings className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <div className="font-medium">Installation</div>
            <div className="text-sm text-gray-600">Awaiting survey completion</div>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <h5 className="font-medium mb-3">Available Documents</h5>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center">
                <FileText className="w-4 h-4 text-red-500 mr-2" />
                <span className="text-sm">Installation Quote</span>
              </div>
              <Button size="sm" variant="ghost">
                <Download className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center">
                <FileText className="w-4 h-4 text-blue-500 mr-2" />
                <span className="text-sm">Terms & Conditions</span>
              </div>
              <Button size="sm" variant="ghost">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
