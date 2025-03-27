import { useMultiProvider } from "@/features/chains/hooks";
import { useMemo } from "react";
import { initWagmi } from "./EvmWalletContext";

export const useWagmiConfig = () => {
  const multiProvider = useMultiProvider();

  const { wagmiConfig } = useMemo(() => initWagmi(multiProvider), [multiProvider]);

  return wagmiConfig;
}