import { MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export const LocationSection = () => {
  const mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.0099762970966!2d77.60916231482204!3d12.971598990854832!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBangalore%2C%20Karnataka%2C%20India!5e0!3m2!1sen!2sus!4v1645524455555!5m2!1sen!2sus";
  const directionsUrl = "https://www.google.com/maps/dir/?api=1&destination=12.971598990854832,77.60916231482204";

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      {/* Map */}
      <div className="aspect-video w-full">
        <iframe
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="VMOS Game Station Location"
        />
      </div>

      {/* Address & Button */}
      <div className="p-4">
        <div className="flex items-start gap-3 mb-4">
          <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-heading text-sm font-semibold mb-1">Our Location</h3>
            <p className="text-sm text-muted-foreground">
              123 Gaming Street, Tech Hub,<br />
              Bangalore, Karnataka 560001
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => window.open(directionsUrl, "_blank")}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Open in Google Maps
        </Button>
      </div>
    </div>
  );
};
