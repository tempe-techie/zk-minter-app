<template>
<div>
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

