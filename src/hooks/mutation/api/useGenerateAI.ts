import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import apiAgent from "@/lib/api-agent";
import useGenerateContent from "@/hooks/query/api/useGeneratedContent";
import { logger } from "@/utils/logger";
import { useStaking } from "@/hooks/query/useStaking";
import { useProjectIdentifier } from "./useProjectIdentifier";

export const dataClassify = [
  {
    "risk": "low",
    "prompt": "I have $1000 to invest, give me one best investment plan for low risk profile based on the agent's APY knowledge base with highest APY. Use this json format for output = {\"id_project\":\"id_project\", \"chain\":\"chain\"}. Do not add any characters that are not included in the format!"
  },
  {
    "risk": "medium",
    "prompt": "I have $1000 to invest, give me one best investment plan for medium risk profile based on the agent's APY knowledge base on project stable coin or project with between token BTC, ETH, SOL and BNB. Use this format for output = {\"id_project\":\"id_project\", \"chain\":\"chain\"}. Do not add any characters that are not included in the format!"
  },
  {
    "risk": "high",
    "prompt": "I have $1000 to invest, give me one best investment plan for high risk profile based on the agent's APY knowledge base with highest APY. Use this json format for output = {\"id_project\":\"id_project\", \"chain\":\"chain\"}. Do not add any characters that are not included in the format!"
  }
] as const;

type Status = "idle" | "loading" | "success" | "error";

interface StepStatus {
  step: number;
  status: Status;
  error?: string;
}

export const useGenerateAI = () => {
  const { sData } = useStaking();
  const { findProjectIdentifier } = useProjectIdentifier(sData);

  const { setRisk, setIdProtocol, idProtocolSaved, riskSaved } = useGenerateContent();

  const [steps, setSteps] = useState<StepStatus[]>([
    { step: 1, status: "idle" },
    { step: 2, status: "idle" }
  ]);

  const updateStepStatus = (stepNumber: number, status: Status, error?: string) => {
    setSteps(prev =>
      prev.map(step =>
        step.step === stepNumber
          ? { ...step, status, ...(error ? { error } : {}) }
          : step
      )
    );
  };

  const mutation = useMutation({
    mutationFn: async ({ formattedSubmission }: { formattedSubmission: string }) => {
      try {
        setSteps([
          { step: 1, status: "idle" },
          { step: 2, status: "idle" }
        ]);

        updateStepStatus(1, "loading");
        const riskResponse = await apiAgent.post("generate-risk-profile", { data: formattedSubmission });

        if (!riskResponse || !riskResponse.risk) {
          throw new Error("Invalid risk profile response");
        }

        setRisk(riskResponse.risk);
        updateStepStatus(1, "success");

        const matchingClassification = dataClassify.find(
          (item) => item.risk === riskResponse.risk
        );

        if (!matchingClassification) {
          throw new Error(`No matching risk classification for: ${riskResponse.risk}`);
        }

        updateStepStatus(2, "loading");
        const protocolResponse = await apiAgent.post("generate-protocol", {
          query: matchingClassification.prompt
        });

        if (!protocolResponse) {
          throw new Error("Invalid protocol response");
        }

        const projectId = findProjectIdentifier(protocolResponse);

        logger.info("Project ID found:", projectId);

        if (!projectId) {
          throw new Error("Could not determine project identifier");
        }

        setIdProtocol(projectId);
        updateStepStatus(2, "success");

        return {
          risk: riskResponse.risk,
          projectId
        };

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);

        setSteps(prev =>
          prev.map(step =>
            step.status === "loading"
              ? { ...step, status: "error", error: errorMessage }
              : step
          )
        );

        logger.error("Error in AI generation", error);

        throw error;
      }
    },
  });

  return {
    steps,
    mutation,
    riskSaved,
    idProtocolSaved
  };
};