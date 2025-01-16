import { http, cookieStorage, createConfig, createStorage } from '@wagmi/vue'
import { mainnet, optimism, sepolia } from '@wagmi/vue/chains'
import { injected, metaMask, walletConnect } from '@wagmi/vue/connectors'

export const config = createConfig({
  chains: [mainnet, sepolia, optimism],
  connectors: [
    injected(),
    walletConnect({
      projectId: "e530de3f33fc0bb0f23250ad87f78a4a",
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
