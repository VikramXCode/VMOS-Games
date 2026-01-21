import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

const products: Product[] = [
  {
    id: "1",
    name: "GTA V",
    price: 2499,
    image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&h=400&fit=crop",
    category: "Games",
  },
  {
    id: "2",
    name: "Red Dead Redemption 2",
    price: 2999,
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=400&fit=crop",
    category: "Games",
  },
  {
    id: "3",
    name: "PS5 DualSense Controller",
    price: 5999,
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop",
    category: "Accessories",
  },
  {
    id: "4",
    name: "Xbox Wireless Controller",
    price: 4999,
    image: "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=400&h=400&fit=crop",
    category: "Accessories",
  },
  {
    id: "5",
    name: "Gaming Headset Pro",
    price: 3499,
    image: "https://images.unsplash.com/photo-1599669454699-248893623440?w=400&h=400&fit=crop",
    category: "Accessories",
  },
  {
    id: "6",
    name: "RGB Gaming Mouse",
    price: 1999,
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop",
    category: "Accessories",
  },
  {
    id: "7",
    name: "Mechanical Keyboard",
    price: 4499,
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=400&h=400&fit=crop",
    category: "Accessories",
  },
  {
    id: "8",
    name: "Gaming Chair",
    price: 15999,
    image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=400&h=400&fit=crop",
    category: "Furniture",
  },
];

const ShopPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-2xl md:text-3xl font-bold">
            Gaming <span className="text-primary">Shop</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Games, consoles & accessories
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="glass-card rounded-xl overflow-hidden group hover:border-primary/50 transition-all duration-300"
            >
              {/* Product Image */}
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                <span className="absolute top-2 left-2 bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded-md font-medium">
                  {product.category}
                </span>
              </div>

              {/* Product Info */}
              <div className="p-3">
                <h3 className="font-medium text-sm mb-1 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-primary font-heading font-bold">
                  ₹{product.price.toLocaleString()}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-3"
                >
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Coming Soon Notice */}
        <div className="glass-card rounded-xl p-6 mt-8 text-center">
          <p className="text-muted-foreground">
            🛒 Full e-commerce functionality coming soon! <br />
            <span className="text-sm">Visit our store or call us to place orders.</span>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default ShopPage;
