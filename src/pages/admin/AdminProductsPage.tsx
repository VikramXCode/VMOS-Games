import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

const defaultProducts: Product[] = [
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
];

export const AdminProductsPage = () => {
  const [products, setProducts] = useLocalStorage<Product[]>("vmos-products", defaultProducts);
  const [form, setForm] = useState<Omit<Product, "id">>({ name: "", price: 0, image: "", category: "" });

  const addProduct = () => {
    setProducts((prev) => [{ id: crypto.randomUUID(), ...form }, ...prev]);
    setForm({ name: "", price: 0, image: "", category: "" });
  };

  return (
    <AdminLayout>
      <div className="grid gap-4 md:grid-cols-[320px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Add Product</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Price</Label>
              <Input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            </div>
            <Button onClick={addProduct} disabled={!form.name || !form.price}>
              Add Product
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {products.length === 0 && <p className="text-sm text-muted-foreground">No products yet.</p>}
            {products.map((p) => (
              <div key={p.id} className="border border-border/60 rounded-lg p-3 space-y-2">
                <p className="font-semibold">{p.name}</p>
                <p className="text-primary font-heading">₹{p.price}</p>
                <p className="text-xs text-muted-foreground">{p.category || "Uncategorized"}</p>
                {p.image && (
                  <img src={p.image} alt={p.name} className="rounded-md h-24 object-cover w-full" />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setProducts((prev) => prev.filter((x) => x.id !== p.id))}
                >
                  Remove
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};
