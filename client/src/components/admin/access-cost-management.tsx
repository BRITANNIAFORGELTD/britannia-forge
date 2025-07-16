import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Edit, Save, X, Building, ArrowUp, ArrowDown } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export function AccessCostManagement() {
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ [key: string]: any }>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: accessCosts } = useQuery({
    queryKey: ['/api/admin/access-costs'],
    enabled: true,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return apiRequest('PUT', `/api/admin/access-costs/${id}`, data);
    },
    onSuccess: () => {
      toast({
        title: 'Access cost updated',
        description: 'Access cost has been updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/access-costs'] });
      setEditingItem(null);
      setEditValues({});
    },
    onError: () => {
      toast({
        title: 'Update failed',
        description: 'Failed to update access cost',
        variant: 'destructive',
      });
    },
  });

  const startEdit = (costId: string, cost: any) => {
    setEditingItem(costId);
    setEditValues({
      [costId]: {
        baseCost: cost.baseCost / 100,
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
        baseCost: Math.round(values.baseCost * 100),
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

  const getFloorIcon = (floorLevel: string, hasLift: boolean) => {
    if (floorLevel === 'ground') return Building;
    return hasLift ? ArrowUp : ArrowDown;
  };

  const getAccessBadge = (floorLevel: string, hasLift: boolean) => {
    if (floorLevel === 'ground') return 'Ground Floor';
    if (hasLift) return `${floorLevel.toUpperCase()} + Lift`;
    return `${floorLevel.toUpperCase()} + Stairs`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Access Cost Management</h2>
          <p className="text-slate-300">Manage pricing for different floor levels and access types</p>
        </div>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Building className="h-5 w-5 mr-2" />
            Floor Access Pricing
          </CardTitle>
          <CardDescription className="text-slate-300">
            Configure additional costs based on floor level and lift availability
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-600">
                  <TableHead className="text-slate-300">Floor Level</TableHead>
                  <TableHead className="text-slate-300">Access Type</TableHead>
                  <TableHead className="text-slate-300">Additional Cost</TableHead>
                  <TableHead className="text-slate-300">Description</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(Array.isArray(accessCosts) ? accessCosts : [])?.map((cost: any) => {
                  const IconComponent = getFloorIcon(cost.floorLevel, cost.hasLift);
                  return (
                    <TableRow key={cost.id} className="border-slate-600">
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <IconComponent className="h-4 w-4 text-slate-400" />
                          <span className="text-white capitalize">{cost.floorLevel}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-slate-300">
                          {getAccessBadge(cost.floorLevel, cost.hasLift)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white">
                        {editingItem === cost.id.toString() ? (
                          <div className="flex items-center space-x-2">
                            <span className="text-slate-400">£</span>
                            <Input
                              type="number"
                              step="0.01"
                              value={editValues[cost.id]?.baseCost || ''}
                              onChange={(e) => updateEditValue(cost.id, 'baseCost', parseFloat(e.target.value) || 0)}
                              className="w-24 bg-slate-800/50 border-slate-600 text-white"
                            />
                          </div>
                        ) : (
                          <span className={cost.baseCost > 0 ? 'text-yellow-400' : 'text-green-400'}>
                            {cost.baseCost > 0 ? `+${formatPrice(cost.baseCost)}` : 'Free'}
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white text-sm">Ground Floor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">Free</div>
            <p className="text-slate-300 text-xs">No additional cost</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white text-sm">With Lift</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">
              {(Array.isArray(accessCosts) ? accessCosts : []).filter((c: any) => c.hasLift && c.floorLevel !== 'ground').length || 0}
            </div>
            <p className="text-slate-300 text-xs">Lift access options</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white text-sm">Stairs Only</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-400">
              {(Array.isArray(accessCosts) ? accessCosts : []).filter((c: any) => !c.hasLift && c.floorLevel !== 'ground').length || 0}
            </div>
            <p className="text-slate-300 text-xs">Manual access options</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}