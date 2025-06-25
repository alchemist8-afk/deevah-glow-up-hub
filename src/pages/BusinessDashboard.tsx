
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Store, 
  Users, 
  DollarSign, 
  Package, 
  Utensils,
  Plus,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Settings
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useWallet } from "@/contexts/WalletContext";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TeamMember {
  id: string;
  member_id: string;
  role: string;
  permissions: any;
  profiles: {
    full_name: string;
    phone: string;
    user_role: string;
  };
}

interface BusinessItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
  stock_quantity?: number;
  created_at: string;
}

const BusinessDashboard = () => {
  const { profile } = useAuth();
  const { balance, transactions } = useWallet();
  const { toast } = useToast();
  
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [services, setServices] = useState<BusinessItem[]>([]);
  const [products, setProducts] = useState<BusinessItem[]>([]);
  const [meals, setMeals] = useState<BusinessItem[]>([]);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    image_url: '',
    stock_quantity: 0,
    type: 'service' as 'service' | 'product' | 'meal'
  });
  const [newTeamMember, setNewTeamMember] = useState({
    email: '',
    role: 'staff'
  });

  useEffect(() => {
    if (profile) {
      fetchBusinessData();
    }
  }, [profile]);

  const fetchBusinessData = async () => {
    if (!profile) return;

    try {
      // Fetch team members
      const { data: teamData } = await supabase
        .from('business_teams')
        .select(`
          *,
          profiles:member_id (full_name, phone, user_role)
        `)
        .eq('business_id', profile.id);

      if (teamData) {
        setTeamMembers(teamData as TeamMember[]);
      }

      // Fetch services
      const { data: servicesData } = await supabase
        .from('services')
        .select('*')
        .eq('provider_id', profile.id);

      if (servicesData) {
        setServices(servicesData);
      }

      // Fetch products
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .eq('provider_id', profile.id);

      if (productsData) {
        setProducts(productsData);
        // Separate meals from products
        const mealItems = productsData.filter(p => p.category === 'Food' || p.category === 'Beverages');
        const productItems = productsData.filter(p => p.category !== 'Food' && p.category !== 'Beverages');
        setMeals(mealItems);
        setProducts(productItems);
      }
    } catch (error) {
      console.error('Error fetching business data:', error);
    }
  };

  const addBusinessItem = async () => {
    if (!profile || !newItem.name || !newItem.price) return;

    try {
      const table = newItem.type === 'service' ? 'services' : 'products';
      const itemData = {
        provider_id: profile.id,
        name: newItem.name,
        description: newItem.description,
        price: newItem.price,
        category: newItem.category,
        image_url: newItem.image_url || null,
        ...(newItem.type !== 'service' && { stock_quantity: newItem.stock_quantity })
      };

      const { error } = await supabase
        .from(table)
        .insert(itemData);

      if (error) throw error;

      setNewItem({
        name: '',
        description: '',
        price: 0,
        category: '',
        image_url: '',
        stock_quantity: 0,
        type: 'service'
      });

      await fetchBusinessData();
      
      toast({
        title: "Item Added",
        description: `${newItem.type} has been added successfully`
      });
    } catch (error) {
      console.error('Error adding item:', error);
      toast({
        title: "Error",
        description: "Failed to add item",
        variant: "destructive"
      });
    }
  };

  const addTeamMember = async () => {
    if (!profile || !newTeamMember.email) return;

    try {
      // First find the user by email
      const { data: userData } = await supabase
        .from('profiles')
        .select('id')
        .ilike('full_name', `%${newTeamMember.email}%`)
        .single();

      if (!userData) {
        toast({
          title: "User Not Found",
          description: "No user found with that email",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('business_teams')
        .insert({
          business_id: profile.id,
          member_id: userData.id,
          role: newTeamMember.role,
          permissions: {}
        });

      if (error) throw error;

      setNewTeamMember({ email: '', role: 'staff' });
      await fetchBusinessData();
      
      toast({
        title: "Team Member Added",
        description: "New team member has been added successfully"
      });
    } catch (error) {
      console.error('Error adding team member:', error);
      toast({
        title: "Error",
        description: "Failed to add team member",
        variant: "destructive"
      });
    }
  };

  const sampleImages = [
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e',
    'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2',
    'https://images.unsplash.com/photo-1583000520395-7e30d4e2fc88',
    'https://images.unsplash.com/photo-1571875257727-4ddc5cf765d6'
  ];

  const todaysRevenue = transactions
    .filter(t => t.type === 'booking' && new Date(t.created_at).toDateString() === new Date().toDateString())
    .reduce((sum, t) => sum + t.amount, 0);

  const totalItems = services.length + products.length + meals.length;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Business Empire</h1>
              <p className="text-xl text-gray-600">Command your business operations</p>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Item
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Business Item</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Item Type</Label>
                    <Select
                      value={newItem.type}
                      onValueChange={(value: 'service' | 'product' | 'meal') => 
                        setNewItem(prev => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="service">Service</SelectItem>
                        <SelectItem value="product">Product</SelectItem>
                        <SelectItem value="meal">Food/Beverage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Choose Image</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {sampleImages.map((img, index) => (
                        <div
                          key={index}
                          className={`cursor-pointer border-2 rounded-lg overflow-hidden ${
                            newItem.image_url === img ? 'border-blue-500' : 'border-gray-200'
                          }`}
                          onClick={() => setNewItem(prev => ({ ...prev, image_url: img }))}
                        >
                          <img src={img} alt={`Sample ${index + 1}`} className="w-full h-16 object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newItem.name}
                      onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Item name..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newItem.description}
                      onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your item..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Price (KSh)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={newItem.price}
                        onChange={(e) => setNewItem(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                      />
                    </div>
                    {newItem.type !== 'service' && (
                      <div>
                        <Label htmlFor="stock">Stock</Label>
                        <Input
                          id="stock"
                          type="number"
                          value={newItem.stock_quantity}
                          onChange={(e) => setNewItem(prev => ({ ...prev, stock_quantity: parseInt(e.target.value) }))}
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newItem.category}
                      onValueChange={(value) => setNewItem(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category..." />
                      </SelectTrigger>
                      <SelectContent>
                        {newItem.type === 'service' && (
                          <>
                            <SelectItem value="Hair">Hair</SelectItem>
                            <SelectItem value="Nails">Nails</SelectItem>
                            <SelectItem value="Makeup">Makeup</SelectItem>
                            <SelectItem value="Massage">Massage</SelectItem>
                          </>
                        )}
                        {newItem.type === 'product' && (
                          <>
                            <SelectItem value="Beauty">Beauty</SelectItem>
                            <SelectItem value="Hair Care">Hair Care</SelectItem>
                            <SelectItem value="Skincare">Skincare</SelectItem>
                            <SelectItem value="Accessories">Accessories</SelectItem>
                          </>
                        )}
                        {newItem.type === 'meal' && (
                          <>
                            <SelectItem value="Food">Food</SelectItem>
                            <SelectItem value="Beverages">Beverages</SelectItem>
                            <SelectItem value="Snacks">Snacks</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={addBusinessItem} className="w-full">
                    Add {newItem.type}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Today's Revenue</p>
                    <p className="text-2xl font-bold text-green-600">KSh {todaysRevenue}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Items</p>
                    <p className="text-2xl font-bold text-blue-600">{totalItems}</p>
                  </div>
                  <Package className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Team Members</p>
                    <p className="text-2xl font-bold text-purple-600">{teamMembers.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Wallet Balance</p>
                    <p className="text-2xl font-bold text-orange-600">KSh {balance}</p>
                  </div>
                  <Store className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="services" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="meals">Food & Drinks</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
            </TabsList>

            <TabsContent value="services" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Services Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {services.map((service) => (
                      <Card key={service.id} className="overflow-hidden">
                        {service.image_url && (
                          <div className="h-32">
                            <img 
                              src={service.image_url} 
                              alt={service.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <CardContent className="p-4">
                          <h3 className="font-semibold">{service.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline">{service.category}</Badge>
                            <p className="font-bold text-green-600">KSh {service.price}</p>
                          </div>
                          <div className="flex space-x-2 mt-3">
                            <Button size="sm" variant="outline" className="flex-1">
                              <Edit className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1">
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="products" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    Products Inventory
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product) => (
                      <Card key={product.id} className="overflow-hidden">
                        {product.image_url && (
                          <div className="h-32">
                            <img 
                              src={product.image_url} 
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <CardContent className="p-4">
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline">{product.category}</Badge>
                            <p className="font-bold text-green-600">KSh {product.price}</p>
                          </div>
                          <p className="text-xs text-gray-500">Stock: {product.stock_quantity}</p>
                          <div className="flex space-x-2 mt-3">
                            <Button size="sm" variant="outline" className="flex-1">
                              <Edit className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Sales
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="meals" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Utensils className="w-5 h-5 mr-2" />
                    Food & Beverages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {meals.map((meal) => (
                      <Card key={meal.id} className="overflow-hidden">
                        {meal.image_url && (
                          <div className="h-32">
                            <img 
                              src={meal.image_url} 
                              alt={meal.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <CardContent className="p-4">
                          <h3 className="font-semibold">{meal.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{meal.description}</p>
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline">{meal.category}</Badge>
                            <p className="font-bold text-green-600">KSh {meal.price}</p>
                          </div>
                          <p className="text-xs text-gray-500">Available: {meal.stock_quantity}</p>
                          <div className="flex space-x-2 mt-3">
                            <Button size="sm" variant="outline" className="flex-1">
                              <Edit className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1">
                              <Eye className="w-3 h-3 mr-1" />
                              Orders
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="team" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Team Management
                  </CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add Member
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Team Member</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="email">User Email/Name</Label>
                          <Input
                            id="email"
                            value={newTeamMember.email}
                            onChange={(e) => setNewTeamMember(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="Enter user email or name..."
                          />
                        </div>

                        <div>
                          <Label>Role</Label>
                          <Select
                            value={newTeamMember.role}
                            onValueChange={(value) => setNewTeamMember(prev => ({ ...prev, role: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="staff">Staff</SelectItem>
                              <SelectItem value="manager">Manager</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <Button onClick={addTeamMember} className="w-full">
                          Add Team Member
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-semibold">{member.profiles.full_name}</p>
                          <p className="text-sm text-gray-600">{member.profiles.phone}</p>
                          <Badge variant="outline" className="mt-1">
                            {member.role}
                          </Badge>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default BusinessDashboard;
