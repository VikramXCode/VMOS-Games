import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { resolveImageUrl } from "@/lib/image";

export interface ServiceContent {
  icon: string;
  title: string;
  description: string;
  price: string;
  color: string;
  glow: string;
}

export interface GalleryContentItem {
  url: string;
  category: string;
  title: string;
  tall?: boolean;
}

export interface PublicContent {
  heroImages: string[];
  services: ServiceContent[];
  location?: {
    mapEmbedUrl?: string;
    address?: string;
    directionsUrl?: string;
  };
  contact?: {
    phone?: string;
    email?: string;
    whatsapp?: string;
    hours?: string;
    instagram?: string;
    facebook?: string;
  };
  gallery: GalleryContentItem[];
}

interface PublicContentContextValue {
  content: PublicContent;
  isLoading: boolean;
  reload: () => Promise<void>;
}

const DEFAULT_CONTENT: PublicContent = {
  heroImages: [
    resolveImageUrl("hero-gaming-cafe.jpg"),
    resolveImageUrl("gaming-setup-1.jpg"),
    resolveImageUrl("gaming-setup-2.jpg"),
    resolveImageUrl("gaming-setup-3.jpg"),
  ],
  services: [
    {
      icon: "Gamepad2",
      title: "Gaming Sessions",
      description: "PC, PS5, PS4, PS3, PS2 & Xbox",
      price: "Rates Vary",
      color: "from-cyan-500 to-blue-600",
      glow: "group-hover:shadow-cyan-500/20",
    },
    {
      icon: "ShoppingCart",
      title: "Game Shop",
      description: "Games, consoles & accessories",
      price: "Best Prices",
      color: "from-purple-500 to-pink-600",
      glow: "group-hover:shadow-purple-500/20",
    },
    {
      icon: "Trophy",
      title: "Tournaments",
      description: "Weekly competitions & prizes",
      price: "₹200 Entry",
      color: "from-yellow-500 to-orange-600",
      glow: "group-hover:shadow-yellow-500/20",
    },
    {
      icon: "Wrench",
      title: "Repairs",
      description: "Console & controller service",
      price: "Quick Fix",
      color: "from-green-500 to-emerald-600",
      glow: "group-hover:shadow-green-500/20",
    },
  ],
  location: {
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d978.8326111981042!2d77.3264557353086!3d11.088731308428162!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba9077441abbf25%3A0x1e421b4305ebe100!2sVMOS%20Game%20Station!5e0!3m2!1sen!2sin!4v1769011146519!5m2!1sen!2sin",
    address: "5/1, 1st St, Sellam Nagar, Parapalayam, Pirivu, Tiruppur, Tamil Nadu 641604",
    directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=VMOS+Game+Station",
  },
  contact: {
    phone: "+917010905241",
    email: "vmtech.cool@gmail.com",
    whatsapp: "+917010905241",
    hours: "Daily: 10 AM - 11 PM",
    instagram: "",
    facebook: "",
  },
  gallery: [
    { url: resolveImageUrl("hero-gaming-cafe.jpg"), category: "arena", title: "Main Arena", tall: true },
    { url: resolveImageUrl("gaming-setup-1.jpg"), category: "setup", title: "Console Zone", tall: false },
    { url: resolveImageUrl("gaming-setup-2.jpg"), category: "setup", title: "PC Bay", tall: false },
    { url: resolveImageUrl("gaming-setup-3.jpg"), category: "tournament", title: "Tournament Night", tall: true },
    { url: resolveImageUrl("service-center.jpg"), category: "arena", title: "Service Center", tall: false },
    { url: resolveImageUrl("tournament-poster.jpg"), category: "tournament", title: "Winners", tall: false },
  ],
};

const PublicContentContext = createContext<PublicContentContextValue | undefined>(undefined);

export const PublicContentProvider = ({ children }: { children: React.ReactNode }) => {
  const [content, setContent] = useState<PublicContent>(DEFAULT_CONTENT);
  const [isLoading, setIsLoading] = useState(true);

  const reload = async () => {
    setIsLoading(true);
    try {
      const data = await api.content.get();

      const apiHeroImages = Array.isArray(data?.heroImages)
        ? data.heroImages.map((image: string) => resolveImageUrl(image)).filter(Boolean)
        : [];
      const apiServices = Array.isArray(data?.services) ? data.services : [];
      const apiGallery = Array.isArray(data?.gallery)
        ? data.gallery
            .map((item: GalleryContentItem) => ({
              ...item,
              url: resolveImageUrl(item.url),
            }))
            .filter((item) => Boolean(item.url))
        : [];

      setContent({
        heroImages: apiHeroImages.length > 0 ? apiHeroImages : DEFAULT_CONTENT.heroImages,
        services: apiServices.length > 0 ? apiServices : DEFAULT_CONTENT.services,
        location: {
          ...DEFAULT_CONTENT.location,
          ...(data?.location || {}),
        },
        contact: {
          ...DEFAULT_CONTENT.contact,
          ...(data?.contact || {}),
        },
        gallery: apiGallery.length > 0 ? apiGallery : DEFAULT_CONTENT.gallery,
      });
    } catch {
      setContent(DEFAULT_CONTENT);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void reload();
  }, []);

  const value = useMemo(() => ({ content, isLoading, reload }), [content, isLoading]);
  return <PublicContentContext.Provider value={value}>{children}</PublicContentContext.Provider>;
};

export const usePublicContent = () => {
  const ctx = useContext(PublicContentContext);
  if (!ctx) throw new Error("usePublicContent must be used within PublicContentProvider");
  return ctx;
};
