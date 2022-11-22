<script></script>

<template>
  <div class="block">
    <div class="block__header"></div>
    <div class="block__body"></div>
  </div>
</template>

<style lang="scss" scoped>
.block {
  height: calc(100vh - var(--header-height));
  overflow-y: scroll;
  direction: rtl;

  &__header {
    height: 200px;
    background: red;
  }

  &__body {
    height: 100%;
    background: purple;
  }
}
</style>
