<template>
<nav class="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">ZK Minter Launcher</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarColor01">
      <ul class="navbar-nav ms-auto">
        
        <li class="nav-item">
          <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#aboutModal">About</button>
        </li>

        <!-- Network dropdown -->
        <li v-if="isActivated" class="nav-item dropdown">
          <button 
            class="btn btn-primary dropdown-toggle network-dropdown" 
            data-bs-toggle="dropdown" type="button" 
            aria-haspopup="true" aria-expanded="false"
          >{{ getCurrentNetworkName }}</button>

          <div class="dropdown-menu p-2 dropdown-menu-end set-cursor-pointer">
            <span 
              class="dropdown-item"
              v-for="networkData in getNetworks"
              :key="networkData.chainId"
              @click="changeNetwork(networkData.chainId)"
            >{{networkData.networkName}}</span>
          </div>
        </li>
        <!-- END Network dropdown -->

        <!-- Account dropdown -->
        <li v-if="isActivated" class="nav-item dropdown">
          <button 
            class="btn btn-primary dropdown-toggle" 
            data-bs-toggle="dropdown" type="button" 
            aria-haspopup="true" aria-expanded="false"
          >
            {{ getShortAddress }}
          </button>

          <div class="dropdown-menu dropdown-menu-end set-cursor-pointer">
            
            <a :href="getBlockExplorerBaseUrl+'/address/'+address" class="short-address text-decoration-none" target="_blank">
              <span class="dropdown-item">
                {{ getShortAddress }}
              </span>
            </a>
            
            <span class="dropdown-item" @click="disconnect">Disconnect</span>
          </div>
        </li>
        <!-- END Account dropdown -->

        <!-- Connect button -->
        <li class="nav-item" v-if="!isActivated">
          <ConnectButton />
        </li>
        <!-- END Connect button -->
      </ul>
    </div>
  </div>
</nav>

<!-- About modal -->
<div class="modal fade" id="aboutModal" tabindex="-1" aria-labelledby="aboutModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">About ZK Minter Launcher</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
          <span aria-hidden="true"></span>
        </button>
      </div>
      <div class="modal-body">
        <p>ZK Minter Launcher is a web3 app that allows you to launch a ZK Capped Minter contract (V2) via the official ZK Capped Minter Factory contract.</p>

        <p>All the code is open source and you can find it on GitHub:</p>

        <ul>
          <li>
            <a href="https://github.com/tempe-techie/zk-minter-frontend" target="_blank">https://github.com/tempe-techie/zk-minter-frontend</a>
          </li>
        </ul>

        <hr />

        <h4>How to connect your Safe to the app:</h4>
        <p>1. In the ZK Minter app, click on the "Connect Wallet" button and select "WalletConnect"</p>
        <p>2. A small modal will appear. Click on the copy icon (two overlapping squares) to copy the WalletConnect URI</p>
        <p>3. Go to <a href="https://app.safe.global/" target="_blank">https://app.safe.global/</a> and open your Safe</p>
        <p>4. In the navigation bar, click on the "WalletConnect" icon</p>
        <p>5. In the modal that appears, enter the WalletConnect URI that you copied in the previous step</p>
        <p>6. Wait for the Safe to connect</p>
        <p>7. You should now see your Safe address in the ZK Minter app</p>
      </div>
    </div>
  </div>
</div>
<!-- END About modal -->
</template>

<script>
import { switchChain } from '@wagmi/core'
import { useAccount, useConfig, useDisconnect } from '@wagmi/vue';
import ConnectButton from './components/ConnectButton.vue';

export default {
  name: "Navbar",

  components: {
    ConnectButton,
  },

  computed: {
    isActivated() {
      return this.status === 'connected'
    },

    getBlockExplorerBaseUrl() {
      return this.$config.public.blockExplorerBaseUrl[this.chainId]
    },

    getCurrentNetworkName() {
      return this.fetchNetworkName(this.chainId);
    },

    getNetworks() {
      return this.$config.public.supportedChains;
    },

    getShortAddress() {
      if (this.address) {
        return this.address.slice(0, 6) + '...' + this.address.slice(-4);
      }

      return null
    }
  },

  methods: {
    async changeNetwork(chainId) {
      await switchChain(this.config, { chainId })
    },

    fetchNetworkName(networkId) {
      const network = this.$config.public.supportedChains.find(
        chain => chain.chainId === Number(networkId)
      );
      
      return network ? network.networkName : "Unsupported network";
    },
  },

  setup() {
    const { address, chainId, status } = useAccount()
    const config = useConfig()
    const { disconnect } = useDisconnect()

    return {
      address,
      chainId,
      config,
      disconnect,
      status,
    }
  }
}
</script>
