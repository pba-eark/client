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
  height: 20px;
  width: 20px;
}

.new {
  &-task {
    border: none;
    border-radius: 3px;
    background-color: transparent;
    font-weight: 600;
    font-size: 1rem;
    padding: var(--input-padding);

    svg {
      margin-left: 10px;
    }

    &:hover {
      background-color: #d8d8d8;
    }
  }
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
