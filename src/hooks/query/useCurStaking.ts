import { MockStakingABI } from "@/lib/abis/MockStakingABI";
import { useAccount, useReadContract } from "wagmi";
import { z } from "zod";
import { normalize } from "@/lib/bignumber";
import { DECIMALS_MOCK_TOKEN } from "@/lib/constants";

export const StakingSchema = z.object({
  amountStaked: z.bigint(),
  numberOfDays: z.bigint(),
  registrationTimestamp: z.bigint(),
  isValid: z.boolean(),
});

export type Staking = z.infer<typeof StakingSchema>;

export const useCurStaking = ({
  addressProtocol,
}: {
  addressProtocol: HexAddress;
}) => {
  const { address } = useAccount();

  const { data, isLoading: csLoading }: { data: [bigint, bigint, bigint] | undefined, isLoading: boolean } = useReadContract({
    address: addressProtocol,
    abi: MockStakingABI,
    functionName: "stakes",
    args: [address],
  });

  const formattedData = data
    ? {
        amountStaked: normalize(Number(data[0]), DECIMALS_MOCK_TOKEN),
        numberOfDays: Number(data[1]),
        registrationTimestamp: Number(data[2])
      }
    : undefined;

  return {
    cStaking: formattedData as Staking | undefined,
    csLoading,
  };
};
