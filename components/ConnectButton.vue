<template>
  <button class="btn" :class="getColor" @click="openModal">Connect wallet</button>

  <!-- Connect Wallet modal -->
  <div class="modal modal-sm fade" id="connectModal" tabindex="-1" aria-labelledby="connectModalLabel" aria-hidden="true" :class="{'show': isModalOpen}" v-show="isModalOpen">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Connect your wallet</h5>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close" id="closeConnectModal">
            <span aria-hidden="true"></span>
          </button>
        </div>
        <div class="modal-body row">

          <div class="card col-6 card-wallet" role="button" @click.stop="connectRabby">
            <img src="/img/wallets/rabby.png" class="card-img-top card-img-wallet" alt="Rabby">
            <small class="text-center mb-3 text-muted">Rabby</small>
          </div> 

          <div class="card col-6 card-wallet" role="button" @click.stop="connectWalletConnect">
            <img src="/img/wallets/wc.png" class="card-img-top card-img-wallet" alt="WalletConnect">
            <small class="text-center mb-3 text-muted">WalletConnect</small>
          </div> 

          <div class="card col-6 card-wallet" role="button" @click.stop="connectMetaMask">
            <img src="/img/wallets/metamask.png" class="card-img-top card-img-wallet" alt="MetaMask">
            <small class="text-center mb-3 text-muted">MetaMask</small>
          </div>

          <div class="card col-6 card-wallet" role="button" @click.stop="connectInjected">
            <img src="/img/wallets/rainbow.png" class="card-img-top card-img-wallet" alt="Rainbow">
            <small class="text-center mb-3 text-muted">Rainbow</small>
          </div> 

          <div class="card col-6 card-wallet" role="button" @click.stop="connectInjected">
            <img src="/img/wallets/bifrost.png" class="card-img-top card-img-wallet" alt="Bifrost">
            <small class="text-center mb-3 text-muted">Bifrost</small>
          </div> 

          <div class="card col-6 card-wallet" role="button" @click.stop="connectInjected">
            <img src="/img/wallets/brave.png" class="card-img-top card-img-wallet" alt="Brave">
            <small class="text-center mb-3 text-muted">Brave</small>
          </div>

        </div>
      </div>
    </div>
  </div>
  <!-- END Connect Wallet modal -->
</template>

<script>
import { useChainId, useConnect } from '@wagmi/vue'

export default {
  name: "ConnectButton",
  props: ['color'], // bg: 'btn-primary' or 'btn-dark'

  computed: {
    getColor() {
      return this.color || 'btn-primary'
    }
  },
  
  data() {
    return {
      isModalOpen: false
    }
  },

  methods: {    
    openModal() {
      this.isModalOpen = true;
      document.body.classList.add('modal-open');
    },

    closeModal() {
      this.isModalOpen = false;
      document.body.classList.remove('modal-open');
    },

    async connectInjected() {
      try {
        await this.connect({ connector: this.connectors[0], chainId: this.chainId });
        this.closeModal();
      } catch (error) {
        console.error("Failed to connect injected wallet:", error);
      }
    },

    async connectMetaMask() {
      try {
        await this.connect({ connector: this.connectors[2], chainId: this.chainId });
        this.closeModal();
      } catch (error) {
        console.error("Failed to connect MetaMask:", error);
      }
    },

    async connectRabby() {
      try {
        await this.connect({ connector: this.connectors[4], chainId: this.chainId });
        this.closeModal();
      } catch (error) {
        console.error("Failed to connect rabby wallet:", error);
      }
    },

    async connectWalletConnect() {
      try {
        await this.connect({ connector: this.connectors[1], chainId: this.chainId });
        this.closeModal();
      } catch (error) {
        console.error("Failed to connect WalletConnect:", error);
      }
    },
  },

  setup() {
    const chainId = useChainId()
    const { connect, connectors, error, status } = useConnect()

    return {
      chainId,
      connect,
      connectors,
      error,
      status,
    }
  }
}
</script>

