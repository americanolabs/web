import { type WarpCoreConfig } from '@hyperlane-xyz/sdk';
import { zeroAddress } from 'viem';

const ROUTER = '0xf614c6bF94b022E16BEF7dBecF7614FFD2b201d3';
const ROUTER_DECAF = '0xd07A45dD047c67662F9877acd60902A4EE0aB847';

const NETWORK_SEPARATOR = '101010';

export const TOP_MAX = {
  'bsesepolia': {
    [zeroAddress]: 1e16,
  },
  'optimismsepolia': {
    [zeroAddress]: 1e16,
  },
  'arbitrumsepolia': {
    [zeroAddress]: 1e16,
  },
  'sepolia': {
    [zeroAddress]: 1e16,
  },
  'decaftestnet': {
    [zeroAddress]: 1e16,
  }
}

// A list of Warp Route token configs
// These configs will be merged with the warp routes in the configured registry
// The input here is typically the output of the Hyperlane CLI warp deploy command
export const warpRouteConfigs: WarpCoreConfig = {
  tokens: [
    {
      addressOrDenom: zeroAddress,
      chainName: 'optimismsepolia',
      collateralAddressOrDenom: ROUTER,
      connections: [
        {
          token: 'ethereum|basesepolia|' + zeroAddress,
        },
        {
          token: 'ethereum|arbitrumsepolia|' + zeroAddress,
        },
        {
          token: 'ethereum|sepolia|' + zeroAddress,
        },
      ],
      decimals: 18,
      logoURI: '/deployments/warp_routes/ETH/logo.svg',
      name: 'ETH',
      standard: 'IntentNative',
      symbol: 'ETH',
      protocol: 'ethereum',
    },
    {
      addressOrDenom: zeroAddress,
      chainName: 'basesepolia',
      collateralAddressOrDenom: "0xf614c6bF94b022E16BEF7dBecF7614FFD2b201d3",
      connections: [
        {
          token: 'ethereum|optimismsepolia|' + zeroAddress,
        },
        {
          token: 'ethereum|arbitrumsepolia|' + zeroAddress,
        },
        {
          token: 'ethereum|sepolia|' + zeroAddress,
        },
      ],
      decimals: 18,
      logoURI: '/deployments/warp_routes/ETH/logo.svg',
      name: 'ETH',
      standard: 'IntentNative',
      symbol: 'ETH',
      protocol: 'ethereum',
    },
    {
      addressOrDenom: zeroAddress,
      chainName: 'arbitrumsepolia',
      collateralAddressOrDenom: ROUTER,
      connections: [
        {
          token: 'ethereum|optimismsepolia|' + zeroAddress,
        },
        {
          token: 'ethereum|basesepolia|' + zeroAddress,
        },
        {
          token: 'ethereum|sepolia|' + zeroAddress,
        },
        {
          token: 'ethereum|decaftestnet|' + zeroAddress,
        }
      ],
      decimals: 18,
      logoURI: '/deployments/warp_routes/ETH/logo.svg',
      name: 'ETH',
      standard: 'IntentNative',
      symbol: 'ETH',
      protocol: 'ethereum',
    },
    {
      addressOrDenom: zeroAddress,
      chainName: 'sepolia',
      collateralAddressOrDenom: ROUTER,
      connections: [
        {
          token: 'ethereum|optimismsepolia|' + zeroAddress,
        },
        {
          token: 'ethereum|arbitrumsepolia|' + zeroAddress,
        },
        {
          token: 'ethereum|basesepolia|' + zeroAddress,
        },
      ],
      decimals: 18,
      logoURI: '/deployments/warp_routes/ETH/logo.svg',
      name: 'ETH',
      standard: 'IntentNative',
      symbol: 'ETH',
      protocol: 'ethereum',
    },
    {
      addressOrDenom: zeroAddress,
      chainName: 'decaftestnet',
      collateralAddressOrDenom: ROUTER_DECAF,
      connections: [
        {
          token: 'ethereum|arbitrumsepolia|' + zeroAddress,
        },
      ],
      decimals: 18,
      logoURI: '/deployments/warp_routes/ETH/logo.svg',
      name: 'ETH',
      standard: 'IntentNative',
      symbol: 'ETH',
      protocol: 'ethereum',
    },
  ],
  options: {
    interchainFeeConstants: [
      {
        amount: 3e14,
        origin: ['optimismsepolia', 'basesepolia', 'arbitrumsepolia', 'decaftestnet'].join(NETWORK_SEPARATOR),
        destination: 'sepolia',
        addressOrDenom: zeroAddress,
      },
      {
        amount: 1e10,
        origin: ['optimismsepolia', 'basesepolia', 'arbitrumsepolia', 'sepolia', 'decaftestnet'].join(
          NETWORK_SEPARATOR,
        ),
        destination: ['optimismsepolia', 'basesepolia', 'arbitrumsepolia', 'decaftestnet'].join(NETWORK_SEPARATOR),
        addressOrDenom: zeroAddress,
      },
    ],
  },
};
