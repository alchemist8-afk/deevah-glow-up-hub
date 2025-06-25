
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Truck, 
  MapPin, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  XCircle,
  Navigation,
  Package,
  Utensils,
  Star,
  Timer
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useWallet } from "@/contexts/WalletContext";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TransportTask {
  id: string;
  task_type: 'service_pickup' | 'food_delivery' | 'product_delivery';
  pickup_location: string;
  delivery_location: string;
  status: 'pending' | 'accepted' | 'picked_up' | 'delivered' | 'cancelled';
  estimated_earnings: number;
  actual_earnings?: number;
  created_at: string;
  booking_id?: string;
  bookings?: {
    client_id: string;
    total_amount: number;
    profiles: {
      full_name: string;
      phone: string;
    };
  };
}

const TransportDashboard = () => {
  const { profile } = useAuth();
  const { balance, transactions } = useWallet();
  const { toast } = useToast();
  
  const [availableTasks, setAvailableTasks] = useState<TransportTask[]>([]);
  const [myTasks, setMyTasks] = useState<TransportTask[]>([]);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (profile) {
      fetchTransportData();
      
      // Set up real-time subscription for new tasks
      const channel = supabase
        .channel('transport-tasks')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'transport_tasks',
            filter: 'driver_id=is.null'
          },
          (payload) => {
            console.log('New task available:', payload);
            fetchTransportData();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [profile]);

  const fetchTransportData = async () => {
    if (!profile) return;

    try {
      // Fetch available tasks (not assigned to any driver)
      const { data: availableData } = await supabase
        .from('transport_tasks')
        .select(`
          *,
          bookings (
            client_id,
            total_amount,
            profiles:client_id (full_name, phone)
          )
        `)
        .is('driver_id', null)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (availableData) {
        setAvailableTasks(availableData as TransportTask[]);
      }

      // Fetch my assigned tasks
      const { data: myTasksData } = await supabase
        .from('transport_tasks')
        .select(`
          *,
          bookings (
            client_id,
            total_amount,
            profiles:client_id (full_name, phone)
          )
        `)
        .eq('driver_id', profile.id)
        .order('created_at', { ascending: false });

      if (myTasksData) {
        setMyTasks(myTasksData as TransportTask[]);
      }
    } catch (error) {
      console.error('Error fetching transport data:', error);
    }
  };

  const acceptTask = async (taskId: string) => {
    if (!profile) return;

    try {
      const { error } = await supabase
        .from('transport_tasks')
        .update({
          driver_id: profile.id,
          status: 'accepted'
        })
        .eq('id', taskId);

      if (error) throw error;

      await fetchTransportData();
      
      toast({
        title: "Task Accepted!",
        description: "You've accepted this delivery task"
      });
    } catch (error) {
      console.error('Error accepting task:', error);
      toast({
        title: "Error",
        description: "Failed to accept task",
        variant: "destructive"
      });
    }
  };

  const updateTaskStatus = async (taskId: string, status: TransportTask['status']) => {
    try {
      const updates: any = { status };
      
      // If completing the task, set actual earnings
      if (status === 'delivered') {
        const task = myTasks.find(t => t.id === taskId);
        if (task) {
          updates.actual_earnings = task.estimated_earnings;
          
          // Add earnings to wallet
          await supabase
            .from('wallet_transactions')
            .insert({
              user_id: profile?.id,
              type: 'booking',
              amount: task.estimated_earnings,
              status: 'completed',
              description: `Delivery payment - ${task.task_type}`,
              currency: 'KSH'
            });
        }
      }

      const { error } = await supabase
        .from('transport_tasks')
        .update(updates)
        .eq('id', taskId);

      if (error) throw error;

      await fetchTransportData();
      
      toast({
        title: "Status Updated",
        description: `Task marked as ${status}`
      });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const getTaskTypeIcon = (type: string) => {
    switch (type) {
      case 'service_pickup':
        return <Star className="w-4 h-4" />;
      case 'food_delivery':
        return <Utensils className="w-4 h-4" />;
      case 'product_delivery':
        return <Package className="w-4 h-4" />;
      default:
        return <Truck className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-blue-100 text-blue-800';
      case 'picked_up':
        return 'bg-orange-100 text-orange-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const todaysEarnings = transactions
    .filter(t => t.type === 'booking' && new Date(t.created_at).toDateString() === new Date().toDateString())
    .reduce((sum, t) => sum + t.amount, 0);

  const activeTasks = myTasks.filter(t => ['accepted', 'picked_up'].includes(t.status)).length;
  const completedToday = myTasks.filter(t => 
    t.status === 'delivered' && 
    new Date(t.created_at).toDateString() === new Date().toDateString()
  ).length;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Transport Command</h1>
              <p className="text-xl text-gray-600">Your delivery empire awaits</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge 
                variant={isOnline ? 'default' : 'secondary'}
                className="text-lg px-4 py-2 cursor-pointer"
                onClick={() => setIsOnline(!isOnline)}
              >
                {isOnline ? '🟢 Online' : '🔴 Offline'}
              </Badge>
              <Button
                variant={isOnline ? 'outline' : 'default'}
                onClick={() => setIsOnline(!isOnline)}
              >
                {isOnline ? 'Go Offline' : 'Go Online'}
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Today's Earnings</p>
                    <p className="text-2xl font-bold text-green-600">KSh {todaysEarnings}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Tasks</p>
                    <p className="text-2xl font-bold text-blue-600">{activeTasks}</p>
                  </div>
                  <Navigation className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed Today</p>
                    <p className="text-2xl font-bold text-purple-600">{completedToday}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-purple-600" />
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
                  <Truck className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="available" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="available">
                Available Tasks ({availableTasks.length})
              </TabsTrigger>
              <TabsTrigger value="active">
                My Tasks ({myTasks.length})
              </TabsTrigger>
              <TabsTrigger value="earnings">Earnings</TabsTrigger>
            </TabsList>

            <TabsContent value="available" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-green-600" />
                    Available Pickup Requests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!isOnline ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">You're offline. Go online to see available tasks.</p>
                    </div>
                  ) : availableTasks.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No tasks available right now. Check back soon!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {availableTasks.map((task) => (
                        <div key={task.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                {getTaskTypeIcon(task.task_type)}
                                <span className="font-medium capitalize">
                                  {task.task_type.replace('_', ' ')}
                                </span>
                                <Badge className={getStatusColor(task.status)}>
                                  {task.status}
                                </Badge>
                              </div>
                              
                              <div className="space-y-1 text-sm text-gray-600">
                                <p className="flex items-center">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  From: {task.pickup_location}
                                </p>
                                <p className="flex items-center">
                                  <Navigation className="w-3 h-3 mr-1" />
                                  To: {task.delivery_location}
                                </p>
                                {task.bookings?.profiles && (
                                  <p>Client: {task.bookings.profiles.full_name}</p>
                                )}
                                <p className="flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {new Date(task.created_at).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <p className="text-lg font-bold text-green-600">
                                KSh {task.estimated_earnings}
                              </p>
                              <Button
                                onClick={() => acceptTask(task.id)}
                                className="mt-2 bg-green-600 hover:bg-green-700"
                                size="sm"
                              >
                                Accept Task
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="active" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Truck className="w-5 h-5 mr-2 text-blue-600" />
                    My Active Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {myTasks.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No tasks assigned yet. Accept some tasks to get started!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {myTasks.map((task) => (
                        <div key={task.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                {getTaskTypeIcon(task.task_type)}
                                <span className="font-medium capitalize">
                                  {task.task_type.replace('_', ' ')}
                                </span>
                                <Badge className={getStatusColor(task.status)}>
                                  {task.status}
                                </Badge>
                              </div>
                              
                              <div className="space-y-1 text-sm text-gray-600">
                                <p className="flex items-center">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  From: {task.pickup_location}
                                </p>
                                <p className="flex items-center">
                                  <Navigation className="w-3 h-3 mr-1" />
                                  To: {task.delivery_location}
                                </p>
                                {task.bookings?.profiles && (
                                  <div>
                                    <p>Client: {task.bookings.profiles.full_name}</p>
                                    <p>Phone: {task.bookings.profiles.phone}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <p className="text-lg font-bold text-green-600">
                                KSh {task.actual_earnings || task.estimated_earnings}
                              </p>
                              
                              <div className="flex flex-col space-y-1 mt-2">
                                {task.status === 'accepted' && (
                                  <Button
                                    onClick={() => updateTaskStatus(task.id, 'picked_up')}
                                    size="sm"
                                    className="bg-orange-600 hover:bg-orange-700"
                                  >
                                    Mark Picked Up
                                  </Button>
                                )}
                                {task.status === 'picked_up' && (
                                  <Button
                                    onClick={() => updateTaskStatus(task.id, 'delivered')}
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Complete
                                  </Button>
                                )}
                                {['accepted', 'picked_up'].includes(task.status) && (
                                  <Button
                                    onClick={() => updateTaskStatus(task.id, 'cancelled')}
                                    size="sm"
                                    variant="outline"
                                  >
                                    <XCircle className="w-3 h-3 mr-1" />
                                    Cancel
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="earnings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Earnings Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">KSh {balance}</p>
                      <p className="text-sm text-gray-600">Current Balance</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">KSh {todaysEarnings}</p>
                      <p className="text-sm text-gray-600">Today's Earnings</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">{completedToday}</p>
                      <p className="text-sm text-gray-600">Deliveries Completed</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold">Recent Transactions</h3>
                    {transactions.slice(0, 10).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-gray-500">{new Date(transaction.created_at).toLocaleDateString()}</p>
                        </div>
                        <Badge variant={transaction.amount > 0 ? 'default' : 'secondary'}>
                          {transaction.amount > 0 ? '+' : ''}KSh {transaction.amount}
                        </Badge>
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

export default TransportDashboard;
