import { MapPin, ExternalLink, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const LocationSection = () => {
  const mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d978.8326111981042!2d77.3264557353086!3d11.088731308428162!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba9077441abbf25%3A0x1e421b4305ebe100!2sVMOS%20Game%20Station!5e0!3m2!1sen!2sin!4v1769011146519!5m2!1sen!2sin";
  const directionsUrl = "https://www.google.com/maps/dir/?api=1&destination=VMOS+Game+Station";
  const [mapKey, setMapKey] = useState(0);

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      {/* Map */}
      <div className="aspect-video w-full">
        <iframe
          key={mapKey}
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

      {/* Address & Buttons */}
      <div className="p-4">
        <div className="flex items-start gap-3 mb-4">
          <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-heading text-sm font-semibold mb-1">Our Location</h3>
            <p className="text-sm text-muted-foreground">
              5/1, 1st St, Sellam Nagar, Parapalayam,<br />
              Pirivu, Tiruppur, Andipalayam,<br />
              Tamil Nadu 641604
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            onClick={() => window.open(directionsUrl, "_blank")}
          >
            <Navigation className="h-4 w-4 mr-2" />
            Directions
          </Button>
          <Button
            variant="outline"
            onClick={() => setMapKey(prev => prev + 1)}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Recenter
          </Button>
        </div>
      </div>
    </div>
  );
};
