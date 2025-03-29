import { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import { JsonRpcProvider } from "@ethersproject/providers";
import { formatEther } from "ethers/lib/utils";

const LIST_PROVIDER = [
    { name: "Arbitrum Sepolia", url: "https://sepolia-rollup.arbitrum.io/rpc" },
    { name: "Base Sepolia", url: "https://sepolia.base.org" },
    { name: "Decaf Testnet", url: "https://americano-rollup-v1.comingdotsoon.xyz" }
];

export function useBalance({ chainName }) {
    const { address } = useAccount();
    const [balance, setBalance] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem(`balance_${chainName}_${address}`) || null;
        }
        return null;
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fetched, setFetched] = useState(false);

    const fetchBalance = useCallback(async () => {
        if (!address || !chainName) return;
        const providerInfo = LIST_PROVIDER.find(p => p.name === chainName);
        if (!providerInfo) {
            setError("Unsupported chain");
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const provider = new JsonRpcProvider(providerInfo.url);
            const balanceRaw = await provider.getBalance(address);
            const formattedBalance = formatEther(balanceRaw);
            setBalance(formattedBalance);
            localStorage.setItem(`balance_${chainName}_${address}`, formattedBalance);
            setFetched(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [address, chainName]);

    useEffect(() => {
        if (!fetched) {
            fetchBalance();
        }
    }, [fetchBalance, fetched]);

    return {
        balance,
        loading: isLoading,
        error,
        refresh: () => {
            setFetched(false);
            fetchBalance();
        }
    };
}
