<script>
export default defineComponent({
  setup() {
    definePageMeta({
      middleware: ["auth"],
    });
  },
});
</script>

<template>
  <div class="block">
    <h1>Dashboard</h1>
  </div>
</template>

<style lang="scss" scoped>
.block {
  margin: 20px 0 0 15px;
}
</style>
