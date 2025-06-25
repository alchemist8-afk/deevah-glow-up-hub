
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wallet, Send, Plus, TrendingUp, CreditCard, Smartphone, Building, Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useWallet } from "@/contexts/WalletContext";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const WalletPage = () => {
  const { profile } = useAuth();
  const { 
    balance, 
    glowCoins, 
    transactions, 
    paymentMethods, 
    depositFunds, 
    withdrawFunds, 
    addPaymentMethod, 
    removePaymentMethod,
    earnGlowCoins 
  } = useWallet();
  const { toast } = useToast();
  
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    method_type: 'mpesa' as 'mpesa' | 'bank_account' | 'card',
    account_number: '',
    account_name: '',
    bank_name: '',
    is_default: false
  });

  const handleDeposit = async () => {
    const amount = parseFloat(depositAmount);
    if (amount > 0 && selectedPaymentMethod) {
      const result = await depositFunds(amount, selectedPaymentMethod);
      if (result.success) {
        setDepositAmount('');
        setSelectedPaymentMethod('');
      }
    } else {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid amount and select a payment method",
        variant: "destructive"
      });
    }
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (amount > 0 && selectedPaymentMethod) {
      const result = await withdrawFunds(amount, selectedPaymentMethod);
      if (result.success) {
        setWithdrawAmount('');
        setSelectedPaymentMethod('');
      }
    } else {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid amount and select a payment method",
        variant: "destructive"
      });
    }
  };

  const addNewPaymentMethod = async () => {
    if (!newPaymentMethod.account_number) {
      toast({
        title: "Missing Information",
        description: "Please fill in the account number",
        variant: "destructive"
      });
      return;
    }

    await addPaymentMethod({
      ...newPaymentMethod,
      is_active: true
    });

    setNewPaymentMethod({
      method_type: 'mpesa',
      account_number: '',
      account_name: '',
      bank_name: '',
      is_default: false
    });
  };

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case 'mpesa':
        return <Smartphone className="w-4 h-4" />;
      case 'bank_account':
        return <Building className="w-4 h-4" />;
      case 'card':
        return <CreditCard className="w-4 h-4" />;
      default:
        return <Wallet className="w-4 h-4" />;
    }
  };

  const getPaymentMethodLabel = (method: any) => {
    switch (method.method_type) {
      case 'mpesa':
        return `M-Pesa: ${method.account_number}`;
      case 'bank_account':
        return `${method.bank_name}: ${method.account_number}`;
      case 'card':
        return `Card: ****${method.account_number.slice(-4)}`;
      default:
        return method.account_number;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
                <Wallet className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Deevah Wallet</h1>
                <p className="text-gray-600">Real money management made simple</p>
              </div>
            </div>
          </div>

          {/* Balance Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
              <CardContent className="p-8 text-center">
                <div className="flex items-center justify-center mb-4">
                  <Wallet className="w-8 h-8 mr-2" />
                  <span className="text-4xl font-bold">KSh {balance.toFixed(2)}</span>
                </div>
                <p className="text-xl opacity-90">Main Balance</p>
                <p className="text-sm opacity-75 mt-2">Available for withdrawals & payments</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <CardContent className="p-8 text-center">
                <div className="flex items-center justify-center mb-4">
                  <Zap className="w-8 h-8 mr-2" />
                  <span className="text-4xl font-bold">{glowCoins}</span>
                </div>
                <p className="text-xl opacity-90">GlowCoins</p>
                <p className="text-sm opacity-75 mt-2">Loyalty rewards & special offers</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="manage" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="manage">Manage Money</TabsTrigger>
              <TabsTrigger value="methods">Payment Methods</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="rewards">Rewards</TabsTrigger>
            </TabsList>

            <TabsContent value="manage" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-green-600">
                      <Plus className="w-5 h-5 mr-2" />
                      Deposit Money
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="depositAmount">Amount (KSh)</Label>
                      <Input
                        id="depositAmount"
                        type="number"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        placeholder="Enter amount to deposit"
                      />
                    </div>

                    <div>
                      <Label>Payment Method</Label>
                      <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          {paymentMethods.map((method) => (
                            <SelectItem key={method.id} value={method.id}>
                              <div className="flex items-center space-x-2">
                                {getPaymentMethodIcon(method.method_type)}
                                <span>{getPaymentMethodLabel(method)}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button 
                      onClick={handleDeposit}
                      disabled={!depositAmount || !selectedPaymentMethod}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Deposit KSh {depositAmount || '0'}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-blue-600">
                      <Send className="w-5 h-5 mr-2" />
                      Withdraw Money
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="withdrawAmount">Amount (KSh)</Label>
                      <Input
                        id="withdrawAmount"
                        type="number"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="Enter amount to withdraw"
                        max={balance}
                      />
                      <p className="text-xs text-gray-500 mt-1">Available: KSh {balance.toFixed(2)}</p>
                    </div>

                    <div>
                      <Label>Withdrawal Method</Label>
                      <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select withdrawal method" />
                        </SelectTrigger>
                        <SelectContent>
                          {paymentMethods.map((method) => (
                            <SelectItem key={method.id} value={method.id}>
                              <div className="flex items-center space-x-2">
                                {getPaymentMethodIcon(method.method_type)}
                                <span>{getPaymentMethodLabel(method)}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button 
                      onClick={handleWithdraw}
                      disabled={!withdrawAmount || !selectedPaymentMethod || parseFloat(withdrawAmount) > balance}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Withdraw KSh {withdrawAmount || '0'}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="methods" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Payment Methods</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Method
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Payment Method</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Method Type</Label>
                          <Select
                            value={newPaymentMethod.method_type}
                            onValueChange={(value: 'mpesa' | 'bank_account' | 'card') => 
                              setNewPaymentMethod(prev => ({ ...prev, method_type: value }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mpesa">
                                <div className="flex items-center space-x-2">
                                  <Smartphone className="w-4 h-4" />
                                  <span>M-Pesa</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="bank_account">
                                <div className="flex items-center space-x-2">
                                  <Building className="w-4 h-4" />
                                  <span>Bank Account</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="card">
                                <div className="flex items-center space-x-2">
                                  <CreditCard className="w-4 h-4" />
                                  <span>Debit/Credit Card</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="accountNumber">
                            {newPaymentMethod.method_type === 'mpesa' ? 'Phone Number' :
                             newPaymentMethod.method_type === 'card' ? 'Card Number' : 'Account Number'}
                          </Label>
                          <Input
                            id="accountNumber"
                            value={newPaymentMethod.account_number}
                            onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, account_number: e.target.value }))}
                            placeholder={
                              newPaymentMethod.method_type === 'mpesa' ? '0712345678' :
                              newPaymentMethod.method_type === 'card' ? '1234 5678 9012 3456' : 'Account number'
                            }
                          />
                        </div>

                        {newPaymentMethod.method_type === 'bank_account' && (
                          <>
                            <div>
                              <Label htmlFor="accountName">Account Name</Label>
                              <Input
                                id="accountName"
                                value={newPaymentMethod.account_name}
                                onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, account_name: e.target.value }))}
                                placeholder="Your name on the account"
                              />
                            </div>
                            <div>
                              <Label htmlFor="bankName">Bank Name</Label>
                              <Input
                                id="bankName"
                                value={newPaymentMethod.bank_name}
                                onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, bank_name: e.target.value }))}
                                placeholder="e.g. Equity Bank"
                              />
                            </div>
                          </>
                        )}

                        <Button onClick={addNewPaymentMethod} className="w-full">
                          Add Payment Method
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {paymentMethods.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">No payment methods added yet</p>
                    ) : (
                      paymentMethods.map((method) => (
                        <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            {getPaymentMethodIcon(method.method_type)}
                            <div>
                              <p className="font-medium">{getPaymentMethodLabel(method)}</p>
                              <p className="text-sm text-gray-500 capitalize">{method.method_type.replace('_', ' ')}</p>
                            </div>
                            {method.is_default && (
                              <Badge variant="secondary">Default</Badge>
                            )}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removePaymentMethod(method.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transactions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">No transactions yet</p>
                    ) : (
                      transactions.map((txn) => (
                        <div key={txn.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-full ${
                              txn.type === 'deposit' || txn.type === 'referral_earning' || txn.type === 'tip' && txn.amount > 0 ? 'bg-green-100' : 
                              txn.type === 'withdraw' || txn.type === 'booking' || txn.type === 'tip' && txn.amount < 0 ? 'bg-red-100' : 'bg-blue-100'
                            }`}>
                              {(txn.type === 'deposit' || txn.type === 'referral_earning' || (txn.type === 'tip' && txn.amount > 0)) ? (
                                <Plus className="w-4 h-4 text-green-600" />
                              ) : txn.type === 'withdraw' || txn.type === 'booking' || (txn.type === 'tip' && txn.amount < 0) ? (
                                <Send className="w-4 h-4 text-red-600" />
                              ) : (
                                <Zap className="w-4 h-4 text-blue-600" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{txn.description || 'Transaction'}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(txn.created_at).toLocaleDateString()} • {txn.currency || 'KSH'}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold ${
                              txn.amount > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {txn.amount > 0 ? '+' : ''}
                              {txn.currency === 'GLOW' ? `${txn.amount} GC` : `KSh ${Math.abs(txn.amount)}`}
                            </p>
                            <Badge variant={txn.status === 'completed' ? 'default' : 'secondary'}>
                              {txn.status}
                            </Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rewards" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Zap className="w-5 h-5 mr-2 text-purple-600" />
                      Earn GlowCoins
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-6 bg-purple-50 rounded-lg">
                      <p className="text-3xl font-bold text-purple-600">{glowCoins}</p>
                      <p className="text-sm text-gray-600">Current GlowCoins</p>
                    </div>

                    <div className="space-y-3">
                      <Button 
                        onClick={() => earnGlowCoins(25, 'Daily check-in bonus')}
                        className="w-full"
                        variant="outline"
                      >
                        Daily Check-in (+25 GlowCoins)
                      </Button>
                      
                      <Button 
                        onClick={() => earnGlowCoins(50, 'Completed booking bonus')}
                        className="w-full"
                        variant="outline"
                      >
                        Complete a Booking (+50 GlowCoins)
                      </Button>
                      
                      <Button 
                        onClick={() => earnGlowCoins(100, 'Referral friend bonus')}
                        className="w-full"
                        variant="outline"
                      >
                        Refer a Friend (+100 GlowCoins)
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>GlowCoins Benefits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold text-green-600">Booking Discounts</h3>
                        <p className="text-sm text-gray-600">Use GlowCoins for up to 20% off your bookings</p>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold text-blue-600">Priority Booking</h3>
                        <p className="text-sm text-gray-600">Premium access to popular artists</p>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold text-purple-600">Exclusive Events</h3>
                        <p className="text-sm text-gray-600">Access to VIP beauty events and workshops</p>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold text-orange-600">Product Discounts</h3>
                        <p className="text-sm text-gray-600">Special rates on beauty products</p>
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

export default WalletPage;
