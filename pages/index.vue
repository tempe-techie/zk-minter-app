<template>
  <div class="mb-4">
    <LaunchMinter />
  </div>

  <!-- Navigation buttons -->
  <div class="d-flex justify-content-center mb-5">
    <NuxtLink to="/grant-minter-role" class="btn btn-primary me-3">Grant Minter Role</NuxtLink>
    <NuxtLink to="/revoke-minter-role" class="btn btn-primary">Revoke Minter Role</NuxtLink>
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