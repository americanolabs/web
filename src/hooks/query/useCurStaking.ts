import { StakingABI } from "@/lib/abis/StakingABI";
import { useAccount, useReadContract } from "wagmi";
import { z } from "zod";
import { normalize } from "@/lib/bignumber";

export const StakingSchema = z.object({
  amountStaked: z.number(),
  numberOfDays: z.number(),
  registrationTimestamp: z.number(),
});

export type Staking = z.infer<typeof StakingSchema>;

export const useCurStaking = ({
  addressProtocol,
}: {
  addressProtocol: HexAddress;
}) => {
  const { address } = useAccount();

  const { data, isLoading: csLoading }: { data: [bigint, bigint, bigint] | undefined, isLoading: boolean } = useReadContract({
    address: address && addressProtocol,
    abi: StakingABI,
    functionName: address ? "stakes" : undefined,
    args: address ? [address] : undefined,
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
