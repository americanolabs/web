import { type WarpCoreConfig } from '@hyperlane-xyz/sdk';
import { zeroAddress } from 'viem';

const ROUTER = '0xC1d0d7C961daF74BECa71416359a92c59c8A8012';

const NETWORK_SEPARATOR = '101010';

export const TOP_MAX = {
  'arbitrumsepolia': {
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
      chainName: 'arbitrumsepolia',
      collateralAddressOrDenom: ROUTER,
      connections: [
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
      chainName: 'decaftestnet',
      collateralAddressOrDenom: ROUTER,
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
        amount: 1e10,
        origin: ['arbitrumsepolia', 'decaftestnet'].join(
          NETWORK_SEPARATOR,
        ),
        destination: ['arbitrumsepolia', 'decaftestnet'].join(NETWORK_SEPARATOR),
        addressOrDenom: zeroAddress,
      }
    ],
  },
};
