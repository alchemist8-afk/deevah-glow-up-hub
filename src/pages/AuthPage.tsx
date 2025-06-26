
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Sparkles, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const AuthPage = () => {
  const { signUp, signIn, isAuthenticated, profile, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [userRole, setUserRole] = useState<UserRole>('client');

  // Check for remember me on mount
  useEffect(() => {
    const remembered = localStorage.getItem('deevah_remember_me') === 'true';
    setRememberMe(remembered);
  }, []);

  // Redirect based on role after successful authentication
  useEffect(() => {
    if (isAuthenticated && profile && !isLoading) {
      const redirectPath = getRoleBasedRedirect(profile.user_role);
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, profile, isLoading, navigate]);

  const getRoleBasedRedirect = (role: UserRole): string => {
    switch (role) {
      case 'client':
        return '/dashboard/client';
      case 'artist':
        return '/dashboard/artist';
      case 'business':
        return '/dashboard/business';
      case 'transport':
        return '/dashboard/transport';
      default:
        return '/';
    }
  };

  // Don't show auth page if already authenticated
  if (isAuthenticated && profile) {
    return <Navigate to={getRoleBasedRedirect(profile.user_role)} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password, rememberMe);
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
            description: "Your account has been created successfully."
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
      setIsAuthLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center p-4">
      {/* Back to home button */}
      <Link 
        to="/" 
        className="fixed top-6 left-6 z-50 flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Home</span>
      </Link>

      <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {isLogin ? 'Welcome Back' : 'Join Deevah'}
          </CardTitle>
          <p className="text-gray-600 mt-2">
            {isLogin 
              ? 'Sign in to continue your glow journey' 
              : 'Create your account and start glowing'
            }
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">Full Name *</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className="h-12 text-base border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    className="h-12 text-base border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm font-medium text-gray-700">I am a... *</Label>
                  <Select value={userRole} onValueChange={(value: UserRole) => setUserRole(value)}>
                    <SelectTrigger className="h-12 text-base border-gray-200 focus:border-purple-500 focus:ring-purple-500">
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
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="h-12 text-base border-gray-200 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="h-12 text-base pr-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
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

            {isLogin && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-sm text-gray-600">
                  Remember me
                </Label>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 text-base bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={isAuthLoading}
            >
              {isAuthLoading ? (
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
              className="text-purple-600 hover:text-purple-700 font-medium"
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
