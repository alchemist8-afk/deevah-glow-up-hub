
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, Plus, Minus, Coins } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { Skeleton } from "@/components/ui/skeleton";

export function WalletCard() {
  const { balance, glowCoins, isLoading, depositFunds, withdrawFunds } = useWallet();

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            My Wallet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-8 w-32 bg-white/20" />
          <Skeleton className="h-6 w-24 bg-white/20" />
          <div className="flex gap-2">
            <Skeleton className="h-10 flex-1 bg-white/20" />
            <Skeleton className="h-10 flex-1 bg-white/20" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          My Wallet
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-3xl font-bold">KES {balance.toFixed(2)}</div>
          <div className="flex items-center gap-2 mt-2">
            <Coins className="w-4 h-4" />
            <span className="text-sm opacity-90">{glowCoins} GlowCoins</span>
            <Badge variant="secondary" className="text-xs">
              Rewards
            </Badge>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={() => depositFunds.mutate({ amount: 500, method: 'mpesa' })}
            disabled={depositFunds.isPending}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Funds
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-white border-white/30 hover:bg-white/10"
            onClick={() => withdrawFunds.mutate({ amount: 100, method: 'mpesa' })}
            disabled={withdrawFunds.isPending || balance < 100}
          >
            <Minus className="w-4 h-4 mr-1" />
            Withdraw
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
