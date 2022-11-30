<script setup>
const props = defineProps({
  label: {
    type: String,
    required: false,
  },
  required: {
    type: Boolean,
    default: false,
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
  classes: {
    type: String,
    required: false,
    default: "",
  },
  options: {
    type: Array,
    required: false,
    default: [],
  },
  emit: {
    type: String,
    required: false,
  },
});

const data = reactive({
  value: "",
});

watch(
  () => props.options.length,
  () => {
    data.value = "";
  }
);
</script>

<template>
  <label class="block">
    <!-- Label -->
    <span class="block__label">
      {{ props.label && props.label.length ? props.label : "" }}
      <span v-if="required" class="required" :class="classes">*</span>
    </span>

    <!-- Textarea -->
    <textarea
      v-if="props.type === 'textarea'"
      v-model="data.value"
      v-bind="$attrs"
      @change="
        if (props.emit && props.emit.length) $emit(`${props.emit}`, data.value);
      "
      :type="props.type"
      :placeholder="props.placeholder"
      :class="classes"
    ></textarea>

    <!-- Select -->
    <select
      v-else-if="props.type === 'select'"
      v-model="data.value"
      v-bind="$attrs"
      @change="
        if (props.emit && props.emit.length) $emit(`${props.emit}`, data.value);
      "
      :class="classes"
    >
      <option value="" selected disabled>{{ props.placeholder }}</option>
      <option v-for="option in props.options" :key="option.id" :value="option">
        {{
          option.firstName && option.lastName
            ? `${option.firstName} ${option.lastName}`
            : option.name
        }}
      </option>
    </select>

    <!-- Search -->
    <input
      v-else-if="props.type === 'search'"
      v-model="data.value"
      v-bind="$attrs"
      @keyup="
        if (props.emit && props.emit.length) $emit(`${props.emit}`, data.value);
      "
      :type="props.type"
      :placeholder="props.placeholder"
      :class="classes"
    />

    <!-- Text -->
    <input
      v-else
      v-model="data.value"
      v-bind="$attrs"
      @change="
        if (props.emit && props.emit.length) $emit(`${props.emit}`, data.value);
      "
      :type="props.type"
      :placeholder="props.placeholder"
      :class="classes"
    />
  </label>
</template>

<style lang="scss" scoped>
.block {
  &__label {
    display: block;
    user-select: none;
  }
}

.required {
  color: red;
}
</style>
