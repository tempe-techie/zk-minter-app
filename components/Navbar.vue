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

        <li v-if="isActivated" class="nav-item dropdown">
          <button 
            class="btn btn-primary dropdown-toggle" 
            data-bs-toggle="dropdown" type="button" 
            aria-haspopup="true" aria-expanded="false"
          >
            {{ getShortAddress }}
          </button>

          <div class="dropdown-menu dropdown-menu-end set-cursor-pointer">
            
            <a :href="getBlockExplorerBaseUrl+'/address/'+address" class="short-address" target="_blank">
              <span class="dropdown-item">
                {{ getShortAddress }}
              </span>
            </a>
            
            <span class="dropdown-item" @click="disconnect">Disconnect</span>
          </div>
        </li>

        <li class="nav-item" v-if="!isActivated">
          <ConnectButton />
        </li>

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
      </div>
    </div>
  </div>
</div>
<!-- END About modal -->
</template>

<script>
import { useAccount, useDisconnect } from '@wagmi/vue';
import ConnectButton from './components/ConnectButton.vue';

export default {
  name: "Navbar",

  components: {
    ConnectButton,
  },

  mounted() {
    console.log("Navbar mounted");
    // print test env var
    console.log(this.$config.public.testVar);
  },

  computed: {
    isActivated() {
      return this.status === 'connected'
    },

    getBlockExplorerBaseUrl() {
      return this.$config.public.blockExplorerBaseUrl[this.chainId]
    },

    getShortAddress() {
      if (this.address) {
        return this.address.slice(0, 6) + '...' + this.address.slice(-4);
      }

      return null
    }
  },

  setup() {
    const { address, chainId, status } = useAccount()
    const { disconnect } = useDisconnect()

    return {
      address,
      chainId,
      disconnect,
      status,
    }
  }
}
</script>
