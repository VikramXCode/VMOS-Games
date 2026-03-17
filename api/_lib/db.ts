import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/vmos";

type CachedMongoose = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalWithMongoose = globalThis as typeof globalThis & {
  __vmos_mongoose__?: CachedMongoose;
};

const cached: CachedMongoose = globalWithMongoose.__vmos_mongoose__ || {
  conn: null,
  promise: null,
};

globalWithMongoose.__vmos_mongoose__ = cached;

export const connectDatabase = async (): Promise<typeof mongoose> => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI);
  }

  cached.conn = await cached.promise;
  return cached.conn;
};
