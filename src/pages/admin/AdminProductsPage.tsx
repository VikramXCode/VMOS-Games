import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { Plus } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { resolveImageUrl } from "@/lib/image";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  imagePublicId?: string;
  category: string;
}

const mapProduct = (raw: Record<string, unknown>): Product => ({
  id: raw._id || raw.id,
  name: String(raw.name || ""),
  price: Number(raw.price) || 0,
  image: resolveImageUrl(String(raw.image || "")),
  imagePublicId: raw.imagePublicId ? String(raw.imagePublicId) : undefined,
  category: String(raw.category || ""),
});

export const AdminProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({ name: "", price: 0, category: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [removeId, setRemoveId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

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

  useEffect(() => {
    const openSheet = () => setSheetOpen(true);
    window.addEventListener("admin-primary-action", openSheet);
    return () => window.removeEventListener("admin-primary-action", openSheet);
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
      setSheetOpen(false);
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

      <Button onClick={() => setSheetOpen(true)} className="w-full rounded-xl h-11 mb-4 lg:w-auto">
        <Plus className="h-4 w-4 mr-1" /> Add Product
      </Button>

      <Card className="rounded-2xl bg-surface-2/90 border-border/60">
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {isLoading && (
              <div className="space-y-2 col-span-full">
                <div className="h-16 rounded-xl animate-shimmer" />
                <div className="h-16 rounded-xl animate-shimmer" />
              </div>
            )}
            {products.length === 0 && <p className="text-sm text-muted-foreground">No products yet.</p>}
            {products.map((p) => (
              <div key={p.id} className="border border-border/60 rounded-2xl p-3 space-y-2 bg-background/30">
                <p className="font-semibold">{p.name}</p>
                <p className="text-primary font-heading">₹{p.price}</p>
                <p className="text-xs text-muted-foreground">{p.category || "Uncategorized"}</p>
                {p.image && (
                  <img src={p.image} alt={p.name} className="rounded-lg h-28 object-cover w-full" />
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full rounded-xl"
                  disabled={removeId === p.id}
                  onClick={() => void removeProduct(p.id)}
                >
                  {removeId === p.id ? "Removing..." : "Remove"}
                </Button>
              </div>
            ))}
          </CardContent>
      </Card>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl bg-[#0B0F1A] border-t border-primary/20">
          <div className="w-12 h-1.5 rounded-full bg-border mx-auto mt-2 mb-3" />
          <SheetHeader className="text-left px-1">
            <SheetTitle className="font-heading text-lg">Add Product</SheetTitle>
          </SheetHeader>
          <div className="space-y-3 mt-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-xl h-11" />
            </div>
            <div className="space-y-2">
              <Label>Price</Label>
              <Input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="rounded-xl h-11"
              />
            </div>
            <div className="space-y-2">
              <Label>Product Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="rounded-xl"
              />
              {previewUrl && (
                <img src={previewUrl} alt="Preview" className="rounded-xl h-32 object-cover w-full border border-border/60" />
              )}
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded-xl h-11" />
            </div>
            <Button className="w-full rounded-xl h-11" onClick={addProduct} disabled={!form.name || !form.price || !form.category || !imageFile || isSaving}>
              {isSaving ? "Saving..." : "Save Product"}
            </Button>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        </SheetContent>
      </Sheet>
    </AdminLayout>
  );
};
