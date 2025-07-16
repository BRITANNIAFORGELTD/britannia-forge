import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Edit, Save, X, Plus, MapPin, Percent } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export function LocationManagement() {
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ [key: string]: any }>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: locations } = useQuery({
    queryKey: ['/api/admin/locations'],
    enabled: true,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return apiRequest('PUT', `/api/admin/locations/${id}`, data);
    },
    onSuccess: () => {
      toast({
        title: 'Location updated',
        description: 'Location pricing has been updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/locations'] });
      setEditingItem(null);
      setEditValues({});
    },
    onError: () => {
      toast({
        title: 'Update failed',
        description: 'Failed to update location',
        variant: 'destructive',
      });
    },
  });

  const startEdit = (locationId: string, location: any) => {
    setEditingItem(locationId);
    setEditValues({
      [locationId]: {
        name: location.name,
        priceMultiplier: location.priceMultiplier,
        labourMultiplier: location.labourMultiplier,
        postcodePattern: location.postcodePattern,
        isActive: location.isActive,
      }
    });
  };

  const saveEdit = async (id: string) => {
    const values = editValues[id];
    if (!values) return;

    updateMutation.mutate({ id, data: values });
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setEditValues({});
  };

  const updateEditValue = (locationId: string, field: string, value: any) => {
    setEditValues(prev => ({
      ...prev,
      [locationId]: {
        ...prev[locationId],
        [field]: value
      }
    }));
  };

  const formatMultiplier = (multiplier: number) => {
    return `${((multiplier - 1) * 100).toFixed(0)}%`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Location Management</h2>
          <p className="text-slate-300">Manage location-based pricing multipliers</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Location
        </Button>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Location Pricing
          </CardTitle>
          <CardDescription className="text-slate-300">
            Configure pricing multipliers for different regions and postcodes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-600">
                  <TableHead className="text-slate-300">Location</TableHead>
                  <TableHead className="text-slate-300">Postcode Pattern</TableHead>
                  <TableHead className="text-slate-300">Price Multiplier</TableHead>
                  <TableHead className="text-slate-300">Labour Multiplier</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {locations?.map((location: any) => (
                  <TableRow key={location.id} className="border-slate-600">
                    <TableCell className="text-white">
                      {editingItem === location.id.toString() ? (
                        <Input
                          value={editValues[location.id]?.name || ''}
                          onChange={(e) => updateEditValue(location.id, 'name', e.target.value)}
                          className="w-32 bg-slate-800/50 border-slate-600 text-white"
                        />
                      ) : (
                        location.name
                      )}
                    </TableCell>
                    <TableCell className="text-white">
                      {editingItem === location.id.toString() ? (
                        <Input
                          value={editValues[location.id]?.postcodePattern || ''}
                          onChange={(e) => updateEditValue(location.id, 'postcodePattern', e.target.value)}
                          className="w-24 bg-slate-800/50 border-slate-600 text-white"
                        />
                      ) : (
                        <Badge variant="outline" className="text-slate-300">
                          {location.postcodePattern}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-white">
                      {editingItem === location.id.toString() ? (
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            step="0.1"
                            value={editValues[location.id]?.priceMultiplier || ''}
                            onChange={(e) => updateEditValue(location.id, 'priceMultiplier', parseFloat(e.target.value))}
                            className="w-20 bg-slate-800/50 border-slate-600 text-white"
                          />
                          <Percent className="h-4 w-4 text-slate-400" />
                        </div>
                      ) : (
                        <Badge 
                          variant={location.priceMultiplier > 1.2 ? 'destructive' : location.priceMultiplier > 1.1 ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          +{formatMultiplier(location.priceMultiplier)}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-white">
                      {editingItem === location.id.toString() ? (
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            step="0.1"
                            value={editValues[location.id]?.labourMultiplier || ''}
                            onChange={(e) => updateEditValue(location.id, 'labourMultiplier', parseFloat(e.target.value))}
                            className="w-20 bg-slate-800/50 border-slate-600 text-white"
                          />
                          <Percent className="h-4 w-4 text-slate-400" />
                        </div>
                      ) : (
                        <Badge 
                          variant={location.labourMultiplier > 1.2 ? 'destructive' : location.labourMultiplier > 1.1 ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          +{formatMultiplier(location.labourMultiplier)}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingItem === location.id.toString() ? (
                        <Switch
                          checked={editValues[location.id]?.isActive || false}
                          onCheckedChange={(checked) => updateEditValue(location.id, 'isActive', checked)}
                        />
                      ) : (
                        <Badge variant={location.isActive ? 'default' : 'secondary'}>
                          {location.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {editingItem === location.id.toString() ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() => saveEdit(location.id)}
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
                            onClick={() => startEdit(location.id.toString(), location)}
                            variant="outline"
                            className="border-slate-600 text-slate-300 hover:bg-slate-800"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white text-sm">Total Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {locations?.length || 0}
            </div>
            <p className="text-slate-300 text-xs">Configured locations</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white text-sm">Active Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {locations?.filter((l: any) => l.isActive).length || 0}
            </div>
            <p className="text-slate-300 text-xs">Currently active</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white text-sm">Avg. Price Increase</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">
              {locations?.length > 0 
                ? `${((locations.reduce((acc: number, loc: any) => acc + loc.priceMultiplier, 0) / locations.length - 1) * 100).toFixed(0)}%`
                : '0%'
              }
            </div>
            <p className="text-slate-300 text-xs">Average markup</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}