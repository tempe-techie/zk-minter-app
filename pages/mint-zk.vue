<template>
  <div class="mb-4">
    <MintZkTokens />
  </div>

  <!-- Navigation buttons -->
  <div class="d-flex flex-wrap justify-content-center mb-5 gap-3">
    <NuxtLink to="/grant-minter-role" class="btn btn-primary">Grant Minter</NuxtLink>
    <NuxtLink to="/revoke-minter-role" class="btn btn-primary">Revoke Minter</NuxtLink>
    <NuxtLink to="/" class="btn btn-primary">Launch Minter</NuxtLink>
  </div>
  <!-- END Navigation buttons -->
</template>

<script>
import MintZkTokens from './components/MintZkTokens.vue'

export default {
  name: 'MintZkTokensPage',

  components: {
    MintZkTokens
  }
}
</script>