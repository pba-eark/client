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

<style lang="scss" scoped></style>
