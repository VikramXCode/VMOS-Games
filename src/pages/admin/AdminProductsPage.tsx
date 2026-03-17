import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  imagePublicId?: string;
  category: string;
}

const mapProduct = (raw: any): Product => ({
  id: raw._id || raw.id,
  name: raw.name,
  price: Number(raw.price) || 0,
  image: raw.image,
  imagePublicId: raw.imagePublicId,
  category: raw.category,
});

export const AdminProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({ name: "", price: 0, category: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [removeId, setRemoveId] = useState<string | null>(null);

  const previewUrl = useMemo(() => {
    if (!imageFile) return "";
    return URL.createObjectURL(imageFile);
  }, [imageFile]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const loadProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.products.list();
      setProducts(data.map(mapProduct));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadProducts();
  }, []);

  const addProduct = async () => {
    if (!form.name || !form.price || !form.category || !imageFile) return;

    setIsSaving(true);
    setError(null);
    try {
      const uploaded = await api.products.uploadImage(imageFile);
      const created = await api.products.create({
        name: form.name,
        price: form.price,
        category: form.category,
        image: uploaded.url,
        imagePublicId: uploaded.publicId,
      });

      setProducts((prev) => [mapProduct(created), ...prev]);
      setForm({ name: "", price: 0, category: "" });
      setImageFile(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create product");
    } finally {
      setIsSaving(false);
    }
  };

  const removeProduct = async (id: string) => {
    setRemoveId(id);
    setError(null);
    try {
      await api.products.delete(id);
      setProducts((prev) => prev.filter((item) => item.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to remove product");
    } finally {
      setRemoveId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-4">
        <h1 className="text-xl font-heading font-semibold">Product Management</h1>
        <p className="text-sm text-muted-foreground">Add and manage shop products with Cloudinary image upload.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
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
              <Label>Product Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
              {previewUrl && (
                <img src={previewUrl} alt="Preview" className="rounded-md h-24 object-cover w-full" />
              )}
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            </div>
            <Button className="w-full" onClick={addProduct} disabled={!form.name || !form.price || !form.category || !imageFile || isSaving}>
              {isSaving ? "Saving..." : "Add Product"}
            </Button>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {isLoading && <p className="text-sm text-muted-foreground">Loading products...</p>}
            {products.length === 0 && <p className="text-sm text-muted-foreground">No products yet.</p>}
            {products.map((p) => (
              <div key={p.id} className="border border-border/60 rounded-xl p-3 space-y-2">
                <p className="font-semibold">{p.name}</p>
                <p className="text-primary font-heading">₹{p.price}</p>
                <p className="text-xs text-muted-foreground">{p.category || "Uncategorized"}</p>
                {p.image && (
                  <img src={p.image} alt={p.name} className="rounded-lg h-28 object-cover w-full" />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  disabled={removeId === p.id}
                  onClick={() => void removeProduct(p.id)}
                >
                  {removeId === p.id ? "Removing..." : "Remove"}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};
