<template>
  <div class="container">
    <NuxtLink to="/">
      <!-- <h1>Oxygen</h1> -->
      <Icon icon="icon-oxygen" />
    </NuxtLink>
  </div>
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  svg {
    width: 100%;
    max-width: 125px;
  }
}
</style>
