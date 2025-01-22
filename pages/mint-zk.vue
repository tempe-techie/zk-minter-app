<template>
  <Head>
    <Title>Mint ZK Tokens</Title>
    <Meta name="description" content="Mint ZK Tokens via your ZK Minter Contract" />
    <Link rel="icon" type="image/x-icon" :href="$config.public.favicon" />

    <Meta property="og:title" content="Mint ZK Tokens" />
    <Meta property="og:description" content="Mint ZK Tokens via your ZK Minter Contract" />
    <Meta property="og:image" :content="$config.public.projectUrl + $config.public.previewImage" />

    <Meta name="twitter:card" content="summary_large_image" />
    <Meta name="twitter:site" :content="$config.public.projectTwitter" />
    <Meta name="twitter:creator" :content="$config.public.projectTwitter" />
    <Meta name="twitter:title" content="Mint ZK Tokens" />
    <Meta name="twitter:description" content="Mint ZK Tokens via your ZK Minter Contract" />
    <Meta name="twitter:image" :content="$config.public.projectUrl + $config.public.previewImage" />
  </Head>

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