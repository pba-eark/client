<script setup>

const props = defineProps({
  data: {
    type: Object,
    required: true,
  }
});

</script>

<template>
    <p>{{ props.data.taskName }}</p>
</template>