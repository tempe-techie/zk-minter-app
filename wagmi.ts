import { http, cookieStorage, createConfig, createStorage } from '@wagmi/vue'
import { mainnet, optimism, sepolia } from '@wagmi/vue/chains'
import { injected, metaMask, walletConnect } from '@wagmi/vue/connectors'

export const config = createConfig({
  chains: [mainnet, sepolia, optimism],
  connectors: [
    injected(),
    walletConnect({
      projectId: "52c7d5d213747b65f5f3c4aa92df1682",
    }),
    metaMask(),
  ],
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [optimism.id]: http(),
  },
})

declare module '@wagmi/vue' {
  interface Register {
    config: typeof config
  }
}
