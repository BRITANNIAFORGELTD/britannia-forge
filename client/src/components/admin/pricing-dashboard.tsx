import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, PoundSterling, Settings, TrendingUp, MapPin, Wrench, Package } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface PricingItem {
  id: number;
  name: string;
  price: number;
  category: string;
  lastUpdated: string;
}

interface LocationMultiplier {
  id: number;
  postcode: string;
  area: string;
  multiplier: number;
}

interface LeadCost {
  id: number;
  serviceType: string;
  cost: number;
}

export function PricingDashboard() {
  const [activeTab, setActiveTab] = useState('boilers');
  const [editingItem, setEditingItem] = useState<PricingItem | null>(null);
  const [newItemPrice, setNewItemPrice] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch pricing data
  const { data: boilers = [] } = useQuery({
    queryKey: ['/api/boilers'],
  });

  const { data: labourCosts = [] } = useQuery({
    queryKey: ['/api/labour-costs'],
  });

  const { data: sundries = [] } = useQuery({
    queryKey: ['/api/sundries'],
  });

  const { data: locations = [] } = useQuery({
    queryKey: ['/api/locations'],
  });

  const { data: leadCosts = [] } = useQuery({
    queryKey: ['/api/lead-costs'],
  });

  // Price update mutation
  const updatePriceMutation = useMutation({
    mutationFn: async ({ id, price, category }: { id: number; price: number; category: string }) => {
      const response = await fetch(`/api/${category}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price }),
      });
      if (!response.ok) throw new Error('Failed to update price');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: 'Price Updated', description: 'The price has been updated successfully' });
      queryClient.invalidateQueries({ queryKey: ['/api/boilers'] });
      queryClient.invalidateQueries({ queryKey: ['/api/labour-costs'] });
      queryClient.invalidateQueries({ queryKey: ['/api/sundries'] });
      setEditingItem(null);
      setNewItemPrice('');
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update price', variant: 'destructive' });
    },
  });

  const handleUpdatePrice = (item: PricingItem) => {
    const price = parseFloat(newItemPrice);
    if (isNaN(price) || price <= 0) {
      toast({ title: 'Invalid Price', description: 'Please enter a valid price', variant: 'destructive' });
      return;
    }
    updatePriceMutation.mutate({ id: item.id, price, category: item.category });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(price);
  };

  const PriceTable = ({ items, category }: { items: any[]; category: string }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Current Price</TableHead>
          <TableHead>Last Updated</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items?.map((item: any) => (
          <TableRow key={item.id}>
            <TableCell>
              <div>
                <p className="font-medium">{item.itemName || item.make + ' ' + item.model || item.jobType}</p>
                {item.model && <p className="text-sm text-gray-600">{item.model}</p>}
                {item.tier && <Badge variant="outline" className="ml-2">{item.tier}</Badge>}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <PoundSterling className="w-4 h-4" />
                {formatPrice(item.price)}
              </div>
            </TableCell>
            <TableCell>{new Date(item.updatedAt || Date.now()).toLocaleDateString()}</TableCell>
            <TableCell>
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setEditingItem({ ...item, category })}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Price
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Update Price</DialogTitle>
                    <DialogDescription>
                      Update the price for {item.itemName || item.make + ' ' + item.model || item.jobType}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="price">New Price (£)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={newItemPrice}
                        onChange={(e) => setNewItemPrice(e.target.value)}
                        placeholder="Enter new price"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setEditingItem(null)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={() => editingItem && handleUpdatePrice(editingItem)}
                        disabled={updatePriceMutation.isPending}
                      >
                        {updatePriceMutation.isPending ? 'Updating...' : 'Update Price'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Pricing Management</h2>
          <p className="text-slate-300">Manage all pricing across the platform</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add New Item
          </Button>
          <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black">
            <TrendingUp className="w-4 h-4 mr-2" />
            Price Analytics
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="boilers">Boilers</TabsTrigger>
          <TabsTrigger value="labour">Labour Costs</TabsTrigger>
          <TabsTrigger value="sundries">Sundries</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="leads">Lead Costs</TabsTrigger>
        </TabsList>

        <TabsContent value="boilers">
          <Card className="britannia-admin-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Boiler Pricing
                  </CardTitle>
                  <CardDescription>Manage boiler product pricing</CardDescription>
                </div>
                <Badge variant="secondary">{Array.isArray(boilers) ? boilers.length : 0} products</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <PriceTable items={Array.isArray(boilers) ? boilers : []} category="boilers" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="labour">
          <Card className="britannia-admin-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Wrench className="w-5 h-5" />
                    Labour Costs
                  </CardTitle>
                  <CardDescription>Manage installation and service labour rates</CardDescription>
                </div>
                <Badge variant="secondary">{Array.isArray(labourCosts) ? labourCosts.length : 0} job types</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <PriceTable items={Array.isArray(labourCosts) ? labourCosts : []} category="labour-costs" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sundries">
          <Card className="britannia-admin-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Sundries & Parts
                  </CardTitle>
                  <CardDescription>Manage additional parts and sundries pricing</CardDescription>
                </div>
                <Badge variant="secondary">{Array.isArray(sundries) ? sundries.length : 0} items</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <PriceTable items={Array.isArray(sundries) ? sundries : []} category="sundries" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations">
          <Card className="britannia-admin-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Location Multipliers
                  </CardTitle>
                  <CardDescription>Manage location-based pricing adjustments</CardDescription>
                </div>
                <Badge variant="secondary">{Array.isArray(locations) ? locations.length : 0} areas</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Postcode Area</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Price Multiplier</TableHead>
                    <TableHead>Adjustment</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(Array.isArray(locations) ? locations : [])?.map((location: any) => (
                    <TableRow key={location.id}>
                      <TableCell>
                        <Badge variant="outline">{location.postcode}</Badge>
                      </TableCell>
                      <TableCell>{location.area}</TableCell>
                      <TableCell>{location.multiplier.toFixed(2)}x</TableCell>
                      <TableCell>
                        <Badge 
                          variant={location.multiplier > 1 ? 'destructive' : 'default'}
                          className={location.multiplier > 1 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}
                        >
                          {location.multiplier > 1 ? '+' : ''}{((location.multiplier - 1) * 100).toFixed(0)}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leads">
          <Card className="britannia-admin-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <PoundSterling className="w-5 h-5" />
                    Lead Costs
                  </CardTitle>
                  <CardDescription>Manage engineer lead purchase pricing</CardDescription>
                </div>
                <Badge variant="secondary">{Array.isArray(leadCosts) ? leadCosts.length : 0} service types</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service Type</TableHead>
                    <TableHead>Lead Cost</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(Array.isArray(leadCosts) ? leadCosts : [])?.map((cost: any) => (
                    <TableRow key={cost.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Wrench className="w-4 h-4" />
                          {cost.serviceType}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <PoundSterling className="w-4 h-4" />
                          {formatPrice(cost.cost / 100)}
                        </div>
                      </TableCell>
                      <TableCell>{new Date(cost.updatedAt || Date.now()).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Cost
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Total Products</p>
                <p className="text-2xl font-bold text-blue-800">{(Array.isArray(boilers) ? boilers.length : 0) + (Array.isArray(sundries) ? sundries.length : 0)}</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Labour Types</p>
                <p className="text-2xl font-bold text-green-800">{Array.isArray(labourCosts) ? labourCosts.length : 0}</p>
              </div>
              <Wrench className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600">Service Areas</p>
                <p className="text-2xl font-bold text-yellow-800">{Array.isArray(locations) ? locations.length : 0}</p>
              </div>
              <MapPin className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">Avg Lead Cost</p>
                <p className="text-2xl font-bold text-purple-800">
                  {(Array.isArray(leadCosts) && leadCosts.length > 0) 
                    ? formatPrice(leadCosts.reduce((sum: number, cost: any) => sum + cost.cost, 0) / leadCosts.length / 100)
                    : '£0'
                  }
                </p>
              </div>
              <PoundSterling className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}