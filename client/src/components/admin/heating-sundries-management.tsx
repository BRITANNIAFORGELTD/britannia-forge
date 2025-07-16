import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertCircle, Edit, Wrench, Filter, Settings, Shield, Zap, Construction, TestTube } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { HeatingSundry } from '@shared/schema';

export function HeatingSundriesManagement() {
  const [editingSundry, setEditingSundry] = useState<HeatingSundry | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: sundries, isLoading } = useQuery({
    queryKey: ['/api/admin/heating-sundries'],
    enabled: true,
  });

  const updateSundryMutation = useMutation({
    mutationFn: async (data: { id: number; updates: Partial<HeatingSundry> }) => {
      return await apiRequest("PUT", `/api/admin/heating-sundries/${data.id}`, data.updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/heating-sundries'] });
      setIsDialogOpen(false);
      setEditingSundry(null);
      toast({
        title: "Success",
        description: "Heating sundry updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update heating sundry",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (sundry: HeatingSundry) => {
    setEditingSundry(sundry);
    setIsDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSundry) return;
    
    const formData = new FormData(e.target as HTMLFormElement);
    const updates = {
      category: formData.get('category') as string,
      itemType: formData.get('itemType') as string,
      itemName: formData.get('itemName') as string,
      tier: formData.get('tier') as string,
      specification: formData.get('specification') as string,
      priceLow: parseInt(formData.get('priceLow') as string),
      priceHigh: parseInt(formData.get('priceHigh') as string),
      notes: formData.get('notes') as string,
    };
    
    updateSundryMutation.mutate({ id: editingSundry.id, updates });
  };

  const formatPrice = (price: number) => `£${(price / 100).toFixed(2)}`;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'System Components': return <Filter className="h-4 w-4" />;
      case 'Controls': return <Settings className="h-4 w-4" />;
      case 'Safety Equipment': return <Shield className="h-4 w-4" />;
      case 'Electrical': return <Zap className="h-4 w-4" />;
      case 'Installation Materials': return <Construction className="h-4 w-4" />;
      case 'Testing Equipment': return <TestTube className="h-4 w-4" />;
      default: return <Wrench className="h-4 w-4" />;
    }
  };

  const filteredSundries = (Array.isArray(sundries) ? sundries : []).filter((sundry: any) => 
    selectedCategory === 'all' || sundry.category === selectedCategory
  );

  const categories = Array.from(new Set((Array.isArray(sundries) ? sundries : [])?.map((s: any) => s.category)));

  if (isLoading) {
    return (
      <div className="britannia-admin-loading">
        <Wrench className="h-12 w-12 loading-spinner" />
        <p className="mt-2 text-sm">Loading heating sundries...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--britannia-green)', fontFamily: 'Merriweather, serif' }}>Heating Sundries Management</h2>
          <p className="text-sm text-gray-600">Manage material pricing and specifications</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48 britannia-admin-input">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.map((category: any) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="britannia-admin-badge badge-info">
            {filteredSundries?.length || 0} items
          </div>
        </div>
      </div>

      <Card className="britannia-admin-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ color: 'var(--britannia-green)', fontFamily: 'Merriweather, serif' }}>
            <Wrench className="h-5 w-5" />
            Material Inventory
          </CardTitle>
          <CardDescription>
            Professional heating materials and sundries for accurate quotations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="britannia-admin-table">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Specification</TableHead>
                  <TableHead>Price Range</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSundries?.map((sundry: HeatingSundry) => (
                  <TableRow key={sundry.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(sundry.category)}
                        <span className="font-medium">{sundry.category}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{sundry.itemName}</div>
                      <div className="text-sm text-gray-500">{sundry.itemType}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={sundry.tier === 'premium' ? 'default' : 'secondary'}>
                        {sundry.tier}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="text-sm text-gray-600 truncate">
                        {sundry.specification}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatPrice(sundry.priceLow)} - {formatPrice(sundry.priceHigh)}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="text-sm text-gray-500 truncate">
                        {sundry.notes}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        className="britannia-admin-button-secondary"
                        size="sm"
                        onClick={() => handleEdit(sundry)}
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
            <DialogTitle style={{ color: 'var(--britannia-green)', fontFamily: 'Merriweather, serif' }}>Edit Heating Sundry</DialogTitle>
            <DialogDescription>
              Update material specifications and pricing
            </DialogDescription>
          </DialogHeader>
          
          {editingSundry && (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select name="category" defaultValue={editingSundry.category}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Boiler Components">Boiler Components</SelectItem>
                      <SelectItem value="System Components">System Components</SelectItem>
                      <SelectItem value="Controls">Controls</SelectItem>
                      <SelectItem value="Pipework">Pipework</SelectItem>
                      <SelectItem value="Safety Equipment">Safety Equipment</SelectItem>
                      <SelectItem value="Electrical">Electrical</SelectItem>
                      <SelectItem value="Installation Materials">Installation Materials</SelectItem>
                      <SelectItem value="Testing Equipment">Testing Equipment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="itemType">Item Type</Label>
                  <Input
                    id="itemType"
                    name="itemType"
                    defaultValue={editingSundry.itemType}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="itemName">Item Name</Label>
                <Input
                  id="itemName"
                  name="itemName"
                  defaultValue={editingSundry.itemName}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tier">Tier</Label>
                  <Select name="tier" defaultValue={editingSundry.tier}>
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
                  <Label htmlFor="specification">Specification</Label>
                  <Input
                    id="specification"
                    name="specification"
                    defaultValue={editingSundry.specification || ''}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priceLow">Price Low (pence)</Label>
                  <Input
                    id="priceLow"
                    name="priceLow"
                    type="number"
                    defaultValue={editingSundry.priceLow}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="priceHigh">Price High (pence)</Label>
                  <Input
                    id="priceHigh"
                    name="priceHigh"
                    type="number"
                    defaultValue={editingSundry.priceHigh}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  defaultValue={editingSundry.notes || ''}
                  placeholder="Additional information..."
                />
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
                  disabled={updateSundryMutation.isPending}
                >
                  {updateSundryMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}