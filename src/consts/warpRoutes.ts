import { TokenStandard, type WarpCoreConfig } from '@hyperlane-xyz/sdk';
import { zeroAddress } from 'viem';

const ROUTER = '0x121A10dD349be086Db0953f7Fb1b2A808797d60C';

const NETWORK_SEPARATOR = '101010';

export const TOP_MAX = {
  'arbitrumsepolia': {
    [zeroAddress]: 1e16,
  },
  'basesepolia': {
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
        },
        {
          token: 'ethereum|basesepolia|' + zeroAddress,
        }
      ],
      decimals: 18,
      logoURI: '/deployments/warp_routes/ETH/logo.svg',
      name: 'ETH',
      standard: TokenStandard.IntentNative,
      symbol: 'ETH',
    },
    {
      addressOrDenom: zeroAddress,
      chainName: 'basesepolia',
      collateralAddressOrDenom: ROUTER,
      connections: [
        {
          token: 'ethereum|arbitrumsepolia|' + zeroAddress,
        },
        {
          token: 'ethereum|decaftestnet|' + zeroAddress,
        }
      ],
      decimals: 18,
      logoURI: '/deployments/warp_routes/ETH/logo.svg',
      name: 'ETH',
      standard: TokenStandard.IntentNative,
      symbol: 'ETH',
    },
    {
      addressOrDenom: zeroAddress,
      chainName: 'decaftestnet',
      collateralAddressOrDenom: ROUTER,
      connections: [
        {
          token: 'ethereum|arbitrumsepolia|' + zeroAddress,
        },
        {
          token: 'ethereum|basesepolia|' + zeroAddress,
        }
      ],
      decimals: 18,
      logoURI: '/deployments/warp_routes/ETH/logo.svg',
      name: 'ETH',
      standard: TokenStandard.IntentNative,
      symbol: 'ETH',
    },
  ],
  options: {
    interchainFeeConstants: [
      {
        amount: 1e10,
        origin: ['arbitrumsepolia'].join(
          NETWORK_SEPARATOR,
        ),
        destination: ['basesepolia'].join(NETWORK_SEPARATOR),
        addressOrDenom: zeroAddress,
      },
      {
        amount: 1e10,
        origin: ['arbitrumsepolia'].join(
          NETWORK_SEPARATOR,
        ),
        destination: ['decaftestnet'].join(NETWORK_SEPARATOR),
        addressOrDenom: zeroAddress,
      },
      {
        amount: 1e10,
        origin: ['basesepolia'].join(
          NETWORK_SEPARATOR,
        ),
        destination: ['arbitrumsepolia'].join(NETWORK_SEPARATOR),
        addressOrDenom: zeroAddress,
      },
      {
        amount: 1e10,
        origin: ['basesepolia'].join(
          NETWORK_SEPARATOR,
        ),
        destination: ['decaftestnet'].join(NETWORK_SEPARATOR),
        addressOrDenom: zeroAddress,
      },
      {
        amount: 1e10,
        origin: ['decaftestnet'].join(
          NETWORK_SEPARATOR,
        ),
        destination: ['arbitrumsepolia'].join(NETWORK_SEPARATOR),
        addressOrDenom: zeroAddress,
      },
      {
        amount: 1e10,
        origin: ['decaftestnet'].join(
          NETWORK_SEPARATOR,
        ),
        destination: ['basesepolia'].join(NETWORK_SEPARATOR),
        addressOrDenom: zeroAddress,
      }
    ],
  },
};
