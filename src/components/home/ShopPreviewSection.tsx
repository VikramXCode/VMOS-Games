import { ShoppingCart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const products = [
  { name: "GTA V", price: 2499, category: "Game", image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&h=400&fit=crop" },
  { name: "PS5 Controller", price: 5999, category: "Controller", image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop" },
  { name: "Gaming Headset", price: 3499, category: "Accessory", image: "https://images.unsplash.com/photo-1599669454699-248893623440?w=400&h=400&fit=crop" },
  { name: "RGB Mouse", price: 1999, category: "Accessory", image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop" },
  { name: "Mechanical KB", price: 4499, category: "Accessory", image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=400&h=400&fit=crop" },
  { name: "Xbox Controller", price: 4999, category: "Controller", image: "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=400&h=400&fit=crop" },
];

const openWhatsApp = () => {
  window.open("https://wa.me/917010905241?text=Hi! I want to enquire about a product.", "_blank");
};

export const ShopPreviewSection = () => {
  return (
    <section id="shop" className="py-10 px-4 bg-gradient-to-b from-transparent via-secondary/5 to-transparent">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-neon-pink" />
            <h2 className="text-xl font-heading font-bold">Gaming Shop</h2>
          </div>
          <Link
            to="/shop"
            className="text-xs text-primary font-heading font-semibold hover:underline underline-offset-4 transition-colors"
          >
            View All →
          </Link>
        </div>

        {/* Horizontal Scroll Products */}
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory">
          {products.map((product, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-40 rounded-2xl bg-surface-2 border border-border/50 overflow-hidden hover:border-primary/30 transition-all duration-300 snap-start hover-lift"
            >
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute top-2 left-2 text-[10px] font-heading font-semibold bg-black/60 backdrop-blur px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {product.category}
                </span>
              </div>
              <div className="p-3">
                <h3 className="font-heading font-semibold text-sm truncate mb-1">{product.name}</h3>
                <p className="text-primary font-mono font-medium text-sm">₹{product.price.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>

        <Button
          onClick={openWhatsApp}
          variant="outline"
          className="w-full border-border text-foreground font-heading font-semibold rounded-xl py-5 mt-3 hover:bg-surface-3"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Enquire on WhatsApp
        </Button>
      </div>
    </section>
  );
};
