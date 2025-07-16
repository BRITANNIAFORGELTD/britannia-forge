import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Edit, Save, X, Home, Building2, Ruler } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export function FlueCostManagement() {
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ [key: string]: any }>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: flueCosts } = useQuery({
    queryKey: ['/api/admin/flue-costs'],
    enabled: true,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return apiRequest('PUT', `/api/admin/flue-costs/${id}`, data);
    },
    onSuccess: () => {
      toast({
        title: 'Flue cost updated',
        description: 'Flue cost has been updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/flue-costs'] });
      setEditingItem(null);
      setEditValues({});
    },
    onError: () => {
      toast({
        title: 'Update failed',
        description: 'Failed to update flue cost',
        variant: 'destructive',
      });
    },
  });

  const startEdit = (costId: string, cost: any) => {
    setEditingItem(costId);
    setEditValues({
      [costId]: {
        baseCost: cost.baseCost / 100,
        roofAccessCost: cost.roofAccessCost / 100,
        ladderCost: cost.ladderCost / 100,
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
        roofAccessCost: Math.round(values.roofAccessCost * 100),
        ladderCost: Math.round(values.ladderCost * 100),
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

  const getFlueIcon = (flueType: string) => {
    return flueType === 'external_wall' ? Home : Building2;
  };

  const getFlueTypeLabel = (flueType: string) => {
    return flueType === 'external_wall' ? 'External Wall' : 'Through Roof';
  };

  const getExtensionLabel = (extensionLength: number) => {
    if (extensionLength === 0) return 'No Extension';
    if (extensionLength <= 2) return '1-2m Extension';
    if (extensionLength <= 4) return '3-4m Extension';
    return '5m+ Extension';
  };

  const getTotalCost = (cost: any) => {
    return cost.baseCost + cost.roofAccessCost + cost.ladderCost;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Flue Cost Management</h2>
          <p className="text-slate-300">Manage flue installation and extension costs</p>
        </div>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Building2 className="h-5 w-5 mr-2" />
            Flue Installation Costs
          </CardTitle>
          <CardDescription className="text-slate-300">
            Configure costs for different flue types and extensions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-600">
                  <TableHead className="text-slate-300">Flue Type</TableHead>
                  <TableHead className="text-slate-300">Extension</TableHead>
                  <TableHead className="text-slate-300">Base Cost</TableHead>
                  <TableHead className="text-slate-300">Roof Access</TableHead>
                  <TableHead className="text-slate-300">Ladder/Equipment</TableHead>
                  <TableHead className="text-slate-300">Total Cost</TableHead>
                  <TableHead className="text-slate-300">Description</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(Array.isArray(flueCosts) ? flueCosts : [])?.map((cost: any) => {
                  const IconComponent = getFlueIcon(cost.flueType);
                  return (
                    <TableRow key={cost.id} className="border-slate-600">
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <IconComponent className="h-4 w-4 text-slate-400" />
                          <span className="text-white">{getFlueTypeLabel(cost.flueType)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Ruler className="h-3 w-3 text-slate-400" />
                          <Badge variant="outline" className="text-slate-300">
                            {getExtensionLabel(cost.extensionLength)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-white">
                        {editingItem === cost.id.toString() ? (
                          <div className="flex items-center space-x-1">
                            <span className="text-slate-400">£</span>
                            <Input
                              type="number"
                              step="0.01"
                              value={editValues[cost.id]?.baseCost || ''}
                              onChange={(e) => updateEditValue(cost.id, 'baseCost', parseFloat(e.target.value) || 0)}
                              className="w-20 bg-slate-800/50 border-slate-600 text-white"
                            />
                          </div>
                        ) : (
                          <span className={cost.baseCost > 0 ? 'text-yellow-400' : 'text-green-400'}>
                            {cost.baseCost > 0 ? formatPrice(cost.baseCost) : 'Free'}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-white">
                        {editingItem === cost.id.toString() ? (
                          <div className="flex items-center space-x-1">
                            <span className="text-slate-400">£</span>
                            <Input
                              type="number"
                              step="0.01"
                              value={editValues[cost.id]?.roofAccessCost || ''}
                              onChange={(e) => updateEditValue(cost.id, 'roofAccessCost', parseFloat(e.target.value) || 0)}
                              className="w-20 bg-slate-800/50 border-slate-600 text-white"
                            />
                          </div>
                        ) : (
                          <span className={cost.roofAccessCost > 0 ? 'text-orange-400' : 'text-slate-400'}>
                            {cost.roofAccessCost > 0 ? formatPrice(cost.roofAccessCost) : '-'}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-white">
                        {editingItem === cost.id.toString() ? (
                          <div className="flex items-center space-x-1">
                            <span className="text-slate-400">£</span>
                            <Input
                              type="number"
                              step="0.01"
                              value={editValues[cost.id]?.ladderCost || ''}
                              onChange={(e) => updateEditValue(cost.id, 'ladderCost', parseFloat(e.target.value) || 0)}
                              className="w-20 bg-slate-800/50 border-slate-600 text-white"
                            />
                          </div>
                        ) : (
                          <span className={cost.ladderCost > 0 ? 'text-blue-400' : 'text-slate-400'}>
                            {cost.ladderCost > 0 ? formatPrice(cost.ladderCost) : '-'}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-white">
                        <span className="font-medium text-white">
                          {formatPrice(getTotalCost(cost))}
                        </span>
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
            <CardTitle className="text-white text-sm">External Wall</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">
              {(Array.isArray(flueCosts) ? flueCosts : []).filter((c: any) => c.flueType === 'external_wall').length}
            </div>
            <p className="text-slate-300 text-xs">Wall flue options</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white text-sm">Through Roof</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-400">
              {(Array.isArray(flueCosts) ? flueCosts : []).filter((c: any) => c.flueType === 'through_roof').length}
            </div>
            <p className="text-slate-300 text-xs">Roof flue options</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white text-sm">With Extensions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">
              {(Array.isArray(flueCosts) ? flueCosts : []).filter((c: any) => c.extensionLength > 0).length}
            </div>
            <p className="text-slate-300 text-xs">Extension required</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white text-sm">Roof Access</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">
              {(Array.isArray(flueCosts) ? flueCosts : []).filter((c: any) => c.roofAccessCost > 0).length}
            </div>
            <p className="text-slate-300 text-xs">Requires roof access</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}