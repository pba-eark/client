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
    v-bind="$attrs"
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

.auth-cta {
  margin: 0 auto;
  padding: 0.6rem 8rem;
  border-radius: 50px;
  outline: none;
  border: none;
  background: var(--color-realistic);
  color: #fff;
  font-weight: 600;
  text-align: center;
  display: block;
}
</style>
