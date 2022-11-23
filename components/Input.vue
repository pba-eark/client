<script setup>
const props = defineProps({
  label: {
    type: String,
    required: false,
  },
  placeholder: {
    type: String,
    required: false,
    default: "",
  },
  type: {
    type: String,
    default: "text",
  },
  emit: {
    type: String,
    required: false,
  },
});

const data = reactive({
  value: "",
});
</script>

<template>
  <label>
    {{ props.label ? props.label : "" }}
    <input
      v-model="data.value"
      v-bind="$attrs"
      @keyup="
        if (props.emit && props.emit.length) $emit(`${props.emit}`, data.value);
      "
      :type="props.type"
      :placeholder="props.placeholder"
    />
  </label>
</template>
