
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Gamepad2, Dice1, Users, Gift, Clock, Zap, Star } from "lucide-react";
import { useState } from "react";

const games = [
  {
    id: 1,
    name: "Chess Tournament",
    icon: Trophy,
    entryFee: "$2",
    prize: "$15",
    description: "Weekly chess tournament with beauty professionals and clients",
    players: "8/16",
    timeLeft: "2 days",
    difficulty: "All Levels",
    status: "open"
  },
  {
    id: 2,
    name: "Beauty Trivia Challenge",
    icon: Star,
    entryFee: "Free",
    prize: "20% Service Discount",
    description: "Test your beauty knowledge and win amazing discounts",
    players: "24/50",
    timeLeft: "5 hours",
    difficulty: "Easy",
    status: "filling"
  },
  {
    id: 3,
    name: "Spin the Wheel",
    icon: Zap,
    entryFee: "$1",
    prize: "Up to $50 Credit",
    description: "Daily spin for instant rewards and service credits",
    players: "Unlimited",
    timeLeft: "Always Available",
    difficulty: "Luck Based",
    status: "active"
  }
];

const leaderboard = [
  { rank: 1, name: "Maya J.", points: 2840, badge: "Chess Master" },
  { rank: 2, name: "Alex K.", points: 2650, badge: "Trivia Queen" },
  { rank: 3, name: "Jordan M.", points: 2420, badge: "Lucky Spinner" },
  { rank: 4, name: "Taylor R.", points: 2180, badge: "Beauty Guru" },
  { rank: 5, name: "Casey L.", points: 1950, badge: "Game Enthusiast" }
];

const dailyRewards = [
  { day: "Mon", reward: "5% Discount", claimed: true },
  { day: "Tue", reward: "$3 Credit", claimed: true },
  { day: "Wed", reward: "Free Consultation", claimed: true },
  { day: "Thu", reward: "10% Discount", claimed: false },
  { day: "Fri", reward: "Mystery Prize", claimed: false },
  { day: "Sat", reward: "$5 Credit", claimed: false },
  { day: "Sun", reward: "Double Points", claimed: false }
];

const GamesPage = () => {
  const [spinResult, setSpinResult] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleSpin = () => {
    setIsSpinning(true);
    setTimeout(() => {
      const prizes = ["$5 Credit", "10% Discount", "Free Service", "$10 Credit", "Try Again", "20% Discount"];
      const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
      setSpinResult(randomPrize);
      setIsSpinning(false);
    }, 2000);
  };

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 text-white py-20">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 container mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Game Night
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Turn your beauty session into an adventure! Play games, win prizes, and connect with our community.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
                <Gamepad2 className="w-5 h-5 mr-2" />
                Start Playing
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
                <Trophy className="w-5 h-5 mr-2" />
                View Leaderboard
              </Button>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-6 py-12">
          {/* Featured Games */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Featured Games</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {games.map((game) => (
                <Card key={game.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <game.icon className="w-8 h-8" />
                        <CardTitle className="text-xl">{game.name}</CardTitle>
                      </div>
                      <Badge variant="secondary" className={
                        game.status === 'open' ? 'bg-green-100 text-green-800' :
                        game.status === 'filling' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }>
                        {game.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-gray-600 mb-4">{game.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                      <div>
                        <span className="text-gray-500">Entry Fee:</span>
                        <p className="font-semibold text-green-600">{game.entryFee}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Prize:</span>
                        <p className="font-semibold text-orange-600">{game.prize}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Players:</span>
                        <p className="font-semibold">{game.players}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Time Left:</span>
                        <p className="font-semibold">{game.timeLeft}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="outline">{game.difficulty}</Badge>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{game.players.split('/')[0]} playing</span>
                      </div>
                    </div>
                    
                    <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                      Join Game
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Interactive Spin Wheel */}
          <section className="mb-16">
            <Card className="max-w-md mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Daily Spin Wheel</CardTitle>
                <p className="text-gray-600">Spin once per day for exciting rewards!</p>
              </CardHeader>
              <CardContent className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-6">
                  <div className={`w-full h-full rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center ${isSpinning ? 'animate-spin' : ''}`}>
                    <Dice1 className="w-16 h-16 text-white" />
                  </div>
                </div>
                
                {spinResult && !isSpinning && (
                  <div className="mb-4 p-4 bg-green-100 rounded-lg">
                    <p className="text-lg font-bold text-green-800">You won: {spinResult}!</p>
                  </div>
                )}
                
                <Button 
                  onClick={handleSpin} 
                  disabled={isSpinning}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500"
                >
                  {isSpinning ? 'Spinning...' : 'Spin Now ($1)'}
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* Leaderboard */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Top Players</h2>
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {leaderboard.map((player) => (
                    <div key={player.rank} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                          player.rank === 1 ? 'bg-yellow-500' :
                          player.rank === 2 ? 'bg-gray-400' :
                          player.rank === 3 ? 'bg-orange-600' :
                          'bg-gray-300'
                        }`}>
                          {player.rank}
                        </div>
                        <div>
                          <p className="font-semibold">{player.name}</p>
                          <Badge variant="secondary" className="text-xs">{player.badge}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-orange-600">{player.points} pts</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Daily Rewards */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Daily Login Rewards</h2>
            <Card className="max-w-4xl mx-auto">
              <CardContent className="p-6">
                <div className="grid grid-cols-7 gap-4">
                  {dailyRewards.map((reward, index) => (
                    <div key={index} className={`text-center p-4 border rounded-lg ${reward.claimed ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
                      <div className="font-bold text-lg mb-2">{reward.day}</div>
                      <div className="text-sm text-gray-600 mb-3">{reward.reward}</div>
                      {reward.claimed ? (
                        <Badge className="bg-green-500 text-white">Claimed</Badge>
                      ) : (
                        <Button size="sm" variant="outline" className="text-xs">
                          {index === 3 ? 'Claim' : 'Locked'}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Call to Action */}
          <section className="text-center bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-2xl p-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Play & Win?</h2>
            <p className="text-xl mb-6">Join our gaming community and turn every beauty session into an adventure!</p>
            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
              <Gift className="w-5 h-5 mr-2" />
              Start Your Game Journey
            </Button>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default GamesPage;
