
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Users, Palette, Building2, Truck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AuthPage = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole | "">("");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ 
    name: "", 
    email: "", 
    password: "",
    phone: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(loginData.email, loginData.password);
      toast({
        title: "Welcome back to Deevah! ✨",
        description: "You've successfully logged in."
      });
      
      // The auth system will automatically redirect based on role
      navigate("/");
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRole) {
      toast({
        title: "Please select a role",
        description: "Choose how you want to use Deevah.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signup(signupData.name, signupData.email, signupData.password, selectedRole, signupData.phone);
      
      toast({
        title: "Welcome to Deevah! 🌟",
        description: `Your ${selectedRole} account has been created successfully.`
      });

      // Redirect based on role
      switch (selectedRole) {
        case "client":
          navigate("/");
          break;
        case "artist":
          navigate("/artist-dashboard");
          break;
        case "business":
          navigate("/business");
          break;
        case "transport":
          navigate("/transport-dashboard");
          break;
      }
    } catch (error) {
      toast({
        title: "Signup failed",
        description: "Please try again with different credentials.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Join Deevah
            </CardTitle>
            <p className="text-gray-600">Your beauty & lifestyle platform</p>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4 mt-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email or Phone</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="Enter your email"
                      value={loginData.email}
                      onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                    <p className="font-medium mb-1">Test Accounts:</p>
                    <p>• Client: client@test.com</p>
                    <p>• Artist: artist@test.com</p>
                    <p>• Business: business@test.com</p>
                    <p className="text-xs mt-1 text-gray-500">Password: any text</p>
                  </div>
                  
                  <Button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4 mt-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      placeholder="Enter your full name"
                      value={signupData.name}
                      onChange={(e) => setSignupData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input 
                        id="signup-email" 
                        type="email" 
                        placeholder="Email address"
                        value={signupData.email}
                        onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input 
                        id="phone" 
                        type="tel" 
                        placeholder="Phone number"
                        value={signupData.phone}
                        onChange={(e) => setSignupData(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input 
                      id="signup-password" 
                      type="password" 
                      placeholder="Create a password"
                      value={signupData.password}
                      onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>How do you want to use Deevah?</Label>
                    <Select value={selectedRole} onValueChange={(value: UserRole) => setSelectedRole(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="client">
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4" />
                            <div>
                              <span className="font-medium">Client</span>
                              <p className="text-xs text-gray-500">Book beauty services & experiences</p>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="artist">
                          <div className="flex items-center space-x-2">
                            <Palette className="w-4 h-4" />
                            <div>
                              <span className="font-medium">Artist</span>
                              <p className="text-xs text-gray-500">Provide beauty services & build clientele</p>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="business">
                          <div className="flex items-center space-x-2">
                            <Building2 className="w-4 h-4" />
                            <div>
                              <span className="font-medium">Business Owner</span>
                              <p className="text-xs text-gray-500">Manage salon, products & services</p>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="transport">
                          <div className="flex items-center space-x-2">
                            <Truck className="w-4 h-4" />
                            <div>
                              <span className="font-medium">Transport Provider</span>
                              <p className="text-xs text-gray-500">Deliver products & earn money</p>
                            </div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Start Your Glow Journey"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AuthPage;
