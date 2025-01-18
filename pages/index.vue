<template>
  <div class="mb-4">
    <LaunchMinter />
  </div>

  <!-- Navigation buttons -->
  <div class="d-flex flex-wrap justify-content-center mb-5 gap-3">
    <NuxtLink to="/grant-minter-role" class="btn btn-primary">Grant Minter</NuxtLink>
    <NuxtLink to="/revoke-minter-role" class="btn btn-primary">Revoke Minter</NuxtLink>
    <NuxtLink to="/mint-zk" class="btn btn-primary">Mint ZK</NuxtLink>
  </div>
  <!-- END Navigation buttons -->
</template>

<script>
import LaunchMinter from './components/LaunchMinter.vue'

export default {
  name: 'Home',

  components: {
    LaunchMinter
  }
}
</script>