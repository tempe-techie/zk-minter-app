<template>
<h4 class="mt-4 text-center">About</h4>

<div class="d-flex justify-content-center mb-5">
  <div class="card text-white bg-primary send-tokens-card">
    <div class="card-body">

      <p class="card-text">
        ZK Minter Launcher is a web3 app that allows you to launch a 
        <a href="https://github.com/zksync-association/zk-governance/blob/master/l2-contracts/src/ZkCappedMinterV2.sol" target="_blank">
          ZK Capped Minter contract (V2)
        </a>
        via the official 
        <a href="https://github.com/zksync-association/zk-governance/blob/master/l2-contracts/src/ZkCappedMinterV2Factory.sol" target="_blank">
          ZK Capped Minter Factory contract
        </a>.
      </p>

      <p class="card-text">All the code is open source and you can find it on GitHub:</p>

      <ul>
        <li>
          <a href="https://github.com/tempe-techie/zk-minter-app" target="_blank">https://github.com/tempe-techie/zk-minter-app</a>
        </li>
      </ul>

      <p class="card-text">Feel free to fork it and contribute to it!</p>

      <hr />

      <h4>How to connect your Safe to the app:</h4>
      <p class="card-text">1. In the ZK Minter app, click on the "Connect Wallet" button and select "WalletConnect".</p>
      <p class="card-text">2. A small modal will appear. Click on the copy icon (two overlapping squares) to copy the WalletConnect URI.</p>
      <p class="card-text">3. Go to <a href="https://app.safe.global/" target="_blank">https://app.safe.global/</a> and open your Safe.</p>
      <p class="card-text">4. In the navigation bar, click on the "WalletConnect" icon.</p>
      <p class="card-text">5. In the modal that appears, enter the WalletConnect URI that you copied in the previous step.</p>
      <p class="card-text">6. Wait for the Safe to connect.</p>
      <p class="card-text">7. You should now see your Safe address in the ZK Minter app.</p>

      <hr />

      <p class="card-text">
        Made by 
        <a href="https://forum.zknation.io/u/tempetechie.eth/summary" target="_blank">Tempe Techie</a> for ZK Nation.
      </p>
  
      
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'AboutComponent'
}
</script>

<style scoped>
a {
  color: #ffffff;
}

a:hover {
  color: #e6e6e6;
}
</style>