
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
  const { profile } = useAuth();
  const { balance, glowCoins, transactions, earnGlowCoins } = useWallet();
  const { toast } = useToast();
  const [transferAmount, setTransferAmount] = useState('');
  const [transferUserId, setTransferUserId] = useState('');

  const handleTransfer = () => {
    const amount = parseInt(transferAmount);
    if (amount > 0 && transferUserId.trim()) {
      if (amount <= glowCoins) {
        earnGlowCoins(-amount, `Transfer to ${transferUserId}`);
        toast({
          title: "Transfer Successful!",
          description: `Sent ${amount} GlowCoins to ${transferUserId}`
        });
        setTransferAmount('');
        setTransferUserId('');
      } else {
        toast({
          title: "Transfer Failed",
          description: "Insufficient balance",
          variant: "destructive"
        });
      }
    }
  };

  const handleEarnGlowCoins = (amount: number, description: string) => {
    earnGlowCoins(amount, description);
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
                <span className="text-4xl font-bold">{glowCoins}</span>
              </div>
              <p className="text-xl opacity-90">GlowCoins Balance</p>
              <p className="text-sm opacity-75 mt-2">≈ ${(glowCoins * 0.1).toFixed(2)} USD</p>
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
                              txn.type === 'glow_coins' || txn.type === 'deposit' || txn.type === 'referral_earning' ? 'bg-green-100' : 
                              txn.type === 'withdraw' || txn.type === 'booking' ? 'bg-red-100' : 'bg-blue-100'
                            }`}>
                              {(txn.type === 'glow_coins' || txn.type === 'deposit' || txn.type === 'referral_earning') ? (
                                <Plus className="w-4 h-4 text-green-600" />
                              ) : txn.type === 'withdraw' || txn.type === 'booking' ? (
                                <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />
                              ) : (
                                <Send className="w-4 h-4 text-blue-600" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{txn.description || 'Transaction'}</p>
                              <p className="text-sm text-gray-500">{new Date(txn.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold ${
                              (txn.type === 'glow_coins' || txn.type === 'deposit' || txn.type === 'referral_earning') ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {(txn.type === 'glow_coins' || txn.type === 'deposit' || txn.type === 'referral_earning') ? '+' : '-'}{txn.amount}
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
                    disabled={!transferAmount || !transferUserId || parseInt(transferAmount) > glowCoins}
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
                      onClick={() => handleEarnGlowCoins(25, 'Referral bonus simulation')}
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
                      onClick={() => handleEarnGlowCoins(10, 'Daily streak bonus')}
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
                      onClick={() => handleEarnGlowCoins(15, 'Glow session hosting reward')}
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
