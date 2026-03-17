import multer from "multer";
import { connectDatabase } from "../_lib/db";
import { requireAdmin } from "../_lib/auth";
import { handleCors, methodNotAllowed } from "../_lib/http";
import type { ApiRequest, ApiResponse } from "../_lib/types";
import { isCloudinaryConfigured, uploadImageBuffer } from "../../server/lib/cloudinary";

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

const runMiddleware = (req: ApiRequest, res: ApiResponse): Promise<void> =>
  new Promise((resolve, reject) => {
    upload.single("image")(req as never, res as never, (result: unknown) => {
      if (result instanceof Error) {
        reject(result);
        return;
      }
      resolve();
    });
  });

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (handleCors(req, res)) return;
  if (req.method !== "POST") {
    methodNotAllowed(res);
    return;
  }

  await connectDatabase();

  const adminId = requireAdmin(req, res);
  if (!adminId) return;

  if (!isCloudinaryConfigured) {
    res.status(500).json({ error: "Cloudinary is not configured on server" });
    return;
  }

  try {
    await runMiddleware(req, res);

    const file = (req as ApiRequest & { file?: { buffer: Buffer; mimetype: string } }).file;
    if (!file) {
      res.status(400).json({ error: "Image file is required" });
      return;
    }

    const uploaded = await uploadImageBuffer(file.buffer, file.mimetype);
    res.status(201).json({
      url: uploaded.secureUrl,
      publicId: uploaded.publicId,
    });
  } catch {
    res.status(400).json({ error: "Failed to upload image" });
  }
}
