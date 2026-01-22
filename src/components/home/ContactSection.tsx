import { Phone, Mail, MapPin, Clock } from "lucide-react";

export const ContactSection = () => {
  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="font-heading text-lg font-bold text-primary mb-4">Contact Us</h3>
      <div className="space-y-4">
        <a
          href="tel:+917010905241"
          className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
        >
          <Phone className="h-5 w-5 text-primary" />
          <span>+91 7010905241</span>
        </a>
        <a
          href="mailto:vmtech.cool@gmail.com"
          className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
        >
          <Mail className="h-5 w-5 text-primary" />
          <span>vmtech.cool@gmail.com</span>
        </a>
        <div className="flex items-start gap-3 text-sm">
          <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
          <span className="text-muted-foreground">
            5/1, 1st St, Sellam Nagar, Parapalayam,<br />
            Pirivu, Tiruppur, Andipalayam,<br />
            Tamil Nadu 641604
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Clock className="h-5 w-5 text-primary" />
          <span className="text-muted-foreground">
            Open Daily: 10:00 AM - 11:00 PM
          </span>
        </div>
      </div>
    </div>
  );
};
