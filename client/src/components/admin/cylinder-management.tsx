import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertCircle, Edit, Database, Gauge, Info, Settings, Wrench } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { Cylinder } from '@shared/schema';

export function CylinderManagement() {
  const [editingCylinder, setEditingCylinder] = useState<Cylinder | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cylinders, isLoading } = useQuery({
    queryKey: ['/api/admin/cylinders'],
    enabled: true,
  });

  const updateCylinderMutation = useMutation({
    mutationFn: async (data: { id: number; updates: Partial<Cylinder> }) => {
      return await apiRequest("PUT", `/api/admin/cylinders/${data.id}`, data.updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/cylinders'] });
      setIsDialogOpen(false);
      setEditingCylinder(null);
      toast({
        title: "Success",
        description: "Cylinder updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update cylinder",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (cylinder: Cylinder) => {
    setEditingCylinder(cylinder);
    setIsDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCylinder) return;
    
    const formData = new FormData(e.target as HTMLFormElement);
    const updates = {
      make: formData.get('make') as string,
      model: formData.get('model') as string,
      capacity: parseInt(formData.get('capacity') as string),
      cylinderType: formData.get('cylinderType') as string,
      tier: formData.get('tier') as string,
      supplyPrice: parseInt(formData.get('supplyPrice') as string),
      warranty: parseInt(formData.get('warranty') as string),
      height: parseInt(formData.get('height') as string),
      diameter: parseInt(formData.get('diameter') as string),
      weight: parseInt(formData.get('weight') as string),
      maxPressure: formData.get('maxPressure') as string,
      coilType: formData.get('coilType') as string,
    };
    
    updateCylinderMutation.mutate({ id: editingCylinder.id, updates });
  };

  const formatPrice = (price: number) => `£${(price / 100).toFixed(2)}`;

  if (isLoading) {
    return (
      <div className="britannia-admin-loading">
        <Database className="h-12 w-12 loading-spinner" />
        <p className="mt-2 text-sm">Loading cylinders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--britannia-green)', fontFamily: 'Merriweather, serif' }}>Cylinder Management</h2>
          <p className="text-sm text-gray-600">Manage Megaflo and other cylinder pricing</p>
        </div>
        <div className="britannia-admin-badge badge-info">
          {(Array.isArray(cylinders) ? cylinders : []).length} cylinders
        </div>
      </div>

      <Card className="britannia-admin-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ color: 'var(--britannia-green)', fontFamily: 'Merriweather, serif' }}>
            <Gauge className="h-5 w-5" />
            Cylinder Inventory
          </CardTitle>
          <CardDescription>
            Professional cylinder specifications and pricing for intelligent quotations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="britannia-admin-table">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Make & Model</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Warranty</TableHead>
                  <TableHead>Dimensions</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(Array.isArray(cylinders) ? cylinders : [])?.map((cylinder: any) => (
                  <TableRow key={cylinder.id}>
                    <TableCell>
                      <div className="font-medium">{cylinder.make}</div>
                      <div className="text-sm text-gray-500">{cylinder.model}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{cylinder.capacity}L</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={cylinder.cylinderType === 'unvented' ? 'default' : 'outline'}>
                        {cylinder.cylinderType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={cylinder.tier === 'premium' ? 'default' : 'secondary'}>
                        {cylinder.tier}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatPrice(cylinder.supplyPrice)}
                    </TableCell>
                    <TableCell>{cylinder.warranty} years</TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {cylinder.height}mm × {cylinder.diameter}mm
                      <br />
                      {cylinder.weight}kg
                    </TableCell>
                    <TableCell>
                      <Button
                        className="britannia-admin-button-secondary"
                        size="sm"
                        onClick={() => handleEdit(cylinder)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="britannia-admin-dialog max-w-2xl">
          <DialogHeader>
            <DialogTitle style={{ color: 'var(--britannia-green)', fontFamily: 'Merriweather, serif' }}>Edit Cylinder</DialogTitle>
            <DialogDescription>
              Update cylinder specifications and pricing
            </DialogDescription>
          </DialogHeader>
          
          {editingCylinder && (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="make">Make</Label>
                  <Input
                    id="make"
                    name="make"
                    defaultValue={editingCylinder.make}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    name="model"
                    defaultValue={editingCylinder.model}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="capacity">Capacity (L)</Label>
                  <Input
                    id="capacity"
                    name="capacity"
                    type="number"
                    defaultValue={editingCylinder.capacity}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cylinderType">Type</Label>
                  <Select name="cylinderType" defaultValue={editingCylinder.cylinderType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unvented">Unvented</SelectItem>
                      <SelectItem value="vented">Vented</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tier">Tier</Label>
                  <Select name="tier" defaultValue={editingCylinder.tier}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="supplyPrice">Supply Price (pence)</Label>
                  <Input
                    id="supplyPrice"
                    name="supplyPrice"
                    type="number"
                    defaultValue={editingCylinder.supplyPrice}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="warranty">Warranty (years)</Label>
                  <Input
                    id="warranty"
                    name="warranty"
                    type="number"
                    defaultValue={editingCylinder.warranty}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="height">Height (mm)</Label>
                  <Input
                    id="height"
                    name="height"
                    type="number"
                    defaultValue={editingCylinder.height || ''}
                  />
                </div>
                <div>
                  <Label htmlFor="diameter">Diameter (mm)</Label>
                  <Input
                    id="diameter"
                    name="diameter"
                    type="number"
                    defaultValue={editingCylinder.diameter || ''}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    defaultValue={editingCylinder.weight || ''}
                  />
                </div>
                <div>
                  <Label htmlFor="maxPressure">Max Pressure (bar)</Label>
                  <Input
                    id="maxPressure"
                    name="maxPressure"
                    type="number"
                    step="0.1"
                    defaultValue={editingCylinder.maxPressure || ''}
                  />
                </div>
                <div>
                  <Label htmlFor="coilType">Coil Type</Label>
                  <Select name="coilType" defaultValue={editingCylinder.coilType || ''}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="twin">Twin</SelectItem>
                      <SelectItem value="solar">Solar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  className="britannia-admin-button-secondary"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="britannia-admin-button"
                  disabled={updateCylinderMutation.isPending}
                >
                  {updateCylinderMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}