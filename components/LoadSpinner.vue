<script setup>
import "vue3-lottie/dist/style.css";
</script>

<template>
  <div class="loading">
    <client-only>
      <Vue3Lottie animationLink="/loading.json" :height="250" :width="250" />
    </client-only>
  </div>
</template>

<style lang="scss" scoped>
.loading {
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
