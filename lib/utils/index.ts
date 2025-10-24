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

export function base64ToV0Tx(base64: string): VersionedTransaction {
  const buffer = Buffer.from(base64, "base64");
  return VersionedTransaction.deserialize(Uint8Array.from(buffer));
}

export async function wrappedFetch(url: string, method: string = 'GET', body: any = null) {
  const res = await fetch(url, {
    method,
    body: JSON.stringify(body),
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error);
  }

  return data;
}