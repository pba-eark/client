<script setup>
const props = defineProps({
  text: String,
  icon: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    default: "button",
  },
});
</script>

<template>
  <div>
    <button @click="$emit('event')" :type="type">
      {{ props.text }}
      <Icon v-if="props.icon" :icon="props.icon" />
    </button>
  </div>
</template>
