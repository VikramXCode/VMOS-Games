import { Product } from "../../server/models/Product";
import { deleteCloudinaryImage } from "../../server/lib/cloudinary";
import { connectDatabase } from "../_lib/db";
import { requireAdmin } from "../_lib/auth";
import { handleCors, methodNotAllowed } from "../_lib/http";
import type { ApiRequest, ApiResponse } from "../_lib/types";

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (handleCors(req, res)) return;

  await connectDatabase();

  const id = (req.query?.id && (Array.isArray(req.query.id) ? req.query.id[0] : req.query.id)) || "";
  if (!id) {
    res.status(400).json({ error: "id is required" });
    return;
  }

  if (req.method === "GET") {
    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.status(200).json(product);
    return;
  }

  const adminId = requireAdmin(req, res);
  if (!adminId) return;

  if (req.method === "PUT") {
    const existing = await Product.findById(id);
    if (!existing) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    const product = await Product.findByIdAndUpdate(id, req.body || {}, { new: true });
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    const body = (req.body || {}) as { imagePublicId?: string };
    if (body.imagePublicId && existing.imagePublicId && body.imagePublicId !== existing.imagePublicId) {
      await deleteCloudinaryImage(existing.imagePublicId);
    }

    res.status(200).json(product);
    return;
  }

  if (req.method === "DELETE") {
    const product = await Product.findByIdAndDelete(id);
    if (product?.imagePublicId) {
      await deleteCloudinaryImage(product.imagePublicId);
    }
    res.status(200).json({ success: true });
    return;
  }

  methodNotAllowed(res);
}
