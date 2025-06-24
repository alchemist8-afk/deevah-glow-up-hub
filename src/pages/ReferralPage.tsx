
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Share2, Users, Gift, Copy, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useReferral } from "@/contexts/ReferralContext";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const ReferralPage = () => {
  const { user } = useAuth();
  const { referrals, totalEarnings, addReferral, completeReferral } = useReferral();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [newReferralName, setNewReferralName] = useState('');

  const referralLink = `https://deevah.app/join?ref=${user?.referralCode}`;

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({
      title: "Link Copied!",
      description: "Share this link with your friends to earn rewards"
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddReferral = () => {
    if (newReferralName.trim()) {
      addReferral(newReferralName.trim());
      setNewReferralName('');
      toast({
        title: "Referral Added!",
        description: `${newReferralName} has been referred. You'll earn 25 GlowCoins when they complete their first booking.`
      });
    }
  };

  const simulateReferralComplete = (referralId: string) => {
    completeReferral(referralId);
    toast({
      title: "Referral Completed!",
      description: "You've earned 25 GlowCoins!"
    });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
                <Share2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Referral Program</h1>
                <p className="text-gray-600">Earn GlowCoins by inviting friends to Deevah</p>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-8 h-8 text-blue-600 mr-2" />
                  <span className="text-3xl font-bold">{referrals.length}</span>
                </div>
                <p className="text-gray-600">Total Referrals</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Gift className="w-8 h-8 text-green-600 mr-2" />
                  <span className="text-3xl font-bold">{totalEarnings}</span>
                </div>
                <p className="text-gray-600">GlowCoins Earned</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Check className="w-8 h-8 text-purple-600 mr-2" />
                  <span className="text-3xl font-bold">
                    {referrals.filter(r => r.status === 'completed').length}
                  </span>
                </div>  
                <p className="text-gray-600">Completed</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Referral Link */}
            <Card>
              <CardHeader>
                <CardTitle>Your Referral Link</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-mono break-all">{referralLink}</p>
                </div>
                <Button onClick={copyReferralLink} className="w-full">
                  {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </Button>
                
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-2">Share via social media:</p>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      WhatsApp
                    </Button>
                    <Button variant="outline" size="sm">
                      Instagram
                    </Button>
                    <Button variant="outline" size="sm">
                      Facebook
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How It Works */}
            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold">Share Your Link</h4>
                    <p className="text-sm text-gray-600">Send your unique referral link to friends</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold">They Sign Up</h4>
                    <p className="text-sm text-gray-600">Friends join Deevah using your link</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold">You Both Earn</h4>
                    <p className="text-sm text-gray-600">Get 25 GlowCoins when they book their first service</p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <p className="font-semibold text-green-800">Bonus Rewards:</p>
                  <ul className="text-sm text-green-700 mt-2 space-y-1">
                    <li>• 10 referrals = Extra 100 GlowCoins</li>
                    <li>• 25 referrals = Free premium service</li>
                    <li>• 50 referrals = VIP status + exclusive perks</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Referral List */}
          <Card className="mt-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Your Referrals</CardTitle>
              <div className="flex space-x-2">
                <Input
                  placeholder="Friend's name"
                  value={newReferralName}
                  onChange={(e) => setNewReferralName(e.target.value)}
                  className="w-40"
                />
                <Button onClick={handleAddReferral} size="sm">
                  Add Referral
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {referrals.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No referrals yet. Start sharing your link!</p>
                  </div>
                ) : (
                  referrals.map((referral) => (
                    <div key={referral.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{referral.referredUserName}</h4>
                        <p className="text-sm text-gray-600">
                          Referred on {referral.dateReferred}
                          {referral.dateCompleted && ` • Completed on ${referral.dateCompleted}`}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="font-semibold text-green-600">+{referral.rewardAmount} GC</span>
                        <Badge variant={referral.status === 'completed' ? 'default' : 'secondary'}>
                          {referral.status}
                        </Badge>
                        {referral.status === 'pending' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => simulateReferralComplete(referral.id)}
                          >
                            Simulate Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ReferralPage;
