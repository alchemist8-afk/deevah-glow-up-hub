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
  Settings,
  Star,
  MessageCircle,
  Calendar,
  BarChart3,
  Award
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
  profiles?: {
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

interface ArtistPerformance {
  id: string;
  full_name: string;
  avatar_url?: string;
  bookings_count: number;
  avg_rating: number;
  services_offered: number;
  revenue_generated: number;
  status: string;
}

const BusinessDashboard = () => {
  const { profile } = useAuth();
  const { balance, transactions } = useWallet();
  const { toast } = useToast();
  
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [services, setServices] = useState<BusinessItem[]>([]);
  const [products, setProducts] = useState<BusinessItem[]>([]);
  const [meals, setMeals] = useState<BusinessItem[]>([]);
  const [artistPerformance, setArtistPerformance] = useState<ArtistPerformance[]>([]);
  const [businessStats, setBusinessStats] = useState({
    totalBookings: 0,
    weeklyBookings: 0,
    monthlyBookings: 0,
    totalRevenue: 0,
    weeklyRevenue: 0,
    monthlyRevenue: 0,
  });
  
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    image_url: '',
    stock_quantity: 0,
    type: 'service' as 'service' | 'product' | 'meal'
  });

  useEffect(() => {
    if (profile) {
      fetchBusinessData();
      fetchArtistPerformance();
      fetchBusinessStats();
    }
  }, [profile]);

  const fetchBusinessData = async () => {
    if (!profile) return;

    try {
      // Fetch team members with proper join
      const { data: teamData } = await supabase
        .from('business_teams')
        .select(`
          id,
          member_id,
          role,
          permissions,
          member_profile:profiles!business_teams_member_id_fkey (
            full_name,
            phone,
            user_role
          )
        `)
        .eq('business_id', profile.id);

      if (teamData) {
        setTeamMembers(teamData.map(member => ({
          ...member,
          profiles: member.member_profile as any
        })) as TeamMember[]);
      }

      // Fetch services, products, meals
      const [servicesRes, productsRes] = await Promise.all([
        supabase.from('services').select('*').eq('provider_id', profile.id),
        supabase.from('products').select('*').eq('provider_id', profile.id)
      ]);

      if (servicesRes.data) setServices(servicesRes.data);
      if (productsRes.data) {
        const mealItems = productsRes.data.filter(p => p.category === 'Food' || p.category === 'Beverages');
        const productItems = productsRes.data.filter(p => p.category !== 'Food' && p.category !== 'Beverages');
        setMeals(mealItems);
        setProducts(productItems);
      }
    } catch (error) {
      console.error('Error fetching business data:', error);
    }
  };

  const fetchArtistPerformance = async () => {
    if (!profile) return;

    try {
      // Fetch artists associated with this business
      const { data: artistsData } = await supabase
        .from('business_teams')
        .select(`
          member_id,
          profiles!business_teams_member_id_fkey (
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('business_id', profile.id)
        .eq('role', 'artist');

      if (artistsData) {
        const artistPerformanceData = await Promise.all(
          artistsData.map(async (artist) => {
            const artistId = artist.member_id;
            
            // Get bookings count and revenue
            const { data: bookingsData } = await supabase
              .from('bookings')
              .select('total_amount, status')
              .eq('provider_id', artistId);

            // Get services count
            const { data: servicesData } = await supabase
              .from('services')
              .select('id')
              .eq('provider_id', artistId);

            // Get artist availability status
            const { data: availabilityData } = await supabase
              .from('artist_availability')
              .select('status')
              .eq('artist_id', artistId)
              .single();

            const bookingsCount = bookingsData?.length || 0;
            const revenue = bookingsData?.reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0;
            const servicesCount = servicesData?.length || 0;

            return {
              id: artistId,
              full_name: (artist.profiles as any)?.full_name || 'Unknown Artist',
              avatar_url: (artist.profiles as any)?.avatar_url,
              bookings_count: bookingsCount,
              avg_rating: 4.8, // Mock rating - would come from reviews table
              services_offered: servicesCount,
              revenue_generated: revenue,
              status: availabilityData?.status || 'offline'
            };
          })
        );

        setArtistPerformance(artistPerformanceData);
      }
    } catch (error) {
      console.error('Error fetching artist performance:', error);
    }
  };

  const fetchBusinessStats = async () => {
    if (!profile) return;

    try {
      // Get all bookings for artists under this business
      const { data: teamArtists } = await supabase
        .from('business_teams')
        .select('member_id')
        .eq('business_id', profile.id)
        .eq('role', 'artist');

      if (teamArtists && teamArtists.length > 0) {
        const artistIds = teamArtists.map(a => a.member_id);
        
        const { data: allBookings } = await supabase
          .from('bookings')
          .select('total_amount, created_at, status')
          .in('provider_id', artistIds);

        if (allBookings) {
          const now = new Date();
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

          const weeklyBookings = allBookings.filter(b => new Date(b.created_at) >= weekAgo);
          const monthlyBookings = allBookings.filter(b => new Date(b.created_at) >= monthAgo);

          setBusinessStats({
            totalBookings: allBookings.length,
            weeklyBookings: weeklyBookings.length,
            monthlyBookings: monthlyBookings.length,
            totalRevenue: allBookings.reduce((sum, b) => sum + (b.total_amount || 0), 0),
            weeklyRevenue: weeklyBookings.reduce((sum, b) => sum + (b.total_amount || 0), 0),
            monthlyRevenue: monthlyBookings.reduce((sum, b) => sum + (b.total_amount || 0), 0),
          });
        }
      }
    } catch (error) {
      console.error('Error fetching business stats:', error);
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

  const sampleImages = [
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e',
    'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2',
    'https://images.unsplash.com/photo-1583000520395-7e30d4e2fc88',
    'https://images.unsplash.com/photo-1571875257727-4ddc5cf765d6'
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 lg:px-6 py-4 lg:py-8">
          {/* Mobile-friendly header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 lg:mb-8">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-2xl lg:text-4xl font-bold text-gray-900">Business Empire</h1>
              <p className="text-base lg:text-xl text-gray-600">Command your business operations</p>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full lg:w-auto bg-gradient-to-r from-blue-600 to-indigo-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md mx-4 lg:mx-auto">
                <DialogHeader>
                  <DialogTitle>Add Business Item</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-96 overflow-y-auto">
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

                  <Button onClick={addBusinessItem} className="w-full">
                    Add {newItem.type}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards - Mobile responsive grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
            <Card>
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs lg:text-sm font-medium text-gray-600">Weekly Revenue</p>
                    <p className="text-lg lg:text-2xl font-bold text-green-600">KSh {businessStats.weeklyRevenue}</p>
                  </div>
                  <DollarSign className="w-6 h-6 lg:w-8 lg:h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs lg:text-sm font-medium text-gray-600">Total Artists</p>
                    <p className="text-lg lg:text-2xl font-bold text-blue-600">{artistPerformance.length}</p>
                  </div>
                  <Users className="w-6 h-6 lg:w-8 lg:h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs lg:text-sm font-medium text-gray-600">This Month</p>
                    <p className="text-lg lg:text-2xl font-bold text-purple-600">{businessStats.monthlyBookings}</p>
                  </div>
                  <Calendar className="w-6 h-6 lg:w-8 lg:h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs lg:text-sm font-medium text-gray-600">Wallet Balance</p>
                    <p className="text-lg lg:text-2xl font-bold text-orange-600">KSh {balance}</p>
                  </div>
                  <Store className="w-6 h-6 lg:w-8 lg:h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="performance" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
              <TabsTrigger value="performance" className="text-xs lg:text-sm">Performance</TabsTrigger>
              <TabsTrigger value="services" className="text-xs lg:text-sm">Services</TabsTrigger>
              <TabsTrigger value="products" className="text-xs lg:text-sm">Products</TabsTrigger>
              <TabsTrigger value="meals" className="text-xs lg:text-sm">Food</TabsTrigger>
              <TabsTrigger value="team" className="text-xs lg:text-sm">Team</TabsTrigger>
            </TabsList>

            <TabsContent value="performance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg lg:text-xl">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Artist Performance Intelligence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {artistPerformance.map((artist) => (
                      <div key={artist.id} className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border rounded-lg bg-white">
                        <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                            {artist.full_name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-base lg:text-lg">{artist.full_name}</p>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Badge 
                                variant={artist.status === 'available' ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {artist.status}
                              </Badge>
                              <span className="flex items-center">
                                <Star className="w-3 h-3 mr-1 text-yellow-500 fill-current" />
                                {artist.avg_rating}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 text-center">
                          <div>
                            <p className="text-lg lg:text-xl font-bold text-blue-600">{artist.bookings_count}</p>
                            <p className="text-xs text-gray-600">Bookings</p>
                          </div>
                          <div>
                            <p className="text-lg lg:text-xl font-bold text-green-600">KSh {artist.revenue_generated}</p>
                            <p className="text-xs text-gray-600">Revenue</p>
                          </div>
                          <div>
                            <p className="text-lg lg:text-xl font-bold text-purple-600">{artist.services_offered}</p>
                            <p className="text-xs text-gray-600">Services</p>
                          </div>
                          <div className="col-span-2 lg:col-span-1">
                            <Button size="sm" variant="outline" className="w-full">
                              <MessageCircle className="w-3 h-3 mr-1" />
                              Message
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {artistPerformance.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No artists registered yet</p>
                        <p className="text-sm">Invite artists to join your business</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Services Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
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
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
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
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
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
                <CardHeader className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Team Management
                  </CardTitle>
                  <Button className="w-full lg:w-auto">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Member
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border rounded-lg space-y-4 lg:space-y-0">
                        <div>
                          <p className="font-semibold">{member.profiles?.full_name || 'Unknown Member'}</p>
                          <p className="text-sm text-gray-600">{member.profiles?.phone || 'No phone'}</p>
                          <Badge variant="outline" className="mt-1">
                            {member.role}
                          </Badge>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="flex-1 lg:flex-none">
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 lg:flex-none">
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
