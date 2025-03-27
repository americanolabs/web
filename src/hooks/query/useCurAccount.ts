import { useAccount } from "wagmi";

export const useCurAccount = () => {
  const { address: curAddress, isDisconnected } = useAccount();

  return {
    curAddress,
    curAvatar: "/default-avatar.svg",
    isDisconnected,
    isLoading: false,
    error: ""
  };
};