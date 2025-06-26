
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, Clock, MapPin, Phone, Truck, Plus, Minus } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";

const mockRestaurant = {
  id: '1',
  name: 'Glow Juice Bar',
  type: 'Healthy Drinks & Snacks',
  image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
  rating: 4.8,
  reviews: 234,
  distance: '0.5 km',
  deliveryTime: '15-25 min',
  deliveryFee: 5,
  minOrder: 15,
  phone: '+254 700 123 456',
  address: '123 Wellness Street, Nairobi',
  isOpen: true,
  menu: [
    {
      category: 'Fresh Smoothies',
      items: [
        { id: '1', name: 'Green Goddess', description: 'Spinach, banana, mango, coconut water', price: 8, image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888' },
        { id: '2', name: 'Berry Blast', description: 'Mixed berries, yogurt, honey, almond milk', price: 9, image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888' },
        { id: '3', name: 'Tropical Paradise', description: 'Pineapple, mango, passion fruit, coconut', price: 10, image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888' }
      ]
    },
    {
      category: 'Detox Juices',
      items: [
        { id: '4', name: 'Immunity Shot', description: 'Ginger, turmeric, lemon, honey', price: 5, image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888' },
        { id: '5', name: 'Green Detox', description: 'Cucumber, celery, apple, lemon, ginger', price: 7, image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888' },
        { id: '6', name: 'Beet Boost', description: 'Beetroot, carrot, apple, ginger', price: 8, image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888' }
      ]
    },
    {
      category: 'Healthy Snacks',
      items: [
        { id: '7', name: 'Energy Balls', description: 'Dates, nuts, coconut, cacao', price: 6, image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888' },
        { id: '8', name: 'Chia Pudding', description: 'Chia seeds, almond milk, berries', price: 8, image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888' },
        { id: '9', name: 'Acai Bowl', description: 'Acai, granola, fresh fruits, honey', price: 12, image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888' }
      ]
    }
  ]
};

const RestaurantPage = () => {
  const { id } = useParams();
  const [cart, setCart] = useState<{[key: string]: number}>({});
  const [cartTotal, setCartTotal] = useState(0);

  const addToCart = (itemId: string, price: number) => {
    setCart(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
    setCartTotal(prev => prev + price);
  };

  const removeFromCart = (itemId: string, price: number) => {
    if (cart[itemId] > 0) {
      setCart(prev => ({
        ...prev,
        [itemId]: prev[itemId] - 1
      }));
      setCartTotal(prev => prev - price);
    }
  };

  const getCartItemCount = (itemId: string) => cart[itemId] || 0;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="relative h-64 bg-gradient-to-r from-orange-400 to-red-500">
          <img 
            src={mockRestaurant.image} 
            alt={mockRestaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute top-4 left-4">
            <Link to="/">
              <Button variant="secondary" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 -mt-20 relative z-10">
          {/* Restaurant Info Card */}
          <Card className="mb-8 shadow-xl">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{mockRestaurant.name}</h1>
                  <p className="text-gray-600 mb-3">{mockRestaurant.type}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      {mockRestaurant.rating} ({mockRestaurant.reviews} reviews)
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {mockRestaurant.distance}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {mockRestaurant.deliveryTime}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={`${mockRestaurant.isOpen ? 'bg-green-500' : 'bg-red-500'} text-white mb-2`}>
                    {mockRestaurant.isOpen ? 'Open Now' : 'Closed'}
                  </Badge>
                  <p className="text-sm text-gray-500">Delivery: ${mockRestaurant.deliveryFee}</p>
                  <p className="text-sm text-gray-500">Min order: ${mockRestaurant.minOrder}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{mockRestaurant.phone}</span>
                <span className="mx-2">•</span>
                <span>{mockRestaurant.address}</span>
              </div>
            </CardContent>
          </Card>

          {/* Menu */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {mockRestaurant.menu.map((category, categoryIndex) => (
                <div key={categoryIndex} className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{category.category}</h2>
                  <div className="space-y-4">
                    {category.items.map((item) => (
                      <Card key={item.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.name}</h3>
                              <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-xl font-bold text-orange-600">${item.price}</span>
                                <div className="flex items-center gap-2">
                                  {getCartItemCount(item.id) > 0 ? (
                                    <div className="flex items-center gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => removeFromCart(item.id, item.price)}
                                      >
                                        <Minus className="w-4 h-4" />
                                      </Button>
                                      <span className="font-medium">{getCartItemCount(item.id)}</span>
                                      <Button
                                        size="sm"
                                        onClick={() => addToCart(item.id, item.price)}
                                        className="bg-orange-500 hover:bg-orange-600"
                                      >
                                        <Plus className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <Button
                                      size="sm"
                                      onClick={() => addToCart(item.id, item.price)}
                                      className="bg-orange-500 hover:bg-orange-600"
                                    >
                                      <Plus className="w-4 h-4 mr-1" />
                                      Add
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Sidebar */}
            <div className="lg:sticky lg:top-4 h-fit">
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Order</h3>
                  {Object.keys(cart).length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Your cart is empty</p>
                  ) : (
                    <div className="space-y-4">
                      {Object.entries(cart).map(([itemId, quantity]) => {
                        if (quantity === 0) return null;
                        const item = mockRestaurant.menu
                          .flatMap(cat => cat.items)
                          .find(item => item.id === itemId);
                        if (!item) return null;
                        
                        return (
                          <div key={itemId} className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-500">${item.price} each</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => removeFromCart(itemId, item.price)}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="font-medium">{quantity}</span>
                              <Button
                                size="sm"
                                onClick={() => addToCart(itemId, item.price)}
                                className="bg-orange-500 hover:bg-orange-600"
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                      
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-2">
                          <span>Subtotal</span>
                          <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span>Delivery</span>
                          <span>${mockRestaurant.deliveryFee}</span>
                        </div>
                        <div className="flex justify-between items-center font-bold text-lg border-t pt-2">
                          <span>Total</span>
                          <span>${(cartTotal + mockRestaurant.deliveryFee).toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                        disabled={cartTotal < mockRestaurant.minOrder}
                      >
                        <Truck className="w-4 h-4 mr-2" />
                        {cartTotal < mockRestaurant.minOrder 
                          ? `Min order $${mockRestaurant.minOrder}` 
                          : 'Order Now'
                        }
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RestaurantPage;
