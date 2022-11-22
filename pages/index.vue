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
    <h1>home</h1>
  </div>
</template>

<style lang="scss" scoped>
.block {
  width: 100%;
  background: yellow;
}
</style>
