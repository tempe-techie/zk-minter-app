<template>
  <div class="mb-4">
    <RevokeMinterRole />
  </div>

  <!-- Navigation buttons -->
  <div class="d-flex flex-wrap justify-content-center mb-5 gap-3">
    <NuxtLink to="/grant-minter-role" class="btn btn-primary">Grant Minter</NuxtLink>
    <NuxtLink to="/mint-zk" class="btn btn-primary">Mint ZK</NuxtLink>
    <NuxtLink to="/" class="btn btn-primary">Launch Minter</NuxtLink>
  </div>
  <!-- END Navigation buttons -->
</template>

<script>
import RevokeMinterRole from './components/RevokeMinterRole.vue'

export default {
  name: 'RevokeMinterRolePage',

  components: {
    RevokeMinterRole
  }
}
</script>