"use server";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

let cached = (global as any).mongoose || { conn: null, promise: null };

export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;
  
  if (!MONGODB_URI) throw new Error("MONGODB_URI is missing in environment variables.");
  
  cached.promise = cached.promise || mongoose.connect(MONGODB_URI, {
    dbName: "mirrorfi_v1",
    bufferCommands: false,
  }).then((mongoose) => {
    console.log("Connected to MongoDB database");
    return mongoose;
  }).catch((error) => {
    console.error("Database connection error:", error);
    throw error;
  });
  
  cached.conn = await cached.promise;

  return cached.conn;
}
