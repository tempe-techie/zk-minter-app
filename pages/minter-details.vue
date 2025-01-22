<template>
  <Head>
    <Title>Minter Contract Details</Title>
    <Meta name="description" content="Check the details of a ZK Capped Minter Contract (V2)" />
    <Link rel="icon" type="image/x-icon" :href="$config.public.favicon" />

    <Meta property="og:title" content="Minter Contract Details" />
    <Meta property="og:description" content="Check the details of a ZK Capped Minter Contract (V2)" />
    <Meta property="og:image" :content="$config.public.projectUrl + $config.public.previewImage" />

    <Meta name="twitter:card" content="summary_large_image" />
    <Meta name="twitter:site" :content="$config.public.projectTwitter" />
    <Meta name="twitter:creator" :content="$config.public.projectTwitter" />
    <Meta name="twitter:title" content="Minter Contract Details" />
    <Meta name="twitter:description" content="Check the details of a ZK Capped Minter Contract (V2)" />
    <Meta name="twitter:image" :content="$config.public.projectUrl + $config.public.previewImage" />
  </Head>

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