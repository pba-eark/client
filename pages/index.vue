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
  <h1>home</h1>
</template>
