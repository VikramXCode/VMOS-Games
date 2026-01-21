import { Phone, Mail, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border/50 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-heading text-xl font-bold text-gradient mb-3">
              VMOS GAME STATION
            </h3>
            <p className="text-muted-foreground text-sm">
              Your ultimate gaming destination. Play, compete, and win!
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-sm font-semibold text-primary mb-3">
              CONTACT US
            </h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <a href="tel:+919876543210" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Phone className="h-4 w-4" />
                +91 98765 43210
              </a>
              <a href="mailto:info@vmosgamestation.com" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail className="h-4 w-4" />
                info@vmosgamestation.com
              </a>
            </div>
          </div>

          {/* Location */}
          <div>
            <h4 className="font-heading text-sm font-semibold text-primary mb-3">
              LOCATION
            </h4>
            <p className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
              123 Gaming Street, Tech Hub,<br />
              Bangalore, Karnataka 560001
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/50 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} VMOS Game Station. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
