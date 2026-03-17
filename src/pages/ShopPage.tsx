import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Check, MessageCircle, Search, X, Filter } from "lucide-react";
import { ProductSearch } from "@/components/ai/ProductSearch";
import { useMemo, useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

const ShopPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [aiFilteredIds, setAiFilteredIds] = useState<string[] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { addItem, isInCart, totalItems } = useCart();

  // Fetch products from API
  useEffect(() => {
    api.products.list()
      .then((data) => {
        const mapped = data.map((p) => ({
          id: p._id || p.id,
          name: p.name,
          price: p.price,
          image: p.image,
          category: p.category,
        }));
        setProducts(mapped);
      })
      .catch(() => setProducts([]));
  }, []);

  const categories = useMemo(() => ["All", ...Array.from(new Set(products.map((item) => item.category).filter(Boolean)))], [products]);

  const filteredProducts = useMemo(() => {
    let result = products;

    // AI filter
    if (aiFilteredIds && aiFilteredIds.length > 0) {
      const order = new Map(aiFilteredIds.map((id, idx) => [id, idx]));
      result = result
        .filter((p) => order.has(p.id))
        .sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
    }

    // Category filter
    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    return result;
  }, [aiFilteredIds, products, selectedCategory, searchQuery]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold">
              Gaming <span className="text-gradient">Shop</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Games, consoles & accessories
            </p>
          </div>

          {/* Cart Button */}
          <Button
            onClick={() => setIsCartOpen(true)}
            variant="outline"
            className="relative border-primary/30 hover:bg-primary/10 font-heading"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Cart
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground text-xs font-mono font-bold flex items-center justify-center rounded-full animate-pulse-neon">
                {totalItems}
              </span>
            )}
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-2 border border-border/50 rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 font-body placeholder:text-muted-foreground/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "flex-shrink-0 px-4 py-2 rounded-full text-sm font-heading font-semibold transition-all duration-200",
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground neon-glow"
                  : "bg-surface-2 text-muted-foreground hover:text-foreground hover:bg-surface-3 border border-border/50"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* AI Search */}
        <ProductSearch products={products} onApply={setAiFilteredIds} />

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {filteredProducts.map((product, index) => {
            const inCart = isInCart(product.id);
            return (
              <div
                key={product.id}
                className="rounded-2xl bg-surface-2 border border-border/50 overflow-hidden group hover:border-primary/30 transition-all duration-300 hover-lift animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Product Image */}
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2.5 py-1 rounded-full font-heading font-semibold uppercase tracking-wider">
                    {product.category}
                  </span>
                </div>

                {/* Product Info */}
                <div className="p-3">
                  <h3 className="font-heading font-semibold text-sm mb-1 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-primary font-mono font-bold mb-3">
                    ₹{product.price.toLocaleString()}
                  </p>
                  <Button
                    onClick={() =>
                      addItem({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        category: product.category,
                      })
                    }
                    variant={inCart ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "w-full font-heading font-semibold transition-all duration-200",
                      inCart
                        ? "bg-primary/20 text-primary border-primary/30 hover:bg-primary/30"
                        : "hover:bg-primary/10 hover:border-primary/30"
                    )}
                  >
                    {inCart ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Added
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-1" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <Filter className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground font-heading font-semibold">No products found</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Try adjusting your filters</p>
          </div>
        )}

        {/* WhatsApp CTA */}
        <div className="rounded-2xl bg-gradient-to-r from-[#25D366]/10 to-[#128C7E]/10 border border-[#25D366]/20 p-6 mt-8 text-center">
          <MessageCircle className="h-8 w-8 text-[#25D366] mx-auto mb-3" />
          <p className="font-heading font-bold text-lg mb-1">Can't find what you need?</p>
          <p className="text-muted-foreground text-sm mb-4">
            Message us on WhatsApp for custom orders and bulk pricing
          </p>
          <Button
            onClick={() => window.open("https://wa.me/917010905241?text=Hi! I have a product enquiry.", "_blank")}
            className="bg-[#25D366] hover:bg-[#22c55e] text-white font-heading font-bold px-6"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Chat with Us
          </Button>
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </Layout>
  );
};

export default ShopPage;
