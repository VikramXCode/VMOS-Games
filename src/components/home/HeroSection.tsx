import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Gamepad2 } from "lucide-react";
import heroImage from "@/assets/hero-gaming-cafe.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="VMOS Game Station"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center py-20">
        <div className="flex justify-center mb-6">
          <Gamepad2 className="h-16 w-16 text-primary animate-pulse-neon" />
        </div>
        <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4">
          <span className="text-gradient">VMOS</span>{" "}
          <span className="text-foreground">GAME STATION</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Your ultimate gaming destination. Experience premium gaming on PC, PlayStation & Xbox.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/booking">
            <Button variant="neon" size="xl" className="w-full sm:w-auto">
              <Calendar className="h-5 w-5" />
              Book a Slot
            </Button>
          </Link>
          <Link to="/shop">
            <Button variant="outline" size="xl" className="w-full sm:w-auto">
              Explore Shop
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
