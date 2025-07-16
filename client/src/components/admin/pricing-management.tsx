import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, Save, X, Plus, Package, Wrench, Zap } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export function PricingManagement() {
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: boilers } = useQuery({
    queryKey: ['/api/admin/boilers'],
    enabled: true,
  });

  const { data: labourCosts } = useQuery({
    queryKey: ['/api/admin/labour-costs'],
    enabled: true,
  });

  const { data: sundries } = useQuery({
    queryKey: ['/api/admin/sundries'],
    enabled: true,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ type, id, data }: { type: string; id: string; data: any }) => {
      return apiRequest('PUT', `/api/admin/${type}/${id}`, data);
    },
    onSuccess: () => {
      toast({
        title: 'Update successful',
        description: 'Pricing has been updated',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/'] });
      setEditingItem(null);
      setEditValues({});
    },
    onError: () => {
      toast({
        title: 'Update failed',
        description: 'Failed to update pricing',
        variant: 'destructive',
      });
    },
  });

  const startEdit = (itemId: string, currentValue: string) => {
    setEditingItem(itemId);
    setEditValues({ [itemId]: currentValue });
  };

  const saveEdit = async (type: string, id: string) => {
    const value = editValues[`${type}-${id}`];
    if (!value) return;

    updateMutation.mutate({
      type,
      id,
      data: type === 'boilers' ? { supplyPrice: parseFloat(value) * 100 } : { price: parseFloat(value) * 100 }
    });
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setEditValues({});
  };

  const formatPrice = (price: number) => {
    return `£${(price / 100).toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Pricing Management</h2>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add New Item
        </Button>
      </div>

      <Tabs defaultValue="boilers" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border-slate-600">
          <TabsTrigger value="boilers" className="text-slate-300">
            <Package className="h-4 w-4 mr-2" />
            Boilers
          </TabsTrigger>
          <TabsTrigger value="labour" className="text-slate-300">
            <Wrench className="h-4 w-4 mr-2" />
            Labour
          </TabsTrigger>
          <TabsTrigger value="sundries" className="text-slate-300">
            <Zap className="h-4 w-4 mr-2" />
            Sundries
          </TabsTrigger>
        </TabsList>

        <TabsContent value="boilers">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white">Boiler Pricing</CardTitle>
              <CardDescription className="text-slate-300">
                Manage boiler supply prices and specifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-600">
                      <TableHead className="text-slate-300">Make</TableHead>
                      <TableHead className="text-slate-300">Model</TableHead>
                      <TableHead className="text-slate-300">Type</TableHead>
                      <TableHead className="text-slate-300">Tier</TableHead>
                      <TableHead className="text-slate-300">kW</TableHead>
                      <TableHead className="text-slate-300">Supply Price</TableHead>
                      <TableHead className="text-slate-300">Warranty</TableHead>
                      <TableHead className="text-slate-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {boilers?.map((boiler: any) => (
                      <TableRow key={boiler.id} className="border-slate-600">
                        <TableCell className="text-white">{boiler.make}</TableCell>
                        <TableCell className="text-white">{boiler.model}</TableCell>
                        <TableCell className="text-white">{boiler.boilerType}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-slate-300">
                            {boiler.tier}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white">{boiler.kw}kW</TableCell>
                        <TableCell className="text-white">
                          {editingItem === `boilers-${boiler.id}` ? (
                            <Input
                              value={editValues[`boilers-${boiler.id}`] || ''}
                              onChange={(e) => setEditValues(prev => ({ ...prev, [`boilers-${boiler.id}`]: e.target.value }))}
                              className="w-24 bg-slate-800/50 border-slate-600 text-white"
                              placeholder="0.00"
                            />
                          ) : (
                            formatPrice(boiler.supplyPrice)
                          )}
                        </TableCell>
                        <TableCell className="text-white">{boiler.warrantyYears} years</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {editingItem === `boilers-${boiler.id}` ? (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => saveEdit('boilers', boiler.id)}
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
                                onClick={() => startEdit(`boilers-${boiler.id}`, (boiler.supplyPrice / 100).toString())}
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
        </TabsContent>

        <TabsContent value="labour">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white">Labour Costs</CardTitle>
              <CardDescription className="text-slate-300">
                Manage labour pricing by job type and tier
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-600">
                      <TableHead className="text-slate-300">Job Type</TableHead>
                      <TableHead className="text-slate-300">Tier</TableHead>
                      <TableHead className="text-slate-300">City</TableHead>
                      <TableHead className="text-slate-300">Price</TableHead>
                      <TableHead className="text-slate-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {labourCosts?.map((labour: any) => (
                      <TableRow key={labour.id} className="border-slate-600">
                        <TableCell className="text-white">{labour.jobType}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-slate-300">
                            {labour.tier}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white">{labour.city}</TableCell>
                        <TableCell className="text-white">
                          {editingItem === `labour-${labour.id}` ? (
                            <Input
                              value={editValues[`labour-${labour.id}`] || ''}
                              onChange={(e) => setEditValues(prev => ({ ...prev, [`labour-${labour.id}`]: e.target.value }))}
                              className="w-24 bg-slate-800/50 border-slate-600 text-white"
                              placeholder="0.00"
                            />
                          ) : (
                            formatPrice(labour.price)
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {editingItem === `labour-${labour.id}` ? (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => saveEdit('labour-costs', labour.id)}
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
                                onClick={() => startEdit(`labour-${labour.id}`, (labour.price / 100).toString())}
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
        </TabsContent>

        <TabsContent value="sundries">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white">Sundries & Extras</CardTitle>
              <CardDescription className="text-slate-300">
                Manage pricing for additional items and services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-600">
                      <TableHead className="text-slate-300">Item Name</TableHead>
                      <TableHead className="text-slate-300">Category</TableHead>
                      <TableHead className="text-slate-300">Price</TableHead>
                      <TableHead className="text-slate-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sundries?.map((sundry: any) => (
                      <TableRow key={sundry.id} className="border-slate-600">
                        <TableCell className="text-white">{sundry.itemName}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-slate-300">
                            {sundry.tier}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white">
                          {editingItem === `sundries-${sundry.id}` ? (
                            <Input
                              value={editValues[`sundries-${sundry.id}`] || ''}
                              onChange={(e) => setEditValues(prev => ({ ...prev, [`sundries-${sundry.id}`]: e.target.value }))}
                              className="w-24 bg-slate-800/50 border-slate-600 text-white"
                              placeholder="0.00"
                            />
                          ) : (
                            formatPrice(sundry.price)
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {editingItem === `sundries-${sundry.id}` ? (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => saveEdit('sundries', sundry.id)}
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
                                onClick={() => startEdit(`sundries-${sundry.id}`, (sundry.price / 100).toString())}
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
        </TabsContent>
      </Tabs>
    </div>
  );
}