import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Gamepad2,
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Navigation,
  ExternalLink,
  Trophy,
  ShoppingCart,
  Wrench,
  Calendar,
  Users,
  Instagram,
  Facebook,
  ChevronLeft,
  ChevronRight,
  Zap,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Navigation Items - Reordered
const navItems = [
  { id: "arena", label: "Arena" },
  { id: "location", label: "Location" },
  { id: "booking", label: "Book Slot" },
  { id: "services", label: "Services" },
  { id: "shop", label: "Shop" },
  { id: "tournaments", label: "Tournaments" },
  { id: "contact", label: "Contact" },
];

// Services Data
const services = [
  {
    icon: Gamepad2,
    title: "Gaming Sessions",
    description: "PC, PS5, PS4, PS3, PS2 & Xbox",
    color: "from-cyan-500 to-blue-600",
    price: "₹60/hr",
  },
  {
    icon: ShoppingCart,
    title: "Game Shop",
    description: "Games, consoles & accessories",
    color: "from-purple-500 to-pink-600",
    price: "Best Prices",
  },
  {
    icon: Trophy,
    title: "Tournaments",
    description: "Weekly competitions & prizes",
    color: "from-yellow-500 to-orange-600",
    price: "₹200 Entry",
  },
  {
    icon: Wrench,
    title: "Repairs",
    description: "Console & controller service",
    color: "from-green-500 to-emerald-600",
    price: "Quick Fix",
  },
];

// Gallery Images
const galleryImages = [
  "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800&h=600&fit=crop",
];

// Shop Products
const products = [
  { name: "GTA V", price: 2499, category: "Game", image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&h=400&fit=crop" },
  { name: "PS5 Controller", price: 5999, category: "Controller", image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop" },
  { name: "Gaming Headset", price: 3499, category: "Accessory", image: "https://images.unsplash.com/photo-1599669454699-248893623440?w=400&h=400&fit=crop" },
  { name: "RGB Mouse", price: 1999, category: "Accessory", image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop" },
  { name: "Mechanical KB", price: 4499, category: "Accessory", image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=400&h=400&fit=crop" },
  { name: "Xbox Controller", price: 4999, category: "Controller", image: "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=400&h=400&fit=crop" },
];

// Consoles for booking
const consoles = [
  { name: "Gaming PC", price: "₹80/hr", icon: "🖥️" },
  { name: "PlayStation 5", price: "₹100/hr", icon: "🎮" },
  { name: "PlayStation 4", price: "₹60/hr", icon: "🎮" },
  { name: "PlayStation 3", price: "₹40/hr", icon: "🎮" },
  { name: "PlayStation 2", price: "₹30/hr", icon: "🎮" },
  { name: "Xbox Series X", price: "₹100/hr", icon: "🎮" },
];

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("arena");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mapKey, setMapKey] = useState(0);

  // Auto-slide gallery
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  // Scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map((item) => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 80;

      sections.forEach((section) => {
        if (section) {
          const top = section.offsetTop;
          const height = section.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 60;
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({ top: elementPosition, behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  const openWhatsApp = () => {
    window.open("https://wa.me/917010905241?text=Hi! I want to book a gaming slot.", "_blank");
  };

  const callNow = () => {
    window.location.href = "tel:+917010905241";
  };

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      {/* Fixed Header - Compact Mobile */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-white/10 safe-area-inset">
        <div className="px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Gamepad2 className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-sm tracking-tight leading-none">
                  <span className="text-cyan-400">VMOS</span>
                </span>
                <span className="text-[10px] text-white/50 tracking-wider">GAME STATION</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-semibold rounded-full transition-all",
                    activeSection === item.id
                      ? "text-black bg-cyan-400"
                      : "text-white/60 hover:text-white hover:bg-white/10"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 active:bg-white/10 transition-colors"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Full Screen Overlay */}
        <div
          className={cn(
            "lg:hidden fixed inset-0 top-14 bg-black backdrop-blur-xl transition-all duration-300 z-50",
            isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
        >
          <nav className="px-6 py-8 space-y-2">
            {navItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                style={{ animationDelay: `${index * 50}ms` }}
                className={cn(
                  "w-full text-left px-5 py-4 text-lg font-semibold rounded-2xl transition-all flex items-center justify-between",
                  isMenuOpen && "animate-fade-in-up",
                  activeSection === item.id
                    ? "text-black bg-gradient-to-r from-cyan-400 to-cyan-500"
                    : "text-white/80 bg-white/5 active:bg-white/10"
                )}
              >
                {item.label}
                <ChevronRight className="h-5 w-5 opacity-50" />
              </button>
            ))}
            
            {/* Quick Actions in Menu */}
            <div className="pt-6 space-y-3">
              <Button
                onClick={openWhatsApp}
                className="w-full bg-[#25D366] hover:bg-[#22c55e] text-white font-bold py-5 rounded-2xl text-base"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                WhatsApp Us
              </Button>
              <Button
                onClick={callNow}
                variant="outline"
                className="w-full border-white/20 text-white font-bold py-5 rounded-2xl text-base"
              >
                <Phone className="h-5 w-5 mr-2" />
                Call Now
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* ==================== SECTION 1: GAMING ARENA ==================== */}
      <section id="arena" className="pt-14">
        {/* Hero Banner */}
        <div className="relative h-[45vh] min-h-[280px] overflow-hidden">
          {/* Background Slider */}
          {galleryImages.map((img, index) => (
            <div
              key={index}
              className={cn(
                "absolute inset-0 transition-all duration-700",
                index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
              )}
            >
              <img src={img} alt={`Gaming setup ${index + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/50 to-[#0a0a0f]/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-purple-500/10" />
          
          {/* Content - positioned at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-4 pb-6">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-cyan-400" />
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Premium Gaming</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black mb-1 leading-tight">
              <span className="text-white">Gaming Arena</span>
            </h1>
            <p className="text-white/60 text-sm max-w-sm">
              Premium PCs, PlayStation & Xbox consoles
            </p>
          </div>

          {/* Slider Navigation - Top Right */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={prevSlide}
              className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center active:bg-black/60 border border-white/10"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextSlide}
              className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center active:bg-black/60 border border-white/10"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Slide Indicators - Bottom Right */}
          <div className="absolute bottom-6 right-4 flex gap-1.5">
            {galleryImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  index === currentSlide ? "bg-cyan-400 w-5" : "bg-white/40 w-1.5"
                )}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ==================== SECTION 2: MAP LOCATION ==================== */}
      <section id="location" className="py-8 px-4">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-5 w-5 text-cyan-400" />
          <h2 className="text-xl font-bold">Our Location</h2>
        </div>

        <div className="rounded-2xl overflow-hidden bg-white/5 border border-white/5">
          {/* Map */}
          <div className="aspect-[4/3] md:aspect-video relative" style={{ touchAction: 'auto' }}>
            <iframe
              key={mapKey}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d978.8326111981042!2d77.3264557353086!3d11.088731308428162!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba9077441abbf25%3A0x1e421b4305ebe100!2sVMOS%20Game%20Station!5e0!3m2!1sen!2sin!4v1769011146519!5m2!1sen!2sin"
              className="absolute inset-0 w-full h-full"
              style={{ border: 0, pointerEvents: 'auto', touchAction: 'auto' }}
              allow="geolocation"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="VMOS Game Station Location"
            />
          </div>
          
          {/* Address Card */}
          <div className="p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-white/50 mb-0.5">Address</p>
                <p className="text-sm font-medium leading-relaxed">
                  5/1, 1st St, Sellam Nagar, Parapalayam, Pirivu, Tiruppur, Tamil Nadu 641604
                </p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => window.open("https://www.google.com/maps/dir/?api=1&destination=VMOS+Game+Station", "_blank")}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl py-5"
              >
                <Navigation className="h-4 w-4 mr-2" />
                Directions
              </Button>
              <Button
                onClick={() => setMapKey(prev => prev + 1)}
                variant="outline"
                className="border-white/20 text-white font-semibold rounded-xl py-5"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Recenter
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SECTION 3: BOOKING SLOT ==================== */}
      <section id="booking" className="py-8 px-4 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-cyan-400" />
          <h2 className="text-xl font-bold">Book Your Slot</h2>
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/5 p-4">
          {/* Console Grid */}
          <p className="text-xs text-white/50 uppercase tracking-wider mb-3">Available Consoles & Pricing</p>
          <div className="grid grid-cols-2 gap-2 mb-5">
            {consoles.map((console, index) => (
              <div
                key={index}
                className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 active:bg-white/10 transition-colors"
              >
                <span className="text-xl">{console.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{console.name}</p>
                  <p className="text-xs text-cyan-400 font-bold">{console.price}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="space-y-2">
            <Button
              onClick={openWhatsApp}
              className="w-full bg-[#25D366] hover:bg-[#22c55e] text-white font-bold py-5 rounded-xl text-base"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Book via WhatsApp
            </Button>
            <Button
              onClick={callNow}
              variant="outline"
              className="w-full border-white/20 text-white font-semibold py-5 rounded-xl"
            >
              <Phone className="h-5 w-5 mr-2" />
              Call to Book
            </Button>
          </div>
        </div>
      </section>

      {/* ==================== SECTION 4: OUR SERVICES ==================== */}
      <section id="services" className="py-8 px-4">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-5 w-5 text-purple-400" />
          <h2 className="text-xl font-bold">Our Services</h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {services.map((service, index) => (
            <div
              key={index}
              className="group p-4 rounded-2xl bg-white/5 border border-white/5 active:border-white/20 transition-all"
            >
              <div className={cn(
                "w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3 shadow-lg",
                service.color
              )}>
                <service.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-bold text-sm mb-0.5">{service.title}</h3>
              <p className="text-[11px] text-white/50 mb-2 leading-relaxed">{service.description}</p>
              <span className="inline-block text-xs font-bold text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded-full">
                {service.price}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== SECTION 5: GAMING SHOP ==================== */}
      <section id="shop" className="py-8 px-4 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-pink-400" />
            <h2 className="text-xl font-bold">Gaming Shop</h2>
          </div>
          <button 
            onClick={openWhatsApp}
            className="text-xs text-cyan-400 font-semibold"
          >
            View All →
          </button>
        </div>

        {/* Horizontal Scroll Products */}
        <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          {products.map((product, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-36 rounded-2xl bg-white/5 border border-white/5 overflow-hidden"
            >
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 text-[10px] font-semibold bg-black/60 backdrop-blur px-2 py-0.5 rounded-full">
                  {product.category}
                </span>
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm truncate mb-1">{product.name}</h3>
                <p className="text-cyan-400 font-bold text-sm">₹{product.price.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>

        <Button
          onClick={openWhatsApp}
          variant="outline"
          className="w-full border-white/10 text-white font-semibold rounded-xl py-4 mt-2"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Enquire for Products
        </Button>
      </section>

      {/* ==================== SECTION 6: GAMING TOURNAMENTS ==================== */}
      <section id="tournaments" className="py-8 px-4">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="h-5 w-5 text-yellow-400" />
          <h2 className="text-xl font-bold">Tournaments</h2>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-yellow-500/10 via-orange-500/5 to-red-500/5 border border-yellow-500/20 p-5">
          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center shadow-lg shadow-yellow-500/20">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">VMOS Championship</h3>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                <span className="text-xs text-white/60">Weekly tournaments</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            <div className="p-3 rounded-xl bg-black/20 text-center">
              <Calendar className="h-4 w-4 mx-auto mb-1 text-yellow-400" />
              <p className="text-xs font-bold">Weekends</p>
            </div>
            <div className="p-3 rounded-xl bg-black/20 text-center">
              <Users className="h-4 w-4 mx-auto mb-1 text-orange-400" />
              <p className="text-xs font-bold">32 Slots</p>
            </div>
            <div className="p-3 rounded-xl bg-black/20 text-center">
              <Trophy className="h-4 w-4 mx-auto mb-1 text-amber-400" />
              <p className="text-xs font-bold">₹10,000</p>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2 text-sm mb-5 bg-black/10 rounded-xl p-3">
            <p className="flex items-center gap-2">
              <span>🎮</span>
              <span className="text-white/80"><strong className="text-white">Games:</strong> FIFA, COD, Tekken & more</span>
            </p>
            <p className="flex items-center gap-2">
              <span>💰</span>
              <span className="text-white/80"><strong className="text-white">Entry:</strong> ₹200 per participant</span>
            </p>
            <p className="flex items-center gap-2">
              <span>🏆</span>
              <span className="text-white/80"><strong className="text-white">Prizes:</strong> Cash + Trophies</span>
            </p>
          </div>

          <Button
            onClick={openWhatsApp}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold py-5 rounded-xl text-base"
          >
            Register Now
          </Button>
        </div>
      </section>

      {/* ==================== SECTION 7: CONTACT INFO ==================== */}
      <section id="contact" className="py-8 px-4 bg-white/[0.02]">
        <div className="flex items-center gap-2 mb-4">
          <Phone className="h-5 w-5 text-green-400" />
          <h2 className="text-xl font-bold">Contact Us</h2>
        </div>

        <div className="space-y-3">
          {/* Phone */}
          <a
            href="tel:+917010905241"
            className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 active:bg-white/10 transition-colors"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
              <Phone className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-white/50">Phone</p>
              <p className="font-bold">+91 7010905241</p>
            </div>
            <ChevronRight className="h-5 w-5 text-white/30 ml-auto" />
          </a>

          {/* Email */}
          <a
            href="mailto:vmtech.cool@gmail.com"
            className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 active:bg-white/10 transition-colors"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center shadow-lg">
              <Mail className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-white/50">Email</p>
              <p className="font-bold text-sm">vmtech.cool@gmail.com</p>
            </div>
            <ChevronRight className="h-5 w-5 text-white/30 ml-auto" />
          </a>

          {/* Hours */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-yellow-600 flex items-center justify-center shadow-lg">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-white/50">Working Hours</p>
              <p className="font-bold">Open Daily: 10 AM - 11 PM</p>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/5">
          <p className="text-xs text-white/50 uppercase tracking-wider mb-3">Follow Us</p>
          <div className="flex gap-3">
            <a
              href="#"
              className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 active:opacity-80 transition-opacity"
            >
              <Instagram className="h-5 w-5 text-white" />
              <span className="font-semibold text-sm">Instagram</span>
            </a>
            <a
              href="#"
              className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 active:opacity-80 transition-opacity"
            >
              <Facebook className="h-5 w-5 text-white" />
              <span className="font-semibold text-sm">Facebook</span>
            </a>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="py-8 px-4 border-t border-white/5">
        <div className="text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center shadow-lg">
              <Gamepad2 className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <span className="font-black text-lg block leading-none">
                <span className="text-cyan-400">VMOS</span>
              </span>
              <span className="text-[10px] text-white/50 tracking-wider">GAME STATION</span>
            </div>
          </div>
          
          <p className="text-white/40 text-xs mb-4">
            Your Ultimate Gaming Destination
          </p>
          
          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-4 mb-6 text-xs">
            <button onClick={() => scrollToSection("arena")} className="text-white/50 hover:text-cyan-400">Arena</button>
            <button onClick={() => scrollToSection("booking")} className="text-white/50 hover:text-cyan-400">Book Slot</button>
            <button onClick={() => scrollToSection("shop")} className="text-white/50 hover:text-cyan-400">Shop</button>
            <button onClick={() => scrollToSection("tournaments")} className="text-white/50 hover:text-cyan-400">Tournaments</button>
            <button onClick={() => scrollToSection("contact")} className="text-white/50 hover:text-cyan-400">Contact</button>
          </div>
          
          <p className="text-white/30 text-[10px]">
            © {new Date().getFullYear()} VMOS Game Station. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <button
        onClick={openWhatsApp}
        className="fixed bottom-5 right-5 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 active:scale-95 transition-transform z-40"
      >
        <MessageCircle className="h-7 w-7 text-white" />
      </button>

      {/* Bottom Safe Area Spacer for iOS */}
      <div className="h-20 md:h-0" />
    </div>
  );
};

export default HomePage;
