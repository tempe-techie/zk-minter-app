<template>
<nav class="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
  <div class="container-fluid">
    <NuxtLink to="/" class="navbar-brand">
      ZK Minter Launcher
    </NuxtLink>

    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    
    <div class="collapse navbar-collapse" id="navbarColor01">
      <ul class="navbar-nav ms-auto">
        
        <li class="nav-item">
          <NuxtLink to="/about" class="btn btn-primary">About</NuxtLink>
        </li>

        <li class="nav-item">
          <NuxtLink to="/mint-zk" class="btn btn-primary">Mint ZK</NuxtLink>
        </li>

        <li class="nav-item dropdown">
          <button 
            class="btn btn-primary dropdown-toggle" 
            data-bs-toggle="dropdown" 
            type="button" 
            aria-haspopup="true" 
            aria-expanded="false"
          >
            Minter Roles
          </button>

          <div class="dropdown-menu dropdown-menu-end set-cursor-pointer">
            <NuxtLink to="/grant-minter-role" class="dropdown-item">
              Grant Minter Role
            </NuxtLink>
            <NuxtLink to="/revoke-minter-role" class="dropdown-item">
              Revoke Minter Role
            </NuxtLink>
          </div>
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
            
            <span v-if="getUserBalance" class="dropdown-item">{{ getUserBalance }} {{ $config.public.chainCurrency[chainId] }}</span>

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
</template>

<script>
import { getBalance, switchChain } from '@wagmi/core'
import { useAccount, useConfig, useDisconnect } from '@wagmi/vue';
import { formatEther } from 'viem'
import ConnectButton from './components/ConnectButton.vue';

export default {
  name: "Navbar",

  components: {
    ConnectButton,
  },

  data() {
    return {
      userBalanceWei: null,
    }
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
    },

    getUserBalance() {
      if (this.userBalanceWei) {
        const balance = formatEther(Number(this.userBalanceWei));
        return parseFloat(Number(balance).toFixed(4));
      }

      return null;
    },
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
  },

  watch: {
    async address(newAddress) {
      const userBalanceData = await getBalance(this.config, { address: newAddress })
      this.userBalanceWei = userBalanceData.value
    },

    async chainId() {
      if (this.address) { 
        const userBalanceData = await getBalance(this.config, { address: this.address })
        this.userBalanceWei = userBalanceData.value
      }
    }
  }
}
</script>
