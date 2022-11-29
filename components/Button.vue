<script setup>
const props = defineProps({
  text: {
    type: String,
    required: false,
    default: "",
  },
  icon: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    default: "button",
  },
  emit: {
    type: String,
    required: false,
  },
});
</script>

<template>
  <button
    @click="if (props.emit && props.emit.length) $emit(`${props.emit}`);"
    :type="type"
  >
    <slot />
    <span>{{ props.text }}</span>
    <Icon v-if="props.icon" :icon="props.icon" />
  </button>
</template>

<style lang="scss" scoped>
button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}
svg {
  height: 25px;
  width: 25px;
}
</style>
