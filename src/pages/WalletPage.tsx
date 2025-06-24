
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet, Send, Plus, TrendingUp, Gift, Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useWallet } from "@/contexts/WalletContext";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const WalletPage = () => {
  const { user } = useAuth();
  const { transactions, addGlowCoins, spendGlowCoins, transferGlowCoins } = useWallet();
  const { toast } = useToast();
  const [transferAmount, setTransferAmount] = useState('');
  const [transferUserId, setTransferUserId] = useState('');

  const handleTransfer = () => {
    const amount = parseInt(transferAmount);
    if (amount > 0 && transferUserId.trim()) {
      const success = transferGlowCoins(transferUserId.trim(), amount, 'P2P Transfer');
      if (success) {
        toast({
          title: "Transfer Successful!",
          description: `Sent ${amount} GlowCoins to ${transferUserId}`
        });
        setTransferAmount('');
        setTransferUserId('');
      } else {
        toast({
          title: "Transfer Failed",
          description: "Insufficient balance or invalid details",
          variant: "destructive"
        });
      }
    }
  };

  const earnGlowCoins = (amount: number, description: string) => {
    addGlowCoins(amount, description);
    toast({
      title: "GlowCoins Earned!",
      description: `+${amount} GlowCoins: ${description}`
    });
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
                <p className="text-gray-600">Manage your GlowCoins and transactions</p>
              </div>
            </div>
          </div>

          {/* Balance Card */}
          <Card className="mb-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center mb-4">
                <Zap className="w-8 h-8 mr-2" />
                <span className="text-4xl font-bold">{user?.glowCoins || 0}</span>
              </div>
              <p className="text-xl opacity-90">GlowCoins Balance</p>
              <p className="text-sm opacity-75 mt-2">≈ ${((user?.glowCoins || 0) * 0.1).toFixed(2)} USD</p>
            </CardContent>
          </Card>

          <Tabs defaultValue="transactions" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="transfer">Transfer</TabsTrigger>
              <TabsTrigger value="earn">Earn More</TabsTrigger>
            </TabsList>

            <TabsContent value="transactions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
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
                              txn.type === 'earn' ? 'bg-green-100' : 
                              txn.type === 'spend' ? 'bg-red-100' : 'bg-blue-100'
                            }`}>
                              {txn.type === 'earn' ? (
                                <Plus className="w-4 h-4 text-green-600" />
                              ) : txn.type === 'spend' ? (
                                <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />
                              ) : (
                                <Send className="w-4 h-4 text-blue-600" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{txn.description}</p>
                              <p className="text-sm text-gray-500">{new Date(txn.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold ${
                              txn.type === 'earn' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {txn.type === 'earn' ? '+' : '-'}{txn.amount}
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

            <TabsContent value="transfer" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Send GlowCoins</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Recipient User ID</label>
                    <Input
                      placeholder="Enter user ID or email"
                      value={transferUserId}
                      onChange={(e) => setTransferUserId(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Amount</label>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={handleTransfer}
                    disabled={!transferAmount || !transferUserId || parseInt(transferAmount) > (user?.glowCoins || 0)}
                    className="w-full"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send GlowCoins
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="earn" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Gift className="w-5 h-5 mr-2 text-purple-600" />
                      Referral Bonus
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600">Earn 25 GlowCoins for every friend you refer!</p>
                    <Button 
                      onClick={() => earnGlowCoins(25, 'Referral bonus simulation')}
                      className="w-full"
                    >
                      Simulate Referral (+25)
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                      Daily Streak
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600">Complete daily activities to earn bonus coins!</p>
                    <Button 
                      onClick={() => earnGlowCoins(10, 'Daily streak bonus')}
                      variant="outline"
                      className="w-full"
                    >
                      Claim Daily (+10)
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Zap className="w-5 h-5 mr-2 text-yellow-600" />
                      Host Glow Session
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600">Earn 2% commission from each guest!</p>
                    <Button 
                      onClick={() => earnGlowCoins(15, 'Glow session hosting reward')}
                      variant="outline"
                      className="w-full"
                    >
                      Simulate Hosting (+15)
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Plus className="w-5 h-5 mr-2 text-blue-600" />
                      Purchase More
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600">Buy GlowCoins with real money</p>
                    <Button variant="outline" className="w-full" disabled>
                      Coming Soon
                    </Button>
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
