import { useWagmiConfig } from "@/features/wallet/context/config";
import { MockStakingABI } from "@/lib/abis/MockStakingABI";
import { denormalize, valueToBigInt } from "@/lib/bignumber";
import { logger } from "@/utils/logger";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useAccount } from "wagmi";
import {
  waitForTransactionReceipt,
  writeContract,
} from "wagmi/actions";

type Status = "idle" | "loading" | "success" | "error";

export const useStake = () => {
  const { address: userAddress } = useAccount();
  const wagmiConfig = useWagmiConfig();

  const [steps, setSteps] = useState<
    Array<{
      step: number;
      status: Status;
      error?: string;
    }>
  >([
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
      decimals
    }: {
      addressStaking: HexAddress;
      amount: string;
      decimals: number;
    }) => {
      try {
        // Reset steps
        setSteps([{ step: 1, status: "idle" }]);

        if (!amount || !userAddress) {
          throw new Error("Invalid parameters");
        }

        const dAmount = denormalize(amount || "0", decimals);

        setSteps((prev) =>
          prev.map((item) => {
            if (item.step === 1) {
              return { ...item, status: "loading" };
            }
            return item;
          })
        );

        // const approveHash = await writeContract(wagmiConfig, {
        //   address: addressToken,
        //   abi: erc20Abi,
        //   functionName: "approve",
        //   args: [
        //     addressStaking,
        //     valueToBigInt(dAmount + 10),
        //   ],
        // });

        // await waitForTransactionReceipt(wagmiConfig, {
        //   hash: approveHash,
        // });

        const txHash = await writeContract(wagmiConfig, {
          address: addressStaking,
          abi: MockStakingABI,
          functionName: "stake",
          args: [
            valueToBigInt(dAmount),
          ],
        });

        setTxHash(txHash);

        const result = await waitForTransactionReceipt(wagmiConfig, {
          hash: txHash,
        });

        setSteps((prev) =>
          prev.map((item) => {
            if (item.step === 1) {
              return { ...item, status: "success" };
            }
            return item;
          })
        );

        return result;
      } catch (e) {
        logger.error("Error", e);

        setSteps((prev) =>
          prev.map((step) => {
            if (step.status === "loading") {
              return { ...step, status: "error", error: (e as Error).message };
            }
            return step;
          })
        );

        throw e;
      }
    },
  });

  return { steps, mutation, txHash };
};