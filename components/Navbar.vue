<template>
  <div>
    <h1>Navbar</h1>
  </div>
</template>

<script>
export default {
  name: "Navbar",

  mounted() {
    console.log("Navbar mounted");
    // print test env var
    console.log(this.$config.public.testVar);
  },
}
</script>
