import { useWagmiConfig } from "@/features/wallet/context/config";
import { StakingABI } from "@/lib/abis/StakingABI";
import { denormalize, valueToBigInt } from "@/lib/bignumber";
import { logger } from "@/utils/logger";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import {
  waitForTransactionReceipt
} from "wagmi/actions";
import { useSwitchChain } from "wagmi";

// Define HexAddress type that was missing
type HexAddress = `0x${string}`;

// Improved chain metadata with proper typing
interface ChainMetadata {
  id: number;
  name: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: {
    default: {
      http: string[];
    };
  };
}

const CHAIN_METADATA: ChainMetadata[] = [
  {
    id: 12177,
    name: "Decaf Testnet",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ["https://americano-rollup-v1.comingdotsoon.xyz"],
      },
    },
  },
  {
    id: 421614,
    name: "Arbitrum Sepolia",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ["https://sepolia-rollup.arbitrum.io/rpc"],
      },
    },
  },
  {
    id: 84532,
    name: "Base Sepolia",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ["https://sepolia.base.org"],
      },
    },
  }
];

type Status = "idle" | "loading" | "success" | "error";

interface StepState {
  step: number;
  status: Status;
  error?: string;
}

interface StakeParams {
  addressStaking: HexAddress;
  amount: string;
  chain: string;
  decimals: number;
}

export const useStake = () => {
  const { address: userAddress } = useAccount();
  const { data: walletClient, refetch: refetchWalletClient } = useWalletClient();
  const wagmiConfig = useWagmiConfig();
  const { switchChain } = useSwitchChain();

  const [steps, setSteps] = useState<StepState[]>([
    {
      step: 1,
      status: "idle",
    },
  ]);

  const [txHash, setTxHash] = useState<HexAddress | null>(null);

  const mutation = useMutation({
    mutationFn: async ({
      addressStaking,
      amount,
      chain,
      decimals
    }: StakeParams) => {
      try {
        // Reset steps and txHash at the beginning
        setSteps([{ step: 1, status: "idle" }]);
        setTxHash(null);

        if (!amount || !userAddress) {
          throw new Error("Invalid parameters or wallet not connected");
        }

        // Update step to loading
        setSteps([{ step: 1, status: "loading" }]);

        const dAmount = denormalize(amount, decimals);

        // Find the matching chain configuration
        const findChain = CHAIN_METADATA.find((chainMeta) => chainMeta.name === chain);

        if (!findChain) {
          throw new Error(`Unsupported chain: ${chain}`);
        }

        // Get current wallet client
        let client = walletClient;
        if (!client) {
          throw new Error("Wallet client not available");
        }

        // Check and switch chain if necessary
        const currentChainId = await client.getChainId();

        if (currentChainId !== findChain.id) {
          logger.info(`Switching from chain ${currentChainId} to ${findChain.id}`);
          try {
            // Wait for the chain to be switched
            await switchChain({ chainId: findChain.id });

            // Important: Refetch the wallet client to get a fresh instance for the new chain
            const { data: updatedClient } = await refetchWalletClient();

            if (!updatedClient) {
              throw new Error("Failed to get updated wallet client after chain switch");
            }

            // Update our client reference
            client = updatedClient;

            // Verify the chain was actually switched
            const newChainId = await client.getChainId();
            if (newChainId !== findChain.id) {
              throw new Error(`Failed to switch to chain ${findChain.name}`);
            }

            logger.info(`Successfully switched to chain ${findChain.name} (ID: ${newChainId})`);
          } catch (switchError) {
            logger.error("Chain switching error:", switchError);
            throw new Error(`Failed to switch chain: ${(switchError as Error).message}`);
          }
        }

        // Execute the staking transaction with the current (possibly updated) client
        const hash = await client.writeContract({
          address: addressStaking,
          abi: StakingABI,
          functionName: "stake",
          args: [
            valueToBigInt(dAmount),
          ],
          value: valueToBigInt(dAmount),
          chain: findChain
        });

        if (!hash) {
          throw new Error("Transaction failed to submit");
        }

        // Update txHash state with the transaction hash
        setTxHash(hash);

        logger.info(`Transaction submitted with hash: ${hash}`);

        // Wait for transaction receipt
        const receipt = await waitForTransactionReceipt(
          wagmiConfig,
          {
            hash,
          }
        );

        // Update steps to success
        setSteps([{ step: 1, status: "success" }]);

        return receipt;

      } catch (e) {
        const error = e as Error;
        const errorMessage = error.message;

        // Don't show errors for user rejections, but log them
        if (
          errorMessage.includes("User rejected") ||
          errorMessage.includes("User denied") ||
          errorMessage.includes("user rejected")
        ) {
          logger.warn("Transaction canceled by user");
          setSteps([{ step: 1, status: "idle" }]);
          return null;
        }

        logger.error("Staking error:", error);

        // Update step status to error
        setSteps([{ step: 1, status: "error", error: errorMessage }]);

        throw error;
      }
    },
  });

  return { steps, mutation, txHash };
};