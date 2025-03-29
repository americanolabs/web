import { StakingABI } from "@/lib/abis/StakingABI";
import { useAccount, useReadContract } from "wagmi";
import { z } from "zod";
import { normalize } from "@/lib/bignumber";

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

export const StakingSchema = z.object({
  amountStaked: z.number(),
  numberOfDays: z.number(),
  registrationTimestamp: z.number(),
});

export type Staking = z.infer<typeof StakingSchema>;

export const useCurStaking = ({
  addressProtocol,
  chain
}: {
  addressProtocol: HexAddress;
  chain: string;
}) => {
  const { address } = useAccount();

  const findChain = CHAIN_METADATA.find((chainMeta) => chainMeta.name === chain);

  const { data, isLoading: csLoading }: { data: [bigint, bigint, bigint] | undefined, isLoading: boolean } = useReadContract({
    address: address && addressProtocol,
    abi: StakingABI,
    functionName: address ? "stakes" : undefined,
    args: address ? [address] : undefined,
    chainId: findChain ? findChain.id : undefined,
    query: {
      enabled: !!address && !!addressProtocol
    }
  });

  if (!address) {
    return {
      cStaking: {},
      csLoading: false,
    };
  }

  const formattedData = data
    ? {
        amountStaked: Number(normalize(Number(data[0]), 18)),
        numberOfDays: Number(data[1]),
        registrationTimestamp: Number(data[2])
      }
    : undefined;

  return {
    cStaking: formattedData as Staking | undefined,
    csLoading,
  };
};
