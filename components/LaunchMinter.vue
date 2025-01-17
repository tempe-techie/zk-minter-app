<template>
<!-- Create ZK Minter -->
<div class="d-flex justify-content-center">
  <div class="card text-white bg-primary send-tokens-card">
    <div class="card-body text-center">

      <!-- Connect wallet button -->
      <div class="mt-1" v-if="!isActivated">
        <ConnectButton :color="'btn-dark'" />
      </div>
      <!-- END Connect wallet button -->

      <!-- Select network -->
      <button 
        v-if="isActivated" 
        class="btn btn-primary dropdown-toggle" 
        type="button" 
        data-bs-toggle="dropdown" 
        aria-expanded="false"
      >
        CHAIN: {{ getCurrentNetworkName }}
      </button>
      
      <div class="dropdown-menu p-2 dropdown-menu-end">
        <div>
          <li>
            <button 
              class="dropdown-item" 
              type="button"
              v-for="networkData in getNetworks"
              :key="networkData.chainId"
              @click="changeNetwork(networkData.chainId)"
            >Switch to {{ networkData.networkName }}</button>
          </li>
        </div>
      </div>
      <!-- END Select network -->

      <!-- Create ZK Minter Form -->
      <div>
        <label for="adminAddressField" class="form-label mt-4">Admin address</label>
        <input v-model="minterAdminAddress" placeholder="Enter admin address" class="form-control" id="adminAddressField">
        <small id="adminAddressHelp" class="form-text text-muted">
          Admin is not a minter, but can pick one. Admin address cannot be changed.
        </small>
      </div>

      <div>
        <label for="adminAddressField" class="form-label mt-4">ZK token cap</label>
        <div class="input-group">
          <input type="text" class="form-control" v-model="minterCap" placeholder="Max amount of ZK that can be minted">
          <span class="input-group-text">ZK</span>
        </div>
        <small id="adminAddressHelp" class="form-text text-muted">
          The maximum number of ZK tokens that this contract can mint.
        </small>
      </div>
      <!-- END Create ZK Minter Form -->

      <!-- Load button -->
      <button
        v-if="isActivated && isChainSupported"
        class="btn btn-dark mt-4 mb-2"
        :disabled="waitingLaunchMinter"
        @click="launchMinter"
      >
        <span v-if="waitingLaunchMinter" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Create ZK Minter Contract
      </button>
      <!-- END Load button -->

      <!-- Switch to supported network alert -->
      <button
        v-if="isActivated && !isChainSupported"
        class="btn btn-dark mt-4 mb-2"
        :disabled="true"
      >
        Switch to supported network
      </button>
      <!-- END Switch to supported network alert -->

      <!-- Connect wallet button -->
      <div class="mt-4" v-if="!isActivated">
        <ConnectButton />
      </div>
      <!-- END Connect wallet button -->

    </div>
  </div>
</div>
</template>

<script>
import { switchChain } from '@wagmi/core';
import { useAccount, useConfig, useDisconnect } from '@wagmi/vue';
import ConnectButton from './components/ConnectButton.vue';

export default {
  name: 'LaunchMinter',

  components: {
    ConnectButton,
  },

  data() {
    return {
      minterAdminAddress: null,
      minterCap: null,
      waitingLaunchMinter: false,
    }
  },

  computed: {
    getCurrentNetworkName() {
      return this.fetchNetworkName(this.chainId);
    },

    getNetworks() {
      return this.$config.public.supportedChains;
    },

    isActivated() {
      return this.status === 'connected'
    },

    isChainSupported() {
      if (this.$config.public.supportedChains.find(chain => Number(chain.chainId) === Number(this.chainId))) {
        return true;
      }

      return false;
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

    async launchMinter() {
      this.waitingLaunchMinter = true;

      // TODO: Launch minter code
      
      this.waitingLaunchMinter = false;
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