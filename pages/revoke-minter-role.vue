<template>
  <div class="mb-4">
    <RevokeMinterRole />
  </div>

  <!-- Navigation buttons -->
  <div class="d-flex justify-content-center mb-5">
    <NuxtLink to="/grant-minter-role" class="btn btn-primary me-3">Grant Minter Role</NuxtLink>
    <NuxtLink to="/" class="btn btn-primary">Launch Minter Contract</NuxtLink>
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