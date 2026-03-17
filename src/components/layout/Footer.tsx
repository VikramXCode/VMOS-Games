import { Phone, Mail, MapPin, Gamepad2 } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = {
  gaming: [
    { name: "Book a Slot", path: "/booking" },
    { name: "Tournaments", path: "/tournaments" },
    { name: "Leaderboard", path: "/leaderboard" },
    { name: "Gallery", path: "/gallery" },
  ],
  shop: [
    { name: "Browse Products", path: "/shop" },
  ],
};

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-surface-0 border-t border-border/50 py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-glow">
                <Gamepad2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-display text-lg font-bold block leading-none text-primary">VMOS</span>
                <span className="text-[10px] text-muted-foreground tracking-widest font-heading uppercase">Game Station</span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your ultimate gaming destination. Play, compete, and win!
            </p>
          </div>

          {/* Gaming Links */}
          <div>
            <h4 className="font-heading text-sm font-semibold text-primary mb-3 uppercase tracking-wider">
              Gaming
            </h4>
            <ul className="space-y-2">
              {footerLinks.gaming.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-sm font-semibold text-primary mb-3 uppercase tracking-wider">
              Contact Us
            </h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <a href="tel:+917010905241" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span className="font-mono">+91 7010905241</span>
              </a>
              <a href="mailto:vmtech.cool@gmail.com" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail className="h-4 w-4 flex-shrink-0" />
                vmtech.cool@gmail.com
              </a>
            </div>
          </div>

          {/* Location */}
          <div>
            <h4 className="font-heading text-sm font-semibold text-primary mb-3 uppercase tracking-wider">
              Location
            </h4>
            <p className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>
                5/1, 1st St, Sellam Nagar, Parapalayam,<br />
                Pirivu, Tiruppur, Tamil Nadu 641604
              </span>
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            © {year} VMOS Game Station. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/60">
            Made with ❤️ in Tiruppur
          </p>
        </div>
      </div>
    </footer>
  );
};
