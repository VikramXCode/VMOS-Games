import { Gamepad2, ShoppingCart, Trophy, Wrench } from "lucide-react";

const services = [
  {
    icon: Gamepad2,
    title: "Gaming Sessions",
    description: "Hourly slots on PC, PS4, PS3, PS2 & Xbox",
  },
  {
    icon: ShoppingCart,
    title: "Game & Console Sales",
    description: "Latest games, consoles & accessories",
  },
  {
    icon: Trophy,
    title: "Tournaments",
    description: "Weekly gaming competitions with prizes",
  },
  {
    icon: Wrench,
    title: "Service Center",
    description: "Console & controller repair services",
  },
];

export const ServicesSection = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {services.map((service, index) => (
        <div
          key={index}
          className="glass-card rounded-xl p-4 text-center hover:border-primary/50 transition-all duration-300 group"
        >
          <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <service.icon className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-heading text-sm font-semibold mb-1">{service.title}</h3>
          <p className="text-xs text-muted-foreground">{service.description}</p>
        </div>
      ))}
    </div>
  );
};
