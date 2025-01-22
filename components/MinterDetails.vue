<template>
  <h4 class="mt-4 text-center">ZK Minter Details</h4>

  <!-- ZK Minter details form -->
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
       
        <!-- Minter contract address field -->
        <div>
          <label for="minterContractAddressField" class="form-label mt-4">Minter contract address</label>
          <input v-model="minterContractAddress" placeholder="Enter minter contract address" class="form-control" id="minterContractAddressField">
        </div>

        <!-- Check details button -->
        <button
          v-if="isActivated && isChainSupported"
          class="btn btn-dark mt-4 mb-2"
          :disabled="waitingDetails"
          @click="fetchDetails"
        >
          <span v-if="waitingDetails" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Check details
        </button>
        <!-- END Check details button -->

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

        <!-- Error message -->
        <div v-if="errorMessage" class="alert alert-danger mt-4">
          {{ errorMessage }}
        </div>
        <!-- END Error message -->
        
      </div>
    </div>
  </div>
  <!-- END ZK Minter details form -->

   <!-- ZK Minter details result -->
  <div class="d-flex justify-content-center" v-if="capWei && startDate && endDate">
    <div class="card text-white bg-primary send-tokens-card">
      <div class="card-body text-center">
        <p>Status: {{ getStatus }}</p>
        <p>Cap: {{ cap }} ZK</p>
        <p>Minted so far: {{ mintedSoFar }} ZK</p>
        <p>Start date: {{ getStartDate }}</p>
        <p>End date: {{ getEndDate }}</p>
      </div>
    </div>
  </div>
  <!-- END ZK Minter details result -->
</template>

<script>
import { readContract, switchChain } from '@wagmi/core';
import { useAccount, useConfig } from '@wagmi/vue';
import { formatEther, isAddress } from 'viem'
import ConnectButton from './components/ConnectButton.vue';
import minterAbi from './data/abi/MinterAbi.json';

export default {
  name: 'MinterDetails',

  components: {
    ConnectButton,
  },

  data() {
    return {
      capWei: null,
      closed: false,
      endDate: null,
      errorMessage: null,
      mintedSoFarWei: null,
      minterContractAddress: null,
      paused: false,
      startDate: null,
      waitingDetails: false,
    }
  },

  computed: {
    cap() {
      return this.capWei ? formatEther(this.capWei) : 'N/A';
    },

    getCurrentNetworkName() {
      return this.fetchNetworkName(this.chainId);
    },

    getStartDate() {
      // start date is in seconds (timestamp)
      return this.startDate ? new Date(this.startDate * 1000).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC'
      }) + ' UTC' : 'N/A';
    },

    getStatus() {
      if (this.closed) {
        if (this.endDate && new Date().getTime() < this.endDate * 1000) {
          return 'Closed before the end date';
        }

        return 'Permanently Closed';
      } else {
        // if start date is in the future, the contract is not active
        if (this.startDate && new Date().getTime() < this.startDate * 1000) {
          return 'Not open for minting yet.';
        }

        // if end date is in the past, the contract minting has ended
        if (this.endDate && new Date().getTime() > this.endDate * 1000) {
          return 'Minting Period Ended';
        }

        // if paused, the contract is not active
        if (this.paused) {
          return 'Minting Paused';
        }

        return 'Active';
      }
    },

    getEndDate() {
      // end date is in seconds (timestamp)
      let endDateInfo = this.endDate ? new Date(this.endDate * 1000).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC'
      }) + ' UTC' : 'N/A';
      
      if (this.closed && this.endDate && new Date().getTime() < this.endDate * 1000) {
        endDateInfo += ' (Note: the contract has been closed before the end date)';
      }
      return endDateInfo;
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

    mintedSoFar() {
      try {
        return formatEther(this.mintedSoFarWei);
      } catch (error) {
        return 'N/A';
      }
    },
  },

  methods: {
    async changeNetwork(chainId) {
      await switchChain(this.config, { chainId })
    },

    async fetchDetails() {
      this.waitingDetails = true;
      
      // clear the error message
      this.errorMessage = null;

      // clear the details
      this.capWei = null;
      this.closed = false;
      this.paused = false;
      this.endDate = null;
      this.mintedSoFarWei = null;
      this.startDate = null;

      // check if the address is a valid address
      if (!isAddress(this.minterContractAddress)) {
        this.errorMessage = 'Invalid address';
        this.waitingDetails = false;
        return;
      }

      try {
        this.startDate = await readContract(this.config, {
          address: this.minterContractAddress,
          abi: minterAbi,
          functionName: 'START_TIME',
        });

        this.endDate = await readContract(this.config, {
          address: this.minterContractAddress,
          abi: minterAbi,
          functionName: 'EXPIRATION_TIME',
        });

        this.closed = await readContract(this.config, {
          address: this.minterContractAddress,
          abi: minterAbi,
          functionName: 'closed',
        });

        this.paused = await readContract(this.config, {
          address: this.minterContractAddress,
          abi: minterAbi,
          functionName: 'paused',
        });

        this.capWei = await readContract(this.config, {
          address: this.minterContractAddress,
          abi: minterAbi,
          functionName: 'CAP',
        });

        this.mintedSoFarWei = await readContract(this.config, {
          address: this.minterContractAddress,
          abi: minterAbi,
          functionName: 'minted',
        });
      } catch (error) {
        this.errorMessage = 'Error fetching details. Check if correct chain.';
      }

      this.waitingDetails = false;
    },

    fetchNetworkName(networkId) {
      const network = this.$config.public.supportedChains.find(
        chain => chain.chainId === Number(networkId)
      );
      
      return network ? network.networkName : "Unsupported network";
    },

    getAddressUrl(addr) {
      return `${this.$config.public.blockExplorerBaseUrl[this.chainId]}/address/${addr}`;
    },
  },

  setup() {
    const { address, chainId, status } = useAccount()
    const config = useConfig()

    return {
      address,
      chainId,
      config,
      status,
    }
  }
}
</script>