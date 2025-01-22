<template>
  <div class="mb-4">
    <MinterDetails />
  </div>

  <!-- Navigation buttons -->
  <div class="d-flex flex-wrap justify-content-center mb-5 gap-3">
    <NuxtLink to="/" class="btn btn-primary">Launch Minter</NuxtLink>
    <NuxtLink to="/mint-zk" class="btn btn-primary">Mint ZK</NuxtLink>
    <NuxtLink to="/grant-minter-role" class="btn btn-primary">Grant Minter Role</NuxtLink>
  </div>
  <!-- END Navigation buttons -->
</template>

<script>
import MinterDetails from './components/MinterDetails.vue'

export default {
  name: 'MinterDetailsPage',

  components: {
    MinterDetails
  }
}
</script>