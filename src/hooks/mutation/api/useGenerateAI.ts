import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import apiAgent from "@/lib/api-agent";
import { ADDRESS_AVS } from "@/lib/constants";
import { AVSAbi } from "@/lib/abis/AVSAbi";
import { useAccount } from "wagmi";
import { useStaking } from "@/hooks/query/useStaking";
import useGenerateContent from "@/hooks/query/api/useGeneratedContent";
import { writeContract } from "wagmi/actions";
import { logger } from "@/utils/logger";
import { useWagmiConfig } from "@/features/wallet/context/config";

export const dataClassify = [
  {
    "risk": "low",
    "prompt": "I have $1000 to invest, give me one best investment plan based on the agent's APY knowledge base with stable coin highest APY. Use this json format for output = {\"id_project\":\"id_project\"}. Do not add any characters that are not included in the format!"
  },
  {
    "risk": "medium",
    "prompt": "I have $1000 to invest, give me one best investment plan based on the agent's APY knowledge base on project stable coin or project with between token BTC, ETH, SOL and BNB. Use this format for output = {\"id_project\":\"id_project\"}. Do not add any characters that are not included in the format!"
  },
  {
    "risk": "high",
    "prompt": "I have $1000 to invest, give me one best investment plan based on the agent's APY knowledge base with highest APY. Use this json format for output = {\"id_project\":\"id_project\"}. Do not add any characters that are not included in the format!"
  }
]

type Status = "idle" | "loading" | "success" | "error";

export const useGenerateAI = () => {
  const { address } = useAccount()
  const { sData } = useStaking();
  const wagmiConfig = useWagmiConfig();

  const { risk, setRisk, protocolId, setProtocolId } = useGenerateContent();

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
    {
      step: 2,
      status: "idle",
    }
  ]);

  const mutation = useMutation({
    mutationFn: async ({
      formattedSubmission
    }: {
      formattedSubmission: string;
    }) => {
      try {
        setSteps([{ step: 1, status: "idle" }]);

        setSteps((prev) =>
          prev.map((item) => {
            if (item.step === 1) {
              return { ...item, status: "loading" };
            }
            return item;
          })
        );

        const response = await apiAgent.post("generate-risk-profile", { data: formattedSubmission, "user_address": address });
        setRisk(response.risk);

        setSteps((prev) =>
          prev.map((item) => {
            if (item.step === 1) {
              return { ...item, status: "success" };
            }
            return item;
          })
        );

        const matchingClassification = dataClassify.find(
          (item) => item.risk === response.risk);

        setSteps((prev) =>
          prev.map((item) => {
            if (item.step === 2) {
              return { ...item, status: "loading" };
            }
            return item;
          })
        );

        if (matchingClassification) {
          const response = await apiAgent.post("query", { query: matchingClassification.prompt });

          let findStaking = sData?.find((item) => {
            return item.idProtocol?.trim() === response.response[0]?.id_project.replace(/"/g, "")
          });

          if (!findStaking) {
            findStaking = sData?.find((item) => {
              return item.nameToken?.trim() === response.response[0]?.id_project.replace(/"/g, "")
            })
          }

          if (response.response[0]?.id_project) {
            try {
              const txHash = await writeContract(wagmiConfig, {
                // to: ADDRESS_AVS,
                // data: encodeFunctionData({
                //   abi: AVSAbi,
                //   functionName: "taskAgent",
                //   args: [findStaking?.idProtocol]
                // }),
                // account: address as HexAddress,
                address: ADDRESS_AVS,
                abi: AVSAbi,
                functionName: "taskAgent",
                args: [findStaking?.idProtocol],
              });

              if (txHash) {
                setProtocolId(response.response[0]?.id_project);
              }
            } catch (contractError) {
              logger.error("Contract interaction failed:", contractError);
              throw new Error(`Contract execution failed: ${(contractError as Error).message}`);
            }
          }
        }

        setSteps((prev) =>
          prev.map((item) => {
            if (item.step === 2) {
              return { ...item, status: "success" };
            }
            return item;
          })
        );

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

  return { steps, mutation, risk, protocolId };
};