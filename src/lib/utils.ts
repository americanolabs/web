import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function urlSepoliaBasescan({ address, txHash, type }: { address?: string, txHash?: string, type?: 'transaction' | 'address' }) {
  return `https://pacific-explorer.sepolia-testnet.manta.network/${type === 'address' ? 'address' : 'tx'}/${address || txHash}`;
}