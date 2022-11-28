<script setup>
const props = defineProps({
  text: {
    type: String,
    required: true,
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
    {{ props.text }}
    <Icon v-if="props.icon" :icon="props.icon" />
  </button>
</template>
