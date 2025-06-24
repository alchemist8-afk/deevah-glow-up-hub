
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Truck, Clock, MapPin, DollarSign, Navigation, Package } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const TransportDashboard = () => {
  const { user } = useAuth();
  const [availableOrders] = useState([
    {
      id: '1',
      type: 'food',
      restaurant: 'Mama Adea Kitchen',
      customer: 'Sarah J.',
      distance: '2.3 mi',
      payment: '$8.50',
      eta: '25 min',
      items: 'Jollof Rice Special + 2 drinks'
    },
    {
      id: '2',
      type: 'beauty',
      business: 'Golden Beauty Supply',
      customer: 'Maya S.',
      distance: '1.7 mi',
      payment: '$6.25',
      eta: '15 min',
      items: 'Hair products delivery'
    }
  ]);

  const [activeDeliveries] = useState([
    {
      id: '3',
      type: 'food',
      restaurant: 'Beauty Bites Cafe',
      customer: 'Keisha B.',
      distance: '0.8 mi',
      payment: '$7.75',
      status: 'en_route',
      customerLocation: '123 Main St, Apt 4B'
    }
  ]);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Transport Portal</h1>
                <p className="text-gray-600">Deliver beauty products and meals to earn</p>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-green-600 to-emerald-600">
              Go Online
            </Button>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Today's Earnings</p>
                    <p className="text-2xl font-bold text-gray-900">$47.50</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Deliveries</p>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                  </div>
                  <Package className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                    <p className="text-2xl font-bold text-gray-900">4.8</p>
                  </div>
                  <Navigation className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Online Time</p>
                    <p className="text-2xl font-bold text-gray-900">6.5h</p>
                  </div>
                  <Clock className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="available" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="available">Available Orders</TabsTrigger>
              <TabsTrigger value="active">Active Deliveries</TabsTrigger>
              <TabsTrigger value="history">Delivery History</TabsTrigger>
            </TabsList>

            <TabsContent value="available" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Available Pickup Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {availableOrders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">{order.restaurant || order.business}</h3>
                            <p className="text-gray-600">for {order.customer}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">{order.payment}</p>
                            <Badge variant={order.type === 'food' ? 'default' : 'secondary'}>
                              {order.type}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">{order.items}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {order.distance}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {order.eta}
                            </span>
                          </div>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            Accept Order
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="active" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Current Deliveries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activeDeliveries.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">No active deliveries</p>
                    ) : (
                      activeDeliveries.map((delivery) => (
                        <div key={delivery.id} className="border rounded-lg p-4 bg-blue-50">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-lg">{delivery.restaurant}</h3>
                              <p className="text-gray-600">to {delivery.customer}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-green-600">{delivery.payment}</p>
                              <Badge className="bg-blue-600">En Route</Badge>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-3">{delivery.customerLocation}</p>
                          
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              Call Customer
                            </Button>
                            <Button size="sm" variant="outline">
                              Navigate
                            </Button>
                            <Button size="sm" className="bg-green-600">
                              Mark Delivered
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Delivery History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Beauty Supply Run</h4>
                        <p className="text-sm text-gray-600">Jan 15, 2:30 PM</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">$12.25</p>
                        <Badge variant="outline">Completed</Badge>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Lunch Delivery</h4>
                        <p className="text-sm text-gray-600">Jan 15, 12:45 PM</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">$8.75</p>
                        <Badge variant="outline">Completed</Badge>
                      </div>
                    </div>
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

export default TransportDashboard;
