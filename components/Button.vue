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
  font-size: 1rem;
}

svg {
  height: 20px;
  width: 20px;
  transition: all 500ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.exit {
  border: none;
  background-color: transparent;

  svg {
    width: 15px;
    height: 15px;
  }
}

.new {
  &-epic {
    border: none;
    border-radius: 3px;
    background-color: var(--color-background);
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

  &-setting {
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
      background-color: var(--color-task-input);
    }
  }
}
.edit {
  &-epic {
    border: none;
    background-color: transparent;
    margin-left: 10px;

    &:hover {
      scale: 1.1;
    }
  }
  &-setting {
    border: none;
    background-color: transparent;
    width: fit-content;
    padding: 6px;

    &:hover {
      scale: 1.1;
    }
  }
}

.delete {
  border: none;
  background-color: transparent;
  gap: 10px;
  margin-top: 20px;
  font-weight: 600;
}

.copy {
  border: none;
  background-color: transparent;
  gap: 10px;
  margin-top: 20px;
  font-weight: 600;
}

.paste {
  &-epic {
    border: none;
    border-radius: 3px;
    background-color: var(--color-background);
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

.sheet-overview {
  font-weight: 600;
  height: 36px;
  padding: 6px 15px;

  &.open {
    svg {
      rotate: 180deg;
    }
  }
}

.customer-selection {
  padding: 4px 8px;
  margin-left: auto;
  height: 36px;

  &:disabled {
    cursor: not-allowed;
  }
}

.button__settings {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row-reverse;
  border: none;
  background: transparent;
  gap: 5px;
}
</style>
