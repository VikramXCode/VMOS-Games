import { Product } from "../../server/models/Product";
import { connectDatabase } from "../_lib/db";
import { requireAdmin } from "../_lib/auth";
import { handleCors, methodNotAllowed } from "../_lib/http";
import type { ApiRequest, ApiResponse } from "../_lib/types";

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (handleCors(req, res)) return;

  await connectDatabase();

  if (req.method === "GET") {
    const products = await Product.find({ inStock: true }).sort({ createdAt: -1 });
    res.status(200).json(products);
    return;
  }

  if (req.method === "POST") {
    const adminId = requireAdmin(req, res);
    if (!adminId) return;

    const payload = (req.body || {}) as {
      name?: string;
      price?: number;
      image?: string;
      imagePublicId?: string;
      category?: string;
      description?: string;
      inStock?: boolean;
    };

    const { name, price, image, imagePublicId, category, description, inStock } = payload;
    if (!name || !price || !image || !category) {
      res.status(400).json({ error: "name, price, image, and category are required" });
      return;
    }

    const product = await Product.create({
      name,
      price,
      image,
      imagePublicId,
      category,
      description,
      inStock,
    });

    res.status(201).json(product);
    return;
  }

  methodNotAllowed(res);
}
