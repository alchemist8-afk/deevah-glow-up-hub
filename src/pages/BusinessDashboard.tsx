
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, TrendingUp, DollarSign, Users, Calendar, Edit3, Trash2, Star, Image, Package, Utensils } from "lucide-react";

const businessStats = [
  {
    title: "Total Revenue",
    value: "$12,847",
    change: "+12.5%",
    icon: DollarSign,
    color: "text-green-600"
  },
  {
    title: "Active Bookings",
    value: "47",
    change: "+8.2%", 
    icon: Calendar,
    color: "text-blue-600"
  },
  {
    title: "Total Customers",
    value: "324",
    change: "+15.3%",
    icon: Users,
    color: "text-purple-600"
  },
  {
    title: "Growth Rate",
    value: "23.8%",
    change: "+3.1%",
    icon: TrendingUp,
    color: "text-orange-600"
  }
];

const services = [
  {
    id: 1,
    name: "Box Braids Installation",
    category: "Braids",
    price: "$150",
    duration: "4-5 hours",
    status: "active",
    bookings: 23,
    rating: 4.8
  },
  {
    id: 2,
    name: "Nail Art Design",
    category: "Nails",
    price: "$45",
    duration: "1.5 hours",
    status: "active", 
    bookings: 31,
    rating: 4.9
  },
  {
    id: 3,
    name: "Relaxing Massage",
    category: "Massage",
    price: "$90",
    duration: "1 hour",
    status: "draft",
    bookings: 0,
    rating: 0
  }
];

const products = [
  {
    id: 1,
    name: "Premium Hair Oil",
    category: "Hair Care",
    price: "$25",
    stock: 45,
    status: "active",
    orders: 23
  },
  {
    id: 2,
    name: "Moisturizing Face Mask",
    category: "Skincare",
    price: "$18",
    stock: 67,
    status: "featured",
    orders: 41
  }
];

const menuItems = [
  {
    id: 1,
    name: "Glow Bowl",
    category: "Healthy Meals",
    price: "$18",
    status: "active",
    orders: 45,
    description: "Quinoa bowl with fresh vegetables and avocado"
  },
  {
    id: 2,
    name: "Beauty Smoothie",
    category: "Drinks",
    price: "$12",
    status: "featured",
    orders: 67,
    description: "Antioxidant-rich smoothie with berries and collagen"
  }
];

const BusinessDashboard = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Business Dashboard</h1>
              <p className="text-gray-600">Manage your beauty business, track performance and grow your clientele</p>
            </div>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Plus className="w-4 h-4 mr-2" />
              Add New Offering
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {businessStats.map((stat, index) => (
              <Card key={stat.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <Badge variant="secondary" className={stat.color}>
                          {stat.change}
                        </Badge>
                      </div>
                    </div>
                    <div className={`p-3 rounded-full bg-gray-100`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="services" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="services">Beauty Services</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="food">Food & Drinks</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="services" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Your Services</CardTitle>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Service
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {services.map((service) => (
                      <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="font-semibold">{service.name}</h3>
                            <Badge variant={service.status === 'active' ? 'default' : 'secondary'}>
                              {service.status}
                            </Badge>
                            {service.rating > 0 && (
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="text-sm">{service.rating}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            <span>{service.category}</span>
                            <span>{service.price}</span>
                            <span>{service.duration}</span>
                            <span>{service.bookings} bookings</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="products" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="w-5 h-5" />
                    <span>Beauty Products Store</span>
                  </CardTitle>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {products.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Image className="w-8 h-8 text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <h3 className="font-semibold">{product.name}</h3>
                              <Badge variant={product.status === 'featured' ? 'default' : 'secondary'}>
                                {product.status}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                              <span>{product.category}</span>
                              <span className="font-medium text-green-600">{product.price}</span>
                              <span>{product.stock} in stock</span>
                              <span>{product.orders} orders</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="food" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Utensils className="w-5 h-5" />
                    <span>Menu Items</span>
                  </CardTitle>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Menu Item
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {menuItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Utensils className="w-8 h-8 text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <h3 className="font-semibold">{item.name}</h3>
                              <Badge variant={item.status === 'featured' ? 'default' : 'secondary'}>
                                {item.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                              <span>{item.category}</span>
                              <span className="font-medium text-green-600">{item.price}</span>
                              <span>{item.orders} orders</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Services Booked</span>
                          <span>87%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div className="bg-purple-600 h-2 rounded-full" style={{ width: '87%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Customer Satisfaction</span>
                          <span>94%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Revenue Target</span>
                          <span>73%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div className="bg-orange-500 h-2 rounded-full" style={{ width: '73%' }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Offerings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Box Braids</span>
                        <span className="text-sm font-semibold">23 bookings</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Nail Art</span>
                        <span className="text-sm font-semibold">31 bookings</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Beauty Smoothie</span>
                        <span className="text-sm font-semibold">67 orders</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Face Mask</span>
                        <span className="text-sm font-semibold">41 sales</span>
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
