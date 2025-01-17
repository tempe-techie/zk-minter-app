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

      <h4 class="mt-4">Launch Minter contract</h4>

      <!-- Admin address field -->
      <div>
        <label for="adminAddressField" class="form-label mt-4">Admin address</label>
        <input v-model="minterAdminAddress" placeholder="Enter admin address" class="form-control" id="adminAddressField">
        <small id="adminAddressHelp" class="form-text text-muted">
          Admin is not a minter, but can pick one. Admin address cannot be changed.
        </small>
      </div>

      <!-- Minter cap field -->
      <div>
        <label for="minterCapField" class="form-label mt-4">ZK token cap</label>
        <div class="input-group">
          <span class="input-group-text">ZK</span>
          <input type="text" class="form-control" v-model="minterCap" placeholder="Max amount of ZK that can be minted">
        </div>
        <small id="minterCapHelp" class="form-text text-muted">
          The maximum number of ZK tokens that this contract can mint.
        </small>
      </div>

      <!-- Start time field -->
      <div>
        <label for="startTimeField" class="form-label mt-4">Start date (UTC)</label>
        <div class="input-group">
          <DatePicker 
            v-model="startDate" 
            mode="dateTime" 
            is24hr 
            timezone="UTC"
            @dayclick="(_, event) => {event.target.blur();}"
          >
            <template v-slot="{ inputValue, inputEvents }">
              <div class="input-group">
                <button class="btn btn-dark" type="button" v-on="inputEvents">
                  <i class="bi bi-calendar-event"></i>
                </button>
                <input 
                  class="form-control"
                  :value="inputValue"
                  placeholder="Select start date and time"
                  readonly
                >
              </div>
            </template>
          </DatePicker>
        </div>
        <small id="startTimeHelp" class="form-text text-muted">
          The date and time in UTC when the minter contract can start minting.
        </small>
      </div>
      
      <!-- End time field -->
      <div>
        <label for="endTimeField" class="form-label mt-4">End date (UTC)</label>
        <div class="input-group">
          <DatePicker 
            v-model="endDate" 
            mode="dateTime" 
            is24hr 
            timezone="UTC"
            @dayclick="(_, event) => {event.target.blur();}"
          >
            <template v-slot="{ inputValue, inputEvents }">
              <div class="input-group">
                <button class="btn btn-dark" type="button" v-on="inputEvents">
                  <i class="bi bi-calendar-event"></i>
                </button>
                <input 
                  class="form-control"
                  :value="inputValue"
                  placeholder="Select end date and time"
                  readonly
                >
              </div>
            </template>
          </DatePicker>
        </div>
        <small id="endTimeHelp" class="form-text text-muted">
          The date and time in UTC when the minter contract can stop minting.
        </small>
      </div>

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

      <!-- Error message -->
      <div v-if="errorMessage" class="alert alert-danger mt-4">
        {{ errorMessage }}
      </div>
      <!-- END Error message -->

      <!-- Success message -->
      <div v-if="showSuccessMessage" class="alert alert-success mt-4">
        Success! Minter contract address: <a :href="getBlockExplorerUrl(minterContractAddress)" target="_blank">{{ minterContractAddress }}</a>
      </div>
      <!-- END Success message -->

    </div>
  </div>
</div>
</template>

<script>
import { switchChain, writeContract } from '@wagmi/core';
import { useAccount, useConfig, useDisconnect } from '@wagmi/vue';
import { DatePicker } from 'v-calendar';
import { isAddress, parseEther } from 'viem'
import ConnectButton from './components/ConnectButton.vue';
import factoryAbi from './data/abi/FactoryAbi.json';

export default {
  name: 'LaunchMinter',

  components: {
    ConnectButton,
    DatePicker,
  },

  data() {
    return {
      endDate: null,
      errorMessage: null,
      minterAdminAddress: null,
      minterCap: null,
      minterContractAddress: null,
      startDate: null,
      showSuccessMessage: false,
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

    minterEndTime() {
      return this.endDate ? Math.floor(this.endDate.getTime() / 1000) : null;
    },

    minterStartTime() {
      return this.startDate ? Math.floor(this.startDate.getTime() / 1000) : null;
    },

    zkCapToWei() {
      // if not a number, return null
      if (isNaN(this.minterCap)) {
        return null;
      }

      return parseEther(String(this.minterCap));
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

    async launchMinter() {
      this.waitingLaunchMinter = true;

      // check if admin address is a valid address
      if (!isAddress(this.minterAdminAddress)) {
        let msg = "Invalid admin address";
        console.error(msg);
        this.waitingLaunchMinter = false;
        this.errorMessage = msg;
        return;
      }

      // check if zk cap is a number
      if (!this.zkCapToWei) {
        let msg = "Invalid ZK cap number";
        console.error(msg);
        this.waitingLaunchMinter = false;
        this.errorMessage = msg;
        return;
      }

      if (!this.startDate || !this.endDate || !this.minterStartTime || !this.minterEndTime) {
        let msg = "Invalid start or end date";
        console.error(msg);
        this.waitingLaunchMinter = false;
        this.errorMessage = msg;
        return;
      }

      const factoryAddress = this.$config.public.factoryAddress[this.chainId];

      const zkTokenAddress = this.$config.public.zkTokenAddress[this.chainId];
      const adminAddress = this.minterAdminAddress;
      const zkCapWei = this.zkCapToWei;
      const startTimestamp = this.minterStartTime;
      const endTimestamp = this.minterEndTime;
      const salt = Math.floor(Date.now() / 1000);

      try {
        // Send the transaction
        const tx = await writeContract({
          address: factoryAddress,
          abi: factoryAbi,
          functionName: 'createCappedMinter',
          args: [zkTokenAddress, adminAddress, zkCapWei, startTimestamp, endTimestamp, salt],
        });

        // Wait for transaction to be mined and get receipt
        const receipt = await tx.wait();
        console.log("Receipt:", receipt);

        // Check if transaction was successful
        if (!receipt || receipt.status === 0) {
          throw new Error('Transaction failed');
        }

        // Find the CappedMinterV2Created event
        const event = receipt.logs.find(log => {
          try {
            const parsed = decodeEventLog({
              abi: factoryAbi,
              data: log.data,
              topics: log.topics,
            });
            return parsed.eventName === 'CappedMinterV2Created';
          } catch {
            return false;
          }
        });

        if (event) {
          const { args } = decodeEventLog({
            abi: factoryAbi,
            data: event.data,
            topics: event.topics,
          });

          // Now you have access to all event parameters
          const minterAddress = args.minter;
          const mintableToken = args.mintable;
          const admin = args.admin;
          const cap = args.cap;
          const startTime = args.startTime;
          const expirationTime = args.expirationTime;

          console.log('Minter created at:', minterAddress);
          console.log('Event data:', {
            mintableToken,
            admin,
            cap,
            startTime,
            expirationTime
          });

          this.minterContractAddress = minterAddress;
          this.showSuccessMessage = true;
        }

      } catch (error) {
        console.error('Error creating minter:', error);
        this.errorMessage = error.message || 'Error creating minter';
      } finally {
        this.waitingLaunchMinter = false;
      }
      
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