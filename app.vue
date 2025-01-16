<template>
<div>
  <Head>
    <Title>{{ $config.public.projectMetadataTitle }}</Title>
    <Meta name="description" :content="$config.public.projectDescription" />
    <Link rel="icon" type="image/x-icon" :href="$config.public.favicon" />

    <Meta property="og:title" :content="$config.public.projectMetadataTitle" />
    <Meta property="og:description" :content="$config.public.projectDescription" />
    <Meta property="og:image" :content="$config.public.projectUrl + $config.public.previewImage" />

    <Meta name="twitter:card" content="summary_large_image" />
    <Meta name="twitter:site" :content="$config.public.projectTwitter" />
    <Meta name="twitter:creator" :content="$config.public.projectTwitter" />
    <Meta name="twitter:title" :content="$config.public.projectMetadataTitle" />
    <Meta name="twitter:description" :content="$config.public.projectDescription" />
    <Meta name="twitter:image" :content="$config.public.projectUrl + $config.public.previewImage" />
  </Head>

  <Navbar />
  <Account />
  <Connect />
</div>
</template>

<script>
import Navbar from './components/Navbar.vue';
import Account from './components/Account.vue';
import Connect from './components/Connect.vue';

export default {
  name: "App",

  components: {
    Navbar,
    Account,
    Connect,
  }
}
</script>

