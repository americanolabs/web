# AmericanoLabs

> [!NOTE]
> This UI is a modified version of the Hyperlane's Warp Route and Open Intents UI

AmericanoLabs is a cross-chain staking platform that optimizes staking strategies based on user risk profiles (Conservative, Balanced, or Aggressive). It evaluates staking opportunities using APY and TVL metrics. The platform also integrates a bridging solution for cross-chain ETH transfers using Open Intents and Hyperlane.

## Architecture

This app is built with Next.js, React, Wagmi, RainbowKit, and the Hyperlane SDK.

- Constants that you may want to change are in `./src/consts/`, see the following Customization section for details.
- The index page is located at `./src/pages/index.tsx`
- The primary features are implemented in `./src/features/`

## Features

- **Home Page**: Overview of AmericanoLabs and its functionalities.
- **Generate**: Suggests the best staking strategies based on user risk profiles.
- **Staking**: Lists available staking protocols, allowing users to stake and unstake assets.
- **Bridge**: Facilitates cross-chain ETH transfers using Open Intents and Hyperlane.

## Customization

See [CUSTOMIZE.md](./CUSTOMIZE.md) for details about adjusting the tokens and branding of this app.

## Development

### Setup

#### Configure

You need a `projectId` from WalletConnect Cloud to run the AmericanoLabs UI. Sign up at [WalletConnect Cloud](https://cloud.walletconnect.com) and create a new project.

#### Build

```sh
# Install dependencies
yarn

# Build the Next.js project
yarn build
```

### Run

You can add a `.env.local` file next to `.env.example` where you set `projectId` copied from WalletConnect Cloud.

```sh
# Start the Next dev server
yarn dev
# Before running, make sure to fill all env variables
EDGE_CONFIG=
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_API_AGENT_URL=
NEXT_PUBLIC_ALCHEMY_API_KEY=
NEXT_PUBLIC_WALLET_CONNECT_ID=
```

### Test

```sh
# Lint check
yarn lint

# Type check
yarn typecheck
```

### Format

```sh
# Format code using Prettier
yarn prettier
```

### Clean / Reset

```sh
# Remove build artifacts
yarn clean
```

## Deployment

[AmericanoLabs](https://americanolabs.vercel.app/).

## Social Media

[AmericanoLabs X](https://x.com/americanolabs)

## Learn More

For additional details, refer to the [AmericanoLabs documentation](https://kbaji.gitbook.io/americano-labs).

