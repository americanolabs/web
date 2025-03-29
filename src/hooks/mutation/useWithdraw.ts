import { useWagmiConfig } from "@/features/wallet/context/config";
import { StakingABI } from "@/lib/abis/StakingABI";
import { logger } from "@/utils/logger";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import {
  waitForTransactionReceipt
} from "wagmi/actions";
import { useSwitchChain } from "wagmi";

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
  chain: string;
}

export const useWithdraw = () => {
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
      chain,
    }: StakeParams) => {
      try {
        setSteps([{ step: 1, status: "idle" }]);
        setTxHash(null);

        if (!userAddress) {
          throw new Error("Invalid parameters or wallet not connected");
        }

        setSteps([{ step: 1, status: "loading" }]);

        const findChain = CHAIN_METADATA.find((chainMeta) => chainMeta.name === chain);

        if (!findChain) {
          throw new Error(`Unsupported chain: ${chain}`);
        }

        let client = walletClient;
        if (!client) {
          throw new Error("Wallet client not available");
        }

        const currentChainId = await client.getChainId();

        if (currentChainId !== findChain.id) {
          logger.info(`Switching from chain ${currentChainId} to ${findChain.id}`);
          try {
            await switchChain({ chainId: findChain.id });

            const { data: updatedClient } = await refetchWalletClient();

            if (!updatedClient) {
              throw new Error("Failed to get updated wallet client after chain switch");
            }

            client = updatedClient;

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

        const hash = await client.writeContract({
          address: addressStaking,
          abi: StakingABI,
          functionName: "withdrawAll",
          args: [],
          chain: findChain
        });

        if (!hash) {
          throw new Error("Transaction failed to submit");
        }

        setTxHash(hash);

        logger.info(`Transaction submitted with hash: ${hash}`);

        const receipt = await waitForTransactionReceipt(
          wagmiConfig,
          {
            hash,
          }
        );

        setSteps([{ step: 1, status: "success" }]);

        return receipt;

      } catch (e) {
        const error = e as Error;
        const errorMessage = error.message;

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

        setSteps([{ step: 1, status: "error", error: errorMessage }]);

        throw error;
      }
    },
  });

  return { steps, mutation, txHash };
};