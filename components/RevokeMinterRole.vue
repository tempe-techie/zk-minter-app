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
       
        <!-- Minter contract address field -->
        <div>
          <label for="minterContractAddressField" class="form-label mt-4">Minter contract address</label>
          <input v-model="minterContractAddress" placeholder="Enter minter contract address" class="form-control" id="minterContractAddressField">
        </div>

        <!-- Minter address field -->
        <div>
          <label for="minterAddressField" class="form-label mt-4">Revoke Minter role of this address</label>
          <input v-model="minterAddress" placeholder="Enter address" class="form-control" id="minterAddressField">
          <small id="minterAddressHelp" class="form-text text-muted">
            Enter the address of a person (or Safe multisig) whose Minter role you want to revoke
          </small>
        </div>

        <!-- Revoke button -->
        <button
          v-if="isActivated && isChainSupported"
          class="btn btn-dark mt-4 mb-2"
          :disabled="waitingRevokeRole"
          @click="revokeRole"
        >
          <span v-if="waitingRevokeRole" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Revoke Minter Role
        </button>
        <!-- END Revoke button -->

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
          The Minter role was successfully revoked! <a :href="getTxUrl" target="_blank">View transaction</a>.
        </div>
        <!-- END Success message -->
        
      </div>
    </div>
  </div>
  <!-- END Revoke minter role -->
</template>

<script>
import { switchChain, waitForTransactionReceipt, writeContract } from '@wagmi/core';
import { useAccount, useConfig } from '@wagmi/vue';
import { isAddress, keccak256, toBytes } from 'viem'
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
      minterAddress: null,
      minterContractAddress: null,
      showSuccessMessage: false,
      txHash: null,
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

    async revokeRole() {
      this.waitingRevokeRole = true;
      
      // check if minter contract address is valid
      if (!isAddress(this.minterContractAddress)) {
        this.errorMessage = "Invalid minter contract address";
        this.waitingRevokeRole = false;
        return;
      }

      // check if minter address is valid
      if (!isAddress(this.minterAddress)) {
        this.errorMessage = "Invalid address to give Minter role to";
        this.waitingRevokeRole = false;
        return;
      }

      // Calculate MINTER_ROLE hash
      const MINTER_ROLE = keccak256(toBytes('MINTER_ROLE'))

      try {
        // revoke minter role
        this.txHash = await writeContract(this.config, {
          address: this.minterContractAddress,
          abi: minterAbi,
          functionName: "revokeRole",
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
        this.errorMessage = "Error revoking Minter role: " + error.message;
      }

      this.waitingRevokeRole = false;
    }
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