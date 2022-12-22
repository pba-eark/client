<script setup>
const props = defineProps({
  classes: {
    type: String,
    required: false,
  },
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
      v-bind="$attrs"
      :required="props.required"
      v-else-if="props.type === 'search'"
      v-model="data.value"
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
      @change="
        if (props.emit && props.emit.length) $emit(`${props.emit}`, data.value);
      "
      :type="props.type"
      :placeholder="props.placeholder"
    />
  </label>
</template>

<style lang="scss" scoped>
select {
  width: 100%;
  border: none;
  background-color: transparent;
  border-radius: 3px;
  font-size: inherit;
  line-height: inherit;
  color: inherit;
  font-style: inherit;
  padding: var(--input-padding);

  &:hover,
  &:focus-visible {
    background-color: var(--color-task-input);
    color: var(--font-color-primary);
  }
  &:focus-visible {
    outline: none;
  }
}

.input {
  font-size: 1rem;
  line-height: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  // margin-bottom: 0.5rem;

  &__label {
    display: block;
    user-select: none;
  }

  &__text {
    &--task {
      width: 100%;
      input {
        width: 100%;
        background-color: transparent;
        border: none;
        border-radius: 3px;
        font-size: inherit;
        line-height: inherit;
        color: inherit;
        font-style: inherit;
        padding: var(--input-padding);

        &:hover,
        &:focus-visible {
          background-color: var(--color-task-input);
          color: var(--font-color-primary);
        }
        &:focus-visible {
          outline: none;
          border-bottom: 1px solid var(--color-scrollbar);
        }
      }
    }
  }

  &__number {
    &--task {
      width: 100%;
      input {
        width: 100%;
        text-align: right;
        background-color: transparent;
        border: none;
        border-radius: 3px;
        font-size: inherit;
        line-height: inherit;
        color: inherit;
        font-style: inherit;
        padding: var(--input-padding);

        &:hover,
        &:focus-visible {
          background-color: var(--color-task-input);
          color: var(--font-color-primary);
        }
        &:focus-visible {
          outline: none;
          border-bottom: 1px solid var(--color-scrollbar);
        }
      }
    }
  }

  &__select {
    &--task {
      width: 100%;
      select {
        width: 100%;
        border: none;
        background-color: transparent;
        border-radius: 3px;
        font-size: inherit;
        line-height: inherit;
        color: inherit;
        font-style: inherit;
        padding: var(--input-padding);

        &:hover,
        &:focus-visible {
          background-color: var(--color-task-input);
          color: var(--font-color-primary);
        }
        &:focus-visible {
          outline: none;
        }
      }
    }
    &--overview-status {
      width: 130px;
      select {
        width: 100%;
        border: none;
        background-color: transparent;
        border-radius: 3px;
        font-size: inherit;
        line-height: inherit;
        color: inherit;
        font-style: inherit;
        padding: var(--input-padding);

        &:hover,
        &:focus-visible {
          background-color: var(--color-task-input);
          color: var(--font-color-primary);
        }
        &:focus-visible {
          outline: none;
        }
      }
    }
  }

  &__checkbox {
    &--task {
      input {
        height: 20px;
        width: 20px;
      }
    }
  }

  &__default {
    margin: 1rem 0;
    display: block;
    input {
      margin: 0.6rem 0;
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
