<template>
  <div class="mb-4">
    <MintZkTokens />
  </div>

  <!-- Navigation buttons -->
  <div class="d-flex justify-content-center mb-5">
    <NuxtLink to="/grant-minter-role" class="btn btn-primary me-3">Grant Minter</NuxtLink>
    <NuxtLink to="/revoke-minter-role" class="btn btn-primary me-3">Revoke Minter</NuxtLink>
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