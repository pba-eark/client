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

const handleReset = () => {
  data.value = props.default;
};

defineExpose({
  handleReset,
});
</script>

<template>
  <label class="input">
    <!-- Label -->
    <span class="input__label">
      {{ props.label && props.label.length ? props.label : "" }}
      <span v-if="required" class="required">*</span>
    </span>

    <!-- Textarea -->
    <textarea
      :required="props.required"
      v-if="props.type === 'textarea'"
      v-bind="$attrs"
      v-model="data.value"
      @change="
        if (props.emit && props.emit.length) $emit(`${props.emit}`, data.value);
      "
      :placeholder="props.placeholder"
      >{{ data.value }}</textarea
    >

    <!-- Select -->
    <select
      :required="props.required"
      v-else-if="props.type === 'select'"
      v-model="data.value"
      v-bind="$attrs"
      @change="handleSelect"
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
      :required="props.required"
      v-else-if="props.type === 'search'"
      v-model="data.value"
      v-bind="$attrs"
      @keyup="
        if (props.emit && props.emit.length) $emit(`${props.emit}`, data.value);
      "
      :type="props.type"
      :placeholder="props.placeholder"
    />

    <!-- Default Input -->
    <input
      :required="props.required"
      v-else
      v-model="data.value"
      v-bind="$attrs"
      @change="
        if (props.emit && props.emit.length) $emit(`${props.emit}`, data.value);
      "
      :type="props.type"
      :placeholder="props.placeholder"
    />
  </label>
</template>

<style lang="scss" scoped>
.input {
  font-size: 1rem;
  line-height: 1;
  display: block;
  margin-bottom: 0.5rem;

  &__label {
    display: block;
    user-select: none;
  }

  &__text {
    &--task {
      width: 100%;
      height: 100%;
      background-color: transparent;
      border: none;
      border-radius: 0;
      font-size: inherit;
      line-height: inherit;
    }
  }

  &__number {
    &--task {
      width: 100%;
      height: 100%;
      text-align: right;
      background-color: transparent;
      border: none;
      border-radius: 0;
      font-size: inherit;
      line-height: inherit;

      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
    }
  }

  &__select {
    &--task {
      width: 100%;
      height: 100%;
      border: none;
      background-color: transparent;
      border-radius: 0;
      font-size: inherit;
      line-height: inherit;
    }
  }

  &__checkbox {
    &--task {
      height: 25px;
      width: 25px;
    }
  }

  &__default {
    margin: 1rem 0;
    input {
      padding: 0.3rem;
      width: 100%;
      border: 0;
      outline: none;
      border-bottom: 1px solid #777;
    }
  }
}

.required {
  color: red;
}

.warning {
  input {
    outline: 2px solid red;
  }
}
</style>
