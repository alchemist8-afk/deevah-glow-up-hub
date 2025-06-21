
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Gamepad2, Trophy, Users, Clock, Zap, Crown, Dice6, Target, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const activeGames = [
  {
    id: 'chess1',
    name: 'Chess Championship',
    type: 'Tournament',
    entry: 2,
    prize: 15,
    players: 24,
    maxPlayers: 32,
    timeLeft: '2h 15m',
    difficulty: 'Intermediate',
    status: 'Live'
  },
  {
    id: 'trivia1',
    name: 'Beauty Knowledge Quiz',
    type: 'Trivia',
    entry: 1,
    prize: 8,
    players: 15,
    maxPlayers: 20,
    timeLeft: '45m',
    difficulty: 'Easy',
    status: 'Starting Soon'
  },
  {
    id: 'wheel1',
    name: 'Lucky Spin',
    type: 'Luck',
    entry: 0.5,
    prize: 'Discount Codes',
    players: 8,
    maxPlayers: 10,
    timeLeft: 'Always Open',
    difficulty: 'Anyone',
    status: 'Live'
  }
];

const gameHistory = [
  {
    id: 'game1',
    name: 'Chess Tournament #47',
    prize: '$12',
    date: 'Yesterday',
    placement: 2,
    participants: 28
  },
  {
    id: 'game2',
    name: 'Beauty Trivia Challenge',
    prize: 'Free Service Voucher',
    date: '2 days ago',
    placement: 1,
    participants: 15
  }
];

const rewards = [
  {
    type: 'Cash Prize',
    amount: '$127',
    description: 'Total winnings this month'
  },
  {
    type: 'Service Credits',
    amount: '3',
    description: 'Free service vouchers earned'
  },
  {
    type: 'Discount Codes',
    amount: '8',
    description: 'Active discount codes'
  }
];

const GamesPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [spinResult, setSpinResult] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleJoinGame = (game: any) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to join games and win prizes!"
      });
      return;
    }

    toast({
      title: "Game Joined!",
      description: `You've joined ${game.name}. Entry fee: $${game.entry}`
    });
  };

  const handleSpinWheel = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to spin the wheel!"
      });
      return;
    }

    setIsSpinning(true);
    
    setTimeout(() => {
      const prizes = ['10% Off', '20% Off', 'Free Consultation', '$5 Credit', 'Try Again', '15% Off'];
      const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
      setSpinResult(randomPrize);
      setIsSpinning(false);
      
      toast({
        title: "Congratulations!",
        description: `You won: ${randomPrize}!`
      });
    }, 3000);
  };

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 text-white py-20">
          <div className="absolute inset-0 bg-black/20"></div>
          
          <div className="relative z-10 container mx-auto px-6 text-center">
            <div className="flex items-center justify-center mb-6">
              <Gamepad2 className="w-12 h-12 mr-4 text-yellow-300" />
              <h1 className="text-5xl md:text-7xl font-bold">
                Game Night
              </h1>
            </div>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Play, compete, and win real prizes while waiting for your beauty session!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-yellow-500 text-black hover:bg-yellow-400">
                <Trophy className="w-5 h-5 mr-2" />
                Join Tournament
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                <Star className="w-5 h-5 mr-2" />
                View Leaderboard
              </Button>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="py-8 bg-white border-b">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">127</div>
                <div className="text-sm text-gray-600">Active Players</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">$2,340</div>
                <div className="text-sm text-gray-600">Prize Pool Today</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">15</div>
                <div className="text-sm text-gray-600">Games Running</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-600">89%</div>
                <div className="text-sm text-gray-600">Win Rate</div>
              </div>
            </div>
          </div>
        </section>

        {/* Active Games */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-900">
                <Zap className="w-10 h-10 inline-block mr-3 text-purple-600" />
                Live Games
              </h2>
              <p className="text-xl text-gray-600">Jump in now and compete for real prizes</p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8">
              {activeGames.map((game) => (
                <Card key={game.id} className="hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        {game.type === 'Tournament' && <Crown className="w-5 h-5 text-yellow-500" />}
                        {game.type === 'Trivia' && <Target className="w-5 h-5 text-blue-500" />}
                        {game.type === 'Luck' && <Dice6 className="w-5 h-5 text-green-500" />}
                        <span>{game.name}</span>
                      </CardTitle>
                      <Badge 
                        className={
                          game.status === 'Live' ? 'bg-green-500' : 
                          game.status === 'Starting Soon' ? 'bg-yellow-500 text-black' : 
                          'bg-gray-500'
                        }
                      >
                        {game.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Entry Fee:</span>
                        <div className="font-bold text-lg">${game.entry}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Prize:</span>
                        <div className="font-bold text-lg text-green-600">
                          {typeof game.prize === 'number' ? `$${game.prize}` : game.prize}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Players: {game.players}/{game.maxPlayers}</span>
                        <span>{Math.round((game.players / game.maxPlayers) * 100)}% full</span>
                      </div>
                      <Progress value={(game.players / game.maxPlayers) * 100} className="h-2" />
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {game.timeLeft}
                      </span>
                      <span>Difficulty: {game.difficulty}</span>
                    </div>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      onClick={() => handleJoinGame(game)}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Join Game
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Spin the Wheel */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-4 text-gray-900">
                <Dice6 className="w-10 h-10 inline-block mr-3 text-green-600" />
                Spin the Wheel
              </h2>
              <p className="text-xl text-gray-600 mb-8">Free spins every hour! Win discounts and service credits.</p>
              
              <Card className="p-8">
                <div className="relative w-64 h-64 mx-auto mb-8">
                  <div className={`w-full h-full border-8 border-purple-600 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 ${isSpinning ? 'animate-spin' : ''}`}>
                    {isSpinning ? (
                      <Zap className="w-16 h-16 text-purple-600" />
                    ) : spinResult ? (
                      <div className="text-center">
                        <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                        <div className="font-bold text-lg">{spinResult}</div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Dice6 className="w-12 h-12 text-purple-600 mx-auto mb-2" />
                        <div className="font-bold">Spin to Win!</div>
                      </div>
                    )}
                  </div>
                </div>
                
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                  onClick={handleSpinWheel}
                  disabled={isSpinning}
                >
                  {isSpinning ? 'Spinning...' : 'Spin the Wheel'}
                </Button>
                
                <p className="text-sm text-gray-500 mt-4">
                  Free spin available every hour. Premium spins unlock bigger prizes!
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* User Stats & History */}
        {user && (
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-6">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Rewards */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      <span>Your Rewards</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {rewards.map((reward, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-semibold">{reward.type}</div>
                          <div className="text-sm text-gray-600">{reward.description}</div>
                        </div>
                        <div className="text-xl font-bold text-green-600">{reward.amount}</div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Game History */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-blue-500" />
                      <span>Recent Games</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {gameHistory.map((game) => (
                      <div key={game.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-semibold">{game.name}</div>
                          <div className="text-sm text-gray-600">
                            #{game.placement} of {game.participants} • {game.date}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">{game.prize}</div>
                          <Badge className={game.placement === 1 ? 'bg-yellow-500 text-black' : 'bg-gray-500'}>
                            {game.placement === 1 ? 'Winner' : `#${game.placement}`}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default GamesPage;
