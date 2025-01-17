<template>
  <h4 class="mt-4 text-center">Revoke Minter Role</h4>

  <!-- Revoke minter role -->
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
       
        
      </div>
    </div>
  </div>
  <!-- END Revoke minter role -->
</template>

<script>
import { switchChain, waitForTransactionReceipt, writeContract } from '@wagmi/core';
import { useAccount, useConfig, useDisconnect } from '@wagmi/vue';
import { isAddress, parseEther } from 'viem'
import ConnectButton from './components/ConnectButton.vue';
import minterAbi from './data/abi/MinterAbi.json';

export default {
  name: 'RevokeMinterRole',

  components: {
    ConnectButton,
  },

  data() {
    return {
      errorMessage: null,
      minterContractAddress: null,
      showSuccessMessage: false,
      waitingRevokeRole: false,
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

    getBlockExplorerUrl(address) {
      return this.$config.public.blockExplorerBaseUrl[this.chainId] + "/address/" + address;
    },

    async revokeRole() {
      this.waitingRevokeRole = true;
      // TODO
      this.waitingRevokeRole = false;
    }
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