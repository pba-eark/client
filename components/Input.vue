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
  default: {
    type: [String, Number, Boolean],
    required: false,
  },
});

const emit = defineEmits();
const data = reactive({
  value: props.default || "",
});

watch(
  () => props.options.length,
  () => {
    if (props.type === "select") data.value = "";
  }
);

watch(
  () => props.default,
  () => {
    data.value = props.default;
  }
);

const handleSelect = () => {
  if (props.emit && props.emit.length) emit(`${props.emit}`, data.value);

  /* Reset select when updating task epicId */
  if (props.emit == "updateTaskEpicId") data.value = "";
};
</script>

<template>
  <label class="input">
    <!-- Label -->
    <span class="input__label">
      {{ props.label && props.label.length ? props.label : "" }}
      <span v-if="required" class="required" :class="classes">*</span>
    </span>

    <!-- Textarea -->
    <textarea
      v-if="props.type === 'textarea'"
      v-bind="$attrs"
      v-model="data.value"
      @change="
        if (props.emit && props.emit.length) $emit(`${props.emit}`, data.value);
      "
      :placeholder="props.placeholder"
      :class="classes"
      >{{ data.value }}</textarea
    >

    <!-- Select -->
    <select
      v-else-if="props.type === 'select'"
      v-model="data.value"
      v-bind="$attrs"
      @change="handleSelect"
      :class="props.type"
      class="input__field"
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

    <!-- Default Input -->
    <input
      v-else
      v-model="data.value"
      v-bind="$attrs"
      @change="
        if (props.emit && props.emit.length) $emit(`${props.emit}`, data.value);
      "
      :type="props.type"
      :placeholder="props.placeholder"
      class="input__field"
    />
  </label>
</template>

<style lang="scss" scoped>
.input {
  &__label {
    display: block;
    user-select: none;
  }

  &__field {
    font-size: 1rem;
    width: 100%;
    height: 100%;
    padding: 4px;
    border: 1px solid gray;
    background-color: none;
    border-radius: 0;

    &:focus-visible {
      outline: 1px solid black;
    }

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
}

.number {
  text-align: right;
}

.checkbox {
  height: 25px;
  width: 25px;
}

.select {
  background-color: none;
}

.required {
  color: red;
}
</style>
