import { logger } from '@/utils/logger';
import { useMemo } from 'react';

interface StakingItem {
  idProtocol?: string;
  nameProject?: string;
}

export const useProjectIdentifier = (stakingData: StakingItem[] | undefined) => {
  const findProjectIdentifier = useMemo(() => {
    return (aiResponse: { 
      response?: { 
        id_project?: string, 
        chain?: string, 
        nameProject?: string 
      } 
    } | string): string | undefined => {
      logger.info("Raw aiResponse:", JSON.stringify(aiResponse, null, 2));

      let aiResponseData = typeof aiResponse === 'object' && 'response' in aiResponse 
        ? aiResponse.response 
        : aiResponse;

      if (typeof aiResponseData === "string") {
        try {
          aiResponseData = JSON.parse(aiResponseData);
        } catch (error) {
          logger.error("Failed to parse aiResponseData:", error);
        }
      }

      const aiIdProject = typeof aiResponseData === 'object' && 'id_project' in aiResponseData && aiResponseData.id_project
        ? aiResponseData.id_project.replace(/"/g, '').trim()
        : undefined;
      const aiNameProject = typeof aiResponseData === 'object' && 'nameProject' in aiResponseData
        ? aiResponseData.nameProject?.replace(/"/g, '').trim()
        : undefined;

      logger.info("aiIdProject:", aiIdProject);
      logger.info("aiNameProject:", aiNameProject);

      if (aiIdProject) {
        const matchById = stakingData?.find(item => 
          item.idProtocol?.startsWith(`${aiIdProject}_`)
        );
        if (matchById) return matchById.idProtocol;
      }

      if (aiNameProject) {
        const matchByName = stakingData?.find(item => 
          item.nameProject?.trim().toLowerCase() === aiNameProject.toLowerCase()
        );
        if (matchByName) return matchByName.idProtocol;
      }

      return aiIdProject || aiNameProject;
    };
  }, [stakingData]);

  return { findProjectIdentifier };
};
