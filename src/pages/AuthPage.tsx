
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Sparkles } from 'lucide-react';

const AuthPage = () => {
  const { signUp, signIn, isAuthenticated, profile } = useAuth();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [userRole, setUserRole] = useState<UserRole>('client');

  // Redirect based on role after login
  useEffect(() => {
    if (isAuthenticated && profile) {
      // This will be handled by the redirect logic in the main component
    }
  }, [isAuthenticated, profile]);

  // Redirect if already authenticated
  if (isAuthenticated && profile) {
    switch (profile.user_role) {
      case 'client':
        return <Navigate to="/" replace />;
      case 'artist':
        return <Navigate to="/artist-dashboard" replace />;
      case 'business':
        return <Navigate to="/business" replace />;
      case 'transport':
        return <Navigate to="/transport-dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "Login Failed",
            description: error.message || "Please check your credentials",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Welcome back! ✨",
            description: "You've successfully logged in"
          });
        }
      } else {
        if (!fullName.trim()) {
          toast({
            title: "Full name required",
            description: "Please enter your full name",
            variant: "destructive"
          });
          return;
        }

        const { error } = await signUp(email, password, {
          full_name: fullName,
          user_role: userRole,
          phone: phone || undefined
        });

        if (error) {
          toast({
            title: "Signup Failed",
            description: error.message || "Please try again",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Welcome to Deevah! 🎉",
            description: "Your account has been created successfully"
          });
        }
      }
    } catch (error: any) {
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F1DE] to-[#E07A5F]/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-[#E07A5F] mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">Deevah Glow Hub</h1>
          </div>
          <CardTitle className="text-xl">
            {isLogin ? 'Welcome Back' : 'Join the Glow Community'}
          </CardTitle>
          <p className="text-gray-600">
            {isLogin 
              ? 'Sign in to continue your glow journey' 
              : 'Create your account and start glowing'
            }
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">I am a... *</Label>
                  <Select value={userRole} onValueChange={(value: UserRole) => setUserRole(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client">Client (Book services)</SelectItem>
                      <SelectItem value="artist">Artist (Provide services)</SelectItem>
                      <SelectItem value="business">Business Owner (Salon/Shop)</SelectItem>
                      <SelectItem value="transport">Transport Provider (Deliveries)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#E07A5F] hover:bg-[#E07A5F]/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </div>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </p>
            <Button
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#E07A5F] hover:text-[#E07A5F]/80"
            >
              {isLogin ? 'Sign up here' : 'Sign in instead'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
