import { X, Plus, Minus, ShoppingCart, Trash2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart();

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) return;

    const itemsList = items
      .map(
        (item, index) =>
          `${index + 1}. ${item.name} × ${item.quantity} = ₹${(item.price * item.quantity).toLocaleString()}`
      )
      .join("\n");

    const message = encodeURIComponent(
      `Hi VMOS! I'd like to order:\n\n${itemsList}\n\nTotal: ₹${totalPrice.toLocaleString()}\n\nPlease confirm availability and payment details.`
    );

    window.open(`https://wa.me/917010905241?text=${message}`, "_blank");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 bottom-0 w-full sm:w-96 bg-surface-1 border-l border-border/50 z-50 flex flex-col transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <h2 className="font-heading font-bold text-lg">Your Cart</h2>
            {totalItems > 0 && (
              <span className="bg-primary/20 text-primary text-xs font-mono font-bold px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-surface-3 flex items-center justify-center hover:bg-surface-4 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <ShoppingCart className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground font-heading font-semibold">Cart is empty</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Add products from the shop</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 p-3 rounded-xl bg-surface-2 border border-border/50 animate-fade-in-up"
              >
                {/* Product Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                />

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-semibold text-sm truncate">{item.name}</h3>
                  <p className="text-xs text-muted-foreground">{item.category}</p>
                  <p className="text-primary font-mono font-medium text-sm mt-1">
                    ₹{item.price.toLocaleString()}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 rounded-md bg-surface-3 flex items-center justify-center hover:bg-surface-4 transition-colors"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="font-mono text-sm font-medium w-5 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 rounded-md bg-surface-3 flex items-center justify-center hover:bg-surface-4 transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer — Summary & Checkout */}
        {items.length > 0 && (
          <div className="border-t border-border/50 p-4 space-y-3">
            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-heading">Total</span>
              <span className="text-xl font-mono font-bold text-primary">
                ₹{totalPrice.toLocaleString()}
              </span>
            </div>

            {/* Checkout Button */}
            <Button
              onClick={handleWhatsAppCheckout}
              className="w-full bg-[#25D366] hover:bg-[#22c55e] text-white font-heading font-bold py-5 rounded-xl text-base"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Order via WhatsApp
            </Button>

            {/* Clear Cart */}
            <button
              onClick={clearCart}
              className="w-full text-xs text-muted-foreground hover:text-destructive transition-colors text-center py-1"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
};
