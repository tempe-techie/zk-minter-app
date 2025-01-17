<template>
  <div class="mb-4">
    <GrantMinterRole />
  </div>

  <!-- Navigation buttons -->
  <div class="d-flex justify-content-center mb-5">
    <NuxtLink to="/revoke-minter-role" class="btn btn-primary me-3">Revoke Minter Role</NuxtLink>
    <NuxtLink to="/" class="btn btn-primary">Launch Minter Contract</NuxtLink>
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