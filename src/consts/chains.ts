import { arbitrumsepolia } from '@hyperlane-xyz/registry';
import { ChainMap, ChainMetadata } from '@hyperlane-xyz/sdk';
import { ProtocolType } from '@hyperlane-xyz/utils';

// A map of chain names to ChainMetadata
// Chains can be defined here, in chains.json, or in chains.yaml
// Chains already in the SDK need not be included here unless you want to override some fields
// Schema here: https://github.com/hyperlane-xyz/hyperlane-monorepo/blob/main/typescript/sdk/src/metadata/chainMetadataTypes.ts
export const chains: ChainMap<ChainMetadata & { mailbox?: Address }> = {
  // solanamainnet: {
  //   ...solanamainnet,
  //   // SVM chains require mailbox addresses for the token adapters
  //   mailbox: solanamainnetAddresses.mailbox,
  //   // Including a convenient rpc override because the Solana public RPC does not allow browser requests from localhost
  //   rpcUrls: process.env.NEXT_PUBLIC_SOLANA_RPC_URL
  //     ? [{ http: process.env.NEXT_PUBLIC_SOLANA_RPC_URL }, ...solanamainnet.rpcUrls]
  //     : solanamainnet.rpcUrls,
  // },
  // eclipsemainnet: {
  //   ...eclipsemainnet,
  //   mailbox: eclipsemainnetAddresses.mailbox,
  // },
  arbitrumsepolia: {
    ...arbitrumsepolia,
    mailbox: "0x598facE78a4302f11E3de0bee1894Da0b2Cb71F8",
    rpcUrls: [{ http: `https://arb-sepolia.g.alchemy.com/v2/vwDTCZX0XZnU6flxj8YzYZuMaOKI3EX9` }]
  },
  decaftestnet: {
    protocol: ProtocolType.Ethereum,
    chainId: 12177,
    domainId: 12177,
    logoURI: "/decaf.svg",
    nativeToken: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    name: 'decaftestnet',
    displayName: 'Decaf Testnet',
    mailbox: "0xD95d2F7C38bfA2f9d7A618474Bc619470f01001F",
    rpcUrls: [{
      http: 'https://rollup-v1.optifi-agent.xyz'
    }],
    gasCurrencyCoinGeckoId: "ethereum",
    index: {
      "from": 20
    },
    isTestnet: true,
  }
};
