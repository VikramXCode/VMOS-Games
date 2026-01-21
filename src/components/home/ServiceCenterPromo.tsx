import { MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import serviceCenterImg from "@/assets/service-center.jpg";

export const ServiceCenterPromo = () => {
  const whatsappNumber = "919876543210";
  const phoneNumber = "+919876543210";

  const openWhatsApp = () => {
    window.open(`https://wa.me/${whatsappNumber}?text=Hi! I need help with console/controller repair.`, "_blank");
  };

  const callNow = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      {/* Image */}
      <div className="relative aspect-square md:aspect-video">
        <img
          src={serviceCenterImg}
          alt="Service Center"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-heading text-lg font-bold text-primary mb-1">
            Service Center
          </h3>
          <p className="text-sm text-foreground/90">
            Professional repair for consoles & controllers
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 flex gap-3">
        <Button
          variant="whatsapp"
          className="flex-1"
          onClick={openWhatsApp}
        >
          <MessageCircle className="h-5 w-5" />
          WhatsApp
        </Button>
        <Button
          variant="call"
          className="flex-1"
          onClick={callNow}
        >
          <Phone className="h-5 w-5" />
          Call Now
        </Button>
      </div>
    </div>
  );
};
