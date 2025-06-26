
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Sparkles } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center px-6">
      <div className="text-center max-w-lg mx-auto">
        {/* Animated 404 */}
        <div className="mb-8">
          <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
            404
          </h1>
          <div className="flex justify-center mt-4">
            <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
          </div>
        </div>
        
        {/* Error message */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          Oops! Page not found
        </h2>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          The page you're looking for seems to have vanished into thin air. 
          Don't worry, we'll help you find your way back to your glow journey.
        </p>
        
        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
          </Link>
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="border-purple-200 text-purple-700 hover:bg-purple-50 px-6 py-3"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </Button>
        </div>
        
        {/* Help text */}
        <p className="text-sm text-gray-500 mt-8">
          Still lost? <Link to="/auth" className="text-purple-600 hover:text-purple-700 underline">Contact support</Link> or explore our services.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
