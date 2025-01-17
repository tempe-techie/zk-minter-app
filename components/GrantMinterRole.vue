<template>
  <h4 class="mt-4 text-center">Grant Minter Role</h4>

  <!-- Grant minter role -->
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

        <!-- Minter address field -->
        <div>
          <label for="minterAddressField" class="form-label mt-4">Address to give Minter role to</label>
          <input v-model="minterAddress" placeholder="Enter address" class="form-control" id="minterAddressField">
          <small id="minterAddressHelp" class="form-text text-muted">
            Enter the address of a person (or Safe multisig) that you want to grant the minter role to. This address will then be able to mint ZK tokens.
          </small>
        </div>

        <!-- Grant button -->
        <button
          v-if="isActivated && isChainSupported"
          class="btn btn-dark mt-4 mb-2"
          :disabled="waitingGrantRole"
          @click="grantRole"
        >
          <span v-if="waitingGrantRole" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Grant Minter Role
        </button>
        <!-- END Grant button -->

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

        <!-- Success message -->
        <div v-if="showSuccessMessage" class="alert alert-success mt-4">
          The Minter role was successfully granted! <a :href="getTxUrl" target="_blank">View transaction</a>.
        </div>
        <!-- END Success message -->
        
      </div>
    </div>
  </div>
  <!-- END Grant minter role -->
</template>

<script>
import { switchChain, waitForTransactionReceipt, writeContract } from '@wagmi/core';
import { useAccount, useConfig, useDisconnect } from '@wagmi/vue';
import { isAddress, parseEther, keccak256, toBytes } from 'viem'
import ConnectButton from './components/ConnectButton.vue';
import minterAbi from './data/abi/MinterAbi.json';

export default {
  name: 'GrantMinterRole',

  components: {
    ConnectButton,
  },

  data() {
    return {
      errorMessage: null,
      minterAddress: null,
      minterContractAddress: null,
      showSuccessMessage: false,
      txHash: null,
      waitingGrantRole: false,
    }
  },

  computed: {
    getCurrentNetworkName() {
      return this.fetchNetworkName(this.chainId);
    },

    getNetworks() {
      return this.$config.public.supportedChains;
    },

    getTxUrl() {
      if (this.txHash && this.chainId) {
        return this.$config.public.blockExplorerBaseUrl[this.chainId] + "/tx/" + this.txHash;
      }

      return null;
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

    async grantRole() {
      this.waitingGrantRole = true;
      
      // check if minter contract address is valid
      if (!isAddress(this.minterContractAddress)) {
        this.errorMessage = "Invalid minter contract address";
        this.waitingGrantRole = false;
        return;
      }

      // check if minter address is valid
      if (!isAddress(this.minterAddress)) {
        this.errorMessage = "Invalid address to give Minter role to";
        this.waitingGrantRole = false;
        return;
      }

      // Calculate MINTER_ROLE hash
      const MINTER_ROLE = keccak256(toBytes('MINTER_ROLE'))

      try {
        // grant minter role
        this.txHash = await writeContract(this.config, {
          address: this.minterContractAddress,
          abi: minterAbi,
          functionName: "grantRole",
          args: [MINTER_ROLE, this.minterAddress],
        });

        // Wait for transaction to be mined
        const receipt = await waitForTransactionReceipt(this.config, { hash: this.txHash })

        // Check if transaction was successful
        if (!receipt || receipt.status !== "success") {
          throw new Error('Transaction failed');
        }

        console.log("Transaction successful.")
        this.showSuccessMessage = true;
      } catch (error) {
        this.errorMessage = "Error granting Minter role: " + error.message;
      }

      this.waitingGrantRole = false;
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