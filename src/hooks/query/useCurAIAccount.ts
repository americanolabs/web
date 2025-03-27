import { useAddressAI } from "./useAddressAI";

export const useCurAIAccount = () => {
  const { addressAI } = useAddressAI();

  return {
    curAddressAI: addressAI,
    curAvatarAI: "/default-avatar.svg",
    isLoadingAI: false,
    errorAI: ""
  };
};