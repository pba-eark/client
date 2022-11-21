<script setup>
const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: "currentColor",
  },
});
</script>

<template>
  <svg v-bind="$attrs" :fill="color" :color="color">
    <use :xlink:href="`/symbols.svg#${icon}`" />
  </svg>
</template>
