<template>
  <h4 class="mt-4 text-center">Mint ZK Tokens</h4>

  <!-- Mint ZK tokens -->
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
       
        <!-- Recipient address field -->
        <div>
          <label for="recipientAddressField" class="form-label mt-4">ZK Tokens Recipient address</label>
          <input v-model="recipientAddress" placeholder="Enter recipient address" class="form-control" id="recipientAddressField">
          <small id="minterAddressHelp" class="form-text text-muted">
            Enter the address which will receive the newly minted ZK tokens.
          </small>
        </div>

        <!-- Amount of ZK tokens to mint -->
        <div>
          <label for="minterCapField" class="form-label mt-4">Amount of ZK tokens to mint</label>
          <div class="input-group">
            <span class="input-group-text">ZK</span>
            <input type="text" class="form-control" v-model="zkAmount" placeholder="Enter amount of ZK tokens to mint">
          </div>
          <small id="minterCapHelp" class="form-text text-muted">
            The amount of ZK tokens that will be minted to the recipient address.
          </small>
        </div>

        <!-- Mint button -->
        <button
          v-if="isActivated && isChainSupported"
          class="btn btn-dark mt-4 mb-2"
          :disabled="waitingMint"
          @click="mintTokens"
        >
          <span v-if="waitingMint" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Mint ZK Tokens
        </button>
        <!-- END Mint button -->

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
          ZK tokens were successfully minted! <a :href="getTxUrl" target="_blank">View transaction</a>.
        </div>
        <!-- END Success message -->
        
      </div>
    </div>
  </div>
  <!-- END Mint ZK tokens -->
</template>

<script>
import { switchChain, waitForTransactionReceipt, writeContract } from '@wagmi/core';
import { useAccount, useConfig } from '@wagmi/vue';
import { isAddress, parseEther } from 'viem'
import ConnectButton from './components/ConnectButton.vue';
import minterAbi from './data/abi/MinterAbi.json';

export default {
  name: 'MintZkTokens',

  components: {
    ConnectButton,
  },

  data() {
    return {
      errorMessage: null,
      minterContractAddress: null,
      recipientAddress: null,
      showSuccessMessage: false,
      txHash: null,
      waitingMint: false,
      zkAmount: null,
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

    zkAmountToWei() {
      // if not a number, return null
      if (isNaN(this.zkAmount)) {
        return null;
      }

      return parseEther(String(this.zkAmount));
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

    async mintTokens() {
      this.waitingMint = true;
      
      // check if minter contract address is valid
      if (!isAddress(this.minterContractAddress)) {
        this.errorMessage = "Invalid minter contract address";
        this.waitingMint = false;
        return;
      }

      // check if recipient address is valid
      if (!isAddress(this.recipientAddress)) {
        this.errorMessage = "Invalid recipient address";
        this.waitingMint = false;
        return;
      }

      // check if amount of ZK tokens to mint is valid
      if (!this.zkAmountToWei) {
        this.errorMessage = "Invalid amount of ZK tokens to mint";
        this.waitingMint = false;
        return;
      }

      console.log("zkAmountInWei:", this.zkAmountToWei);

      try {
        // mint ZK tokens
        this.txHash = await writeContract(this.config, {
          address: this.minterContractAddress,
          abi: minterAbi,
          functionName: "mint",
          args: [this.recipientAddress, this.zkAmountToWei],
        });

        console.log("txHash", this.txHash);

        // Wait for transaction to be mined
        const receipt = await waitForTransactionReceipt(this.config, { hash: this.txHash })
        console.log("receipt", receipt);
        
        // Check if transaction was successful
        if (!receipt || receipt.status !== "success") {
          throw new Error('Transaction failed');
        }

        console.log("Transaction successful.")
        this.showSuccessMessage = true;
      } catch (error) {
        this.errorMessage = "Error minting ZK tokens: " + error.message;
      }

      this.waitingMint = false;
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