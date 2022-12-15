<template>
  <div class="block">
    <div class="block__card">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.block {
  &__card {
    max-width: 600px;
    background: red;
    margin: 4rem auto;
    background: #fff;
    border-radius: 5px;
    padding: 2rem 4rem;
  }
}
</style>
