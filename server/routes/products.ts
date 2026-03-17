import { Router, Request, Response } from "express";
import multer from "multer";
import { Product } from "../models/Product";
import { authMiddleware } from "../middleware/auth";
import {
  deleteCloudinaryImage,
  isCloudinaryConfigured,
  uploadImageBuffer,
} from "../lib/cloudinary";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image files are allowed"));
      return;
    }
    cb(null, true);
  },
});

// POST upload product image to Cloudinary (admin only)
router.post(
  "/upload-image",
  authMiddleware,
  upload.single("image"),
  async (req: Request, res: Response) => {
    try {
      if (!isCloudinaryConfigured) {
        res.status(500).json({ error: "Cloudinary is not configured on server" });
        return;
      }

      if (!req.file) {
        res.status(400).json({ error: "Image file is required" });
        return;
      }

      const uploaded = await uploadImageBuffer(req.file.buffer, req.file.mimetype);
      res.status(201).json({
        url: uploaded.secureUrl,
        publicId: uploaded.publicId,
      });
    } catch (err) {
      res.status(400).json({ error: "Failed to upload image" });
    }
  }
);

// GET all products
router.get("/", async (_req: Request, res: Response) => {
  try {
    const products = await Product.find({ inStock: true }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// GET single product
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) { res.status(404).json({ error: "Product not found" }); return; }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// POST create product (admin only)
router.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { name, price, image, imagePublicId, category, description, inStock } = req.body;
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
  } catch (err) {
    res.status(400).json({ error: "Failed to create product" });
  }
});

// PUT update product (admin only)
router.put("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const existing = await Product.findById(req.params.id);
    if (!existing) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) { res.status(404).json({ error: "Product not found" }); return; }

    const nextPublicId = req.body.imagePublicId;
    if (nextPublicId && existing.imagePublicId && nextPublicId !== existing.imagePublicId) {
      await deleteCloudinaryImage(existing.imagePublicId);
    }

    res.json(product);
  } catch (err) {
    res.status(400).json({ error: "Failed to update product" });
  }
});

// DELETE product (admin only)
router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (product?.imagePublicId) {
      await deleteCloudinaryImage(product.imagePublicId);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

export const productRoutes = router;
