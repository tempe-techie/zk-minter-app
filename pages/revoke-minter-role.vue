<template>
  <Head>
    <Title>Revoke Minter Role</Title>
    <Meta name="description" content="Revoke a minter role in your ZK Capped Minter Contract (V2)" />
    <Link rel="icon" type="image/x-icon" :href="$config.public.favicon" />

    <Meta property="og:title" content="Revoke Minter Role" />
    <Meta property="og:description" content="Revoke a minter role in your ZK Capped Minter Contract (V2)" />
    <Meta property="og:image" :content="$config.public.projectUrl + $config.public.previewImage" />

    <Meta name="twitter:card" content="summary_large_image" />
    <Meta name="twitter:site" :content="$config.public.projectTwitter" />
    <Meta name="twitter:creator" :content="$config.public.projectTwitter" />
    <Meta name="twitter:title" content="Revoke Minter Role" />
    <Meta name="twitter:description" content="Revoke a minter role in your ZK Capped Minter Contract (V2)" />
    <Meta name="twitter:image" :content="$config.public.projectUrl + $config.public.previewImage" />
  </Head>

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