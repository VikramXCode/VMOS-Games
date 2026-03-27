import { ShoppingCart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { resolveImageUrl } from "@/lib/image";

interface ProductPreview {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
}

const openWhatsApp = () => {
  window.open("https://wa.me/917010905241?text=Hi! I want to enquire about a product.", "_blank");
};

export const ShopPreviewSection = () => {
  const [products, setProducts] = useState<ProductPreview[]>([]);

  useEffect(() => {
    api.products.list()
      .then((items) => {
        setProducts(
          items.slice(0, 6).map((item) => ({
            id: item._id || item.id,
            name: item.name,
            price: Number(item.price) || 0,
            category: item.category,
            image: resolveImageUrl(item.image),
          }))
        );
      })
      .catch(() => setProducts([]));
  }, []);

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
          {products.map((product) => (
            <div
              key={product.id}
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
