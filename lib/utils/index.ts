import { VersionedTransaction } from "@solana/web3.js";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleError = (error: any) => {
  console.error(error);
  throw new Error(typeof error === "string" ? error : JSON.stringify(error));
};

export function stringToByteArray(str: string, length: number): number[] {
  const bytes = Buffer.from(str, "utf-8");
  const array = new Array(length).fill(0);

  // Copy bytes, truncate if too long
  for (let i = 0; i < Math.min(bytes.length, length); i++) {
    array[i] = bytes[i];
  }

  return array;
}

export function v0TxToBase64(tx: VersionedTransaction): string {
  return Buffer.from(tx.serialize()).toString("base64");
}
