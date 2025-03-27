import { queryProof } from "@/graphql/query"
import { ProofResponse } from "@/types/graphql/proof"
import { useQuery } from "@tanstack/react-query"
import request from "graphql-request"

interface Proof {
  originXTaskRespondeds: ProofResponse
}

export const useProofHistory = ({ address }: { address: HexAddress }) => {
  const { data, isLoading, refetch } = useQuery<Proof>({
    queryKey: ["originXTaskRespondeds", address],
    queryFn: async () => {
      return await request(process.env.NEXT_PUBLIC_API_GRAPHQL_URL || "", queryProof((address.toString())));
    },
    refetchInterval: 30000,
  })

  const originXTaskRespondeds = data?.originXTaskRespondeds.items || []

  return {
    dProof: originXTaskRespondeds,
    sLoading: isLoading,
    sRefetch: refetch,
  }
}