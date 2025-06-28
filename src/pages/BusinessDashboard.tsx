
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from "@/components/ImageUpload";
import { 
  Store, 
  Package, 
  Users, 
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Eye,
  DollarSign,
  Coffee,
  Utensils
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProducts } from "@/hooks/useProducts.tsx";
import { useRestaurants } from "@/hooks/useRestaurants.tsx";
import { useServices, useCreateService } from "@/hooks/useServices";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const BusinessDashboard = () => {
  const { profile, updateProfile } = useAuth();
  const { products, createProduct } = useProducts();
  const { restaurants, createRestaurant } = useRestaurants();
  const { services } = useServices();
  const createService = useCreateService();

  const [businessName, setBusinessName] = useState(profile?.full_name || '');
  const [businessLogo, setBusinessLogo] = useState(profile?.avatar_url || '');
  const [businessLocation, setBusinessLocation] = useState(profile?.location || '');
  const [deliveryRadius, setDeliveryRadius] = useState(10);

  // Form states
  const [showProductForm, setShowProductForm] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [showMealForm, setShowMealForm] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    stock_quantity: '',
    image_url: '',
    mood_tags: [] as string[]
  });

  const [newService, setNewService] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    duration: '',
    image_url: '',
    mood_tags: [] as string[]
  });

  const [newMeal, setNewMeal] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    prep_time: '',
    image_url: '',
    mood_tags: [] as string[]
  });

  const myProducts = products.filter(p => p.seller_id === profile?.id);
  const myServices = services.filter(s => s.provider_id === profile?.id);

  const categories = ['Beauty Products', 'Hair Care', 'Skincare', 'Makeup', 'Tools', 'Accessories'];
  const serviceCategories = ['Hair', 'Braids', 'Nails', 'Beauty', 'Massage', 'Lashes', 'Makeup'];
  const mealCategories = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Beverages', 'Desserts'];
  const moods = ['calm', 'fast', 'social', 'private'];

  const handleBusinessUpdate = async () => {
    try {
      await updateProfile({
        full_name: businessName,
        avatar_url: businessLogo,
        location: businessLocation
      });
      toast.success('Business information updated successfully!');
    } catch (error) {
      toast.error('Failed to update business information');
    }
  };

  const handleCreateProduct = async () => {
    try {
      await createProduct.mutateAsync({
        name: newProduct.name,
        category: newProduct.category,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        stock_quantity: parseInt(newProduct.stock_quantity),
        image_url: newProduct.image_url,
        mood_tags: newProduct.mood_tags
      });
      
      setNewProduct({
        name: '',
        category: '',
        description: '',
        price: '',
        stock_quantity: '',
        image_url: '',
        mood_tags: []
      });
      setShowProductForm(false);
      toast.success('Product created successfully!');
    } catch (error) {
      toast.error('Failed to create product');
    }
  };

  const handleCreateService = async () => {
    try {
      await createService.mutateAsync({
        name: newService.name,
        category: newService.category,
        description: newService.description,
        price: parseFloat(newService.price),
        duration: parseInt(newService.duration),
        image_url: newService.image_url,
        mood_tags: newService.mood_tags
      });
      
      setNewService({
        name: '',
        category: '',
        description: '',
        price: '',
        duration: '',
        image_url: '',
        mood_tags: []
      });
      setShowServiceForm(false);
      toast.success('Service created successfully!');
    } catch (error) {
      toast.error('Failed to create service');
    }
  };

  const handleCreateMeal = async () => {
    try {
      const { error } = await supabase
        .from('meals')
        .insert({
          restaurant_id: profile?.id,
          name: newMeal.name,
          category: newMeal.category,
          description: newMeal.description,
          price: parseFloat(newMeal.price),
          prep_time: parseInt(newMeal.prep_time),
          image_url: newMeal.image_url,
          mood_tags: newMeal.mood_tags
        });

      if (error) throw error;
      
      setNewMeal({
        name: '',
        category: '',
        description: '',
        price: '',
        prep_time: '',
        image_url: '',
        mood_tags: []
      });
      setShowMealForm(false);
      toast.success('Meal created successfully!');
    } catch (error) {
      toast.error('Failed to create meal');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Business Hub</h1>
              <p className="text-xl text-gray-600">Control your online shop and services</p>
            </div>
            
            <Badge className="text-lg px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500">
              <Store className="w-4 h-4 mr-2" />
              Business Owner
            </Badge>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold text-blue-600">{myProducts.length}</p>
                  </div>
                  <Package className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Services</p>
                    <p className="text-2xl font-bold text-green-600">{myServices.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-purple-600">KSh 25,400</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Growth Rate</p>
                    <p className="text-2xl font-bold text-orange-600">+12%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="business" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="business">Business Info</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="meals">Meals</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="business" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Business Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Business Logo</label>
                      <ImageUpload
                        onImageUpload={setBusinessLogo}
                        currentImage={businessLogo}
                        className="max-w-sm"
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Business Name</label>
                        <Input
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          placeholder="Your business name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Location</label>
                        <Input
                          value={businessLocation}
                          onChange={(e) => setBusinessLocation(e.target.value)}
                          placeholder="e.g., Westlands, Nairobi"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Delivery Radius (km)</label>
                        <Input
                          type="number"
                          value={deliveryRadius}
                          onChange={(e) => setDeliveryRadius(parseInt(e.target.value))}
                          placeholder="10"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button onClick={handleBusinessUpdate} className="bg-blue-600 hover:bg-blue-700">
                    Update Business Info
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="products" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>My Products</CardTitle>
                    <Button 
                      onClick={() => setShowProductForm(true)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Product
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {showProductForm && (
                    <Card className="mb-6">
                      <CardHeader>
                        <CardTitle>Add New Product</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Product Name</label>
                            <Input
                              value={newProduct.name}
                              onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                              placeholder="e.g., Hair Growth Oil"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-2">Category</label>
                            <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map(cat => (
                                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">Description</label>
                          <Textarea
                            value={newProduct.description}
                            onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                            placeholder="Describe your product..."
                          />
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Price (KSh)</label>
                            <Input
                              type="number"
                              value={newProduct.price}
                              onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                              placeholder="500"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-2">Stock Quantity</label>
                            <Input
                              type="number"
                              value={newProduct.stock_quantity}
                              onChange={(e) => setNewProduct({...newProduct, stock_quantity: e.target.value})}
                              placeholder="50"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">Product Image</label>
                          <ImageUpload
                            onImageUpload={(url) => setNewProduct({...newProduct, image_url: url})}
                            currentImage={newProduct.image_url}
                          />
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button onClick={handleCreateProduct} className="bg-green-600 hover:bg-green-700">
                            Add Product
                          </Button>
                          <Button variant="outline" onClick={() => setShowProductForm(false)}>
                            Cancel
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    {myProducts.map((product) => (
                      <Card key={product.id} className="overflow-hidden">
                        {product.image_url && (
                          <div className="h-32 overflow-hidden">
                            <img 
                              src={product.image_url} 
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold">{product.name}</h3>
                            <span className="text-lg font-bold text-green-600">KSh {product.price}</span>
                          </div>
                          <Badge variant="outline" className="mb-2">{product.category}</Badge>
                          <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                          <p className="text-sm text-gray-500">Stock: {product.stock_quantity}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services" className="space-y-6">
              {/* ... similar structure for services ... */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Business Services</CardTitle>
                    <Button 
                      onClick={() => setShowServiceForm(true)}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Service
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Service form and list similar to products */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {myServices.map((service) => (
                      <Card key={service.id} className="overflow-hidden">
                        {service.image_url && (
                          <div className="h-32 overflow-hidden">
                            <img 
                              src={service.image_url} 
                              alt={service.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold">{service.name}</h3>
                            <span className="text-lg font-bold text-green-600">KSh {service.price}</span>
                          </div>
                          <Badge variant="outline" className="mb-2">{service.category}</Badge>
                          <p className="text-sm text-gray-600">{service.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="meals" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Grab A Bite Menu</CardTitle>
                    <Button 
                      onClick={() => setShowMealForm(true)}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Meal
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {showMealForm && (
                    <Card className="mb-6">
                      <CardHeader>
                        <CardTitle>Add New Meal</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Meal Name</label>
                            <Input
                              value={newMeal.name}
                              onChange={(e) => setNewMeal({...newMeal, name: e.target.value})}
                              placeholder="e.g., Avocado Smoothie"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-2">Category</label>
                            <Select value={newMeal.category} onValueChange={(value) => setNewMeal({...newMeal, category: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                {mealCategories.map(cat => (
                                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">Description</label>
                          <Textarea
                            value={newMeal.description}
                            onChange={(e) => setNewMeal({...newMeal, description: e.target.value})}
                            placeholder="Describe your meal..."
                          />
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Price (KSh)</label>
                            <Input
                              type="number"
                              value={newMeal.price}
                              onChange={(e) => setNewMeal({...newMeal, price: e.target.value})}
                              placeholder="300"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-2">Prep Time (minutes)</label>
                            <Input
                              type="number"
                              value={newMeal.prep_time}
                              onChange={(e) => setNewMeal({...newMeal, prep_time: e.target.value})}
                              placeholder="15"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">Meal Image</label>
                          <ImageUpload
                            onImageUpload={(url) => setNewMeal({...newMeal, image_url: url})}
                            currentImage={newMeal.image_url}
                          />
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button onClick={handleCreateMeal} className="bg-green-600 hover:bg-green-700">
                            Add Meal
                          </Button>
                          <Button variant="outline" onClick={() => setShowMealForm(false)}>
                            Cancel
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Sales Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Product Sales</span>
                        <span className="font-semibold">KSh 15,200</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Service Bookings</span>
                        <span className="font-semibold">KSh 8,400</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Meal Orders</span>
                        <span className="font-semibold">KSh 1,800</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Hair Growth Oil</span>
                        <Badge>45 sold</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Deep Cleanse Facial</span>
                        <Badge>23 bookings</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Protein Smoothie</span>
                        <Badge>67 orders</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default BusinessDashboard;
