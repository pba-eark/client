<script setup>
import { useTabsStore } from "~/store/tabs";

const store = useTabsStore();
</script>

<template>
  <ul class="tabs">
    tabs:
    <li v-for="tab in store.TABS">{{ tab }}</li>
  </ul>
</template>

<style lang="scss" scoped>
.tabs {
  background: pink;
  height: 50px;
}
</style>
