<template>
  <div class="mb-4">
    <GrantMinterRole />
  </div>

  <!-- Navigation buttons -->
  <div class="d-flex flex-wrap justify-content-center mb-5 gap-3">
    <NuxtLink to="/revoke-minter-role" class="btn btn-primary">Revoke Minter</NuxtLink>
    <NuxtLink to="/mint-zk" class="btn btn-primary">Mint ZK</NuxtLink>
    <NuxtLink to="/" class="btn btn-primary">Launch Minter</NuxtLink>
  </div>
  <!-- END Navigation buttons -->
</template>

<script>
import GrantMinterRole from './components/GrantMinterRole.vue'

export default {
  name: 'GrantMinterRolePage',

  components: {
    GrantMinterRole
  }
}
</script>