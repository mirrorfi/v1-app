"use server";
import { neon } from '@neondatabase/serverless';

const NEON_DB_URI = process.env.NEON_DB_URI;

let neon_cached: any = null;

export const connectToNeon = async() => {
  if (neon_cached) return neon_cached;

  if (!NEON_DB_URI) throw new Error("NEON_DB_URI is missing in environment variables.");

  neon_cached = neon(NEON_DB_URI); 
  return neon_cached;
}