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

    </div>
  </div>
</div>
</template>

<script>
import { switchChain } from '@wagmi/core';
import { useAccount, useConfig, useDisconnect } from '@wagmi/vue';
import ConnectButton from './components/ConnectButton.vue';
import { DatePicker } from 'v-calendar';

export default {
  name: 'LaunchMinter',

  components: {
    ConnectButton,
    DatePicker,
  },

  data() {
    return {
      endDate: null,
      minterAdminAddress: null,
      minterCap: null,
      waitingLaunchMinter: false,
      startDate: null,
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
      console.log("Minter admin:", this.minterAdminAddress);
      console.log("Minter cap:", this.minterCap);
      console.log("Minter start date:", this.startDate);
      console.log("Minter start timestamp:", this.minterStartTime);
      console.log("Minter end date:", this.endDate);
      console.log("Minter end timestamp:", this.minterEndTime);
      
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