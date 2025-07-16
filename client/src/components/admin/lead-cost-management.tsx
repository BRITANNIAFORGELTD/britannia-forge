import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Edit, Save, X, DollarSign, Users, TrendingUp } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export function LeadCostManagement() {
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ [key: string]: any }>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: leadCosts } = useQuery({
    queryKey: ['/api/admin/lead-costs'],
    enabled: true,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return apiRequest('PUT', `/api/admin/lead-costs/${id}`, data);
    },
    onSuccess: () => {
      toast({
        title: 'Lead cost updated',
        description: 'Lead cost has been updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/lead-costs'] });
      setEditingItem(null);
      setEditValues({});
    },
    onError: () => {
      toast({
        title: 'Update failed',
        description: 'Failed to update lead cost',
        variant: 'destructive',
      });
    },
  });

  const startEdit = (costId: string, cost: any) => {
    setEditingItem(costId);
    setEditValues({
      [costId]: {
        leadCost: cost.leadCost / 100,
        description: cost.description,
        isActive: cost.isActive,
      }
    });
  };

  const saveEdit = async (id: string) => {
    const values = editValues[id];
    if (!values) return;

    updateMutation.mutate({
      id,
      data: {
        leadCost: Math.round(values.leadCost * 100),
        description: values.description,
        isActive: values.isActive,
      }
    });
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setEditValues({});
  };

  const updateEditValue = (costId: string, field: string, value: any) => {
    setEditValues(prev => ({
      ...prev,
      [costId]: {
        ...prev[costId],
        [field]: value
      }
    }));
  };

  const formatPrice = (price: number) => {
    return `£${(price / 100).toFixed(2)}`;
  };

  const getServiceIcon = (serviceType: string) => {
    return DollarSign;
  };

  const getServiceCategory = (serviceType: string) => {
    if (serviceType.includes('boiler')) return 'Heating';
    if (serviceType.includes('electrical')) return 'Electrical';
    if (serviceType.includes('plumbing')) return 'Plumbing';
    if (serviceType.includes('landlord')) return 'Certification';
    return 'General';
  };

  const getCategoryColor = (serviceType: string) => {
    const category = getServiceCategory(serviceType);
    switch (category) {
      case 'Heating': return 'bg-orange-500/20 text-orange-400';
      case 'Electrical': return 'bg-yellow-500/20 text-yellow-400';
      case 'Plumbing': return 'bg-blue-500/20 text-blue-400';
      case 'Certification': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Lead Cost Management</h2>
          <p className="text-slate-300">Manage engineer lead costs by service type</p>
        </div>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Engineer Lead Costs
          </CardTitle>
          <CardDescription className="text-slate-300">
            Configure how much engineers pay to access customer job details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-600">
                  <TableHead className="text-slate-300">Service Type</TableHead>
                  <TableHead className="text-slate-300">Category</TableHead>
                  <TableHead className="text-slate-300">Lead Cost</TableHead>
                  <TableHead className="text-slate-300">Description</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leadCosts?.map((cost: any) => {
                  const IconComponent = getServiceIcon(cost.serviceType);
                  return (
                    <TableRow key={cost.id} className="border-slate-600">
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <IconComponent className="h-4 w-4 text-slate-400" />
                          <span className="text-white capitalize">{cost.serviceType.replace('-', ' ')}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getCategoryColor(cost.serviceType)}>
                          {getServiceCategory(cost.serviceType)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white">
                        {editingItem === cost.id.toString() ? (
                          <div className="flex items-center space-x-2">
                            <span className="text-slate-400">£</span>
                            <Input
                              type="number"
                              step="0.01"
                              value={editValues[cost.id]?.leadCost || ''}
                              onChange={(e) => updateEditValue(cost.id, 'leadCost', parseFloat(e.target.value) || 0)}
                              className="w-24 bg-slate-800/50 border-slate-600 text-white"
                            />
                          </div>
                        ) : (
                          <span className="text-green-400 font-medium">
                            {formatPrice(cost.leadCost)}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-white">
                        {editingItem === cost.id.toString() ? (
                          <Input
                            value={editValues[cost.id]?.description || ''}
                            onChange={(e) => updateEditValue(cost.id, 'description', e.target.value)}
                            className="bg-slate-800/50 border-slate-600 text-white"
                          />
                        ) : (
                          <span className="text-slate-300">{cost.description}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingItem === cost.id.toString() ? (
                          <Switch
                            checked={editValues[cost.id]?.isActive || false}
                            onCheckedChange={(checked) => updateEditValue(cost.id, 'isActive', checked)}
                          />
                        ) : (
                          <Badge variant={cost.isActive ? 'default' : 'secondary'}>
                            {cost.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {editingItem === cost.id.toString() ? (
                            <>
                              <Button
                                size="sm"
                                onClick={() => saveEdit(cost.id)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <Save className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                onClick={cancelEdit}
                                variant="outline"
                                className="border-slate-600 text-slate-300 hover:bg-slate-800"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => startEdit(cost.id.toString(), cost)}
                              variant="outline"
                              className="border-slate-600 text-slate-300 hover:bg-slate-800"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white text-sm">Total Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {leadCosts?.length || 0}
            </div>
            <p className="text-slate-300 text-xs">Available services</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white text-sm">Avg. Lead Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {leadCosts?.length > 0 
                ? `£${(leadCosts.reduce((acc: number, cost: any) => acc + cost.leadCost, 0) / leadCosts.length / 100).toFixed(2)}`
                : '£0.00'
              }
            </div>
            <p className="text-slate-300 text-xs">Average cost per lead</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white text-sm">Highest Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">
              {leadCosts?.length > 0 
                ? `£${(Math.max(...leadCosts?.map((c: any) => c.leadCost)) / 100).toFixed(2)}`
                : '£0.00'
              }
            </div>
            <p className="text-slate-300 text-xs">Premium service lead</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white text-sm">Revenue Potential</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">
              <TrendingUp className="h-6 w-6 inline mr-1" />
              High
            </div>
            <p className="text-slate-300 text-xs">Lead generation income</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}