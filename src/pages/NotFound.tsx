import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Gamepad2, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center">
        <Gamepad2 className="h-20 w-20 text-primary mx-auto mb-6 animate-pulse-neon" />
        <h1 className="font-heading text-6xl font-bold text-gradient mb-4">404</h1>
        <h2 className="font-heading text-xl font-semibold mb-2">Game Over!</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          Looks like this level doesn't exist. Let's get you back to the main menu.
        </p>
        <Link to="/">
          <Button variant="neon" size="lg">
            <Home className="h-5 w-5" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
