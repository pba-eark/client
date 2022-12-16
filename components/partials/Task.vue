<script setup>
import { useTaskStore } from "~/store/tasks";
import { useRoleStore } from "~/store/roles";
import { useRiskProfileStore } from "~/store/riskProfiles";
import { useDetailsStore } from "~/store/details";

const detailsStore = useDetailsStore();
const taskStore = useTaskStore();
const roleStore = useRoleStore();
const riskProfileStore = useRiskProfileStore();

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const estimateInput = ref(null);

const emit = defineEmits(["update"]);

const handleUpdateTaskName = (val) => {
  props.data.taskName = val;
  taskStore.updateTask(props.data);
  detailsStore.setDetails(props.data);
};

const handleUpdateEstimate = (val) => {
  if (val.includes(",")) val = val.toString().replace(",", ".");
  val = roundNearQtr(parseFloat(val));

  if (props.data.hourEstimate == val) {
    /* If new value evaluates to same as old value, reset input to default value. */
    return estimateInput.value.handleReset();
  }

  props.data.hourEstimate = val;
  taskStore.updateTask(props.data);
  detailsStore.setDetails(props.data);
  emit("update");
};

const handleUpdateRiskProfile = (val) => {
  const { id } = val;
  props.data.riskProfileId = id;
  taskStore.updateTask(props.data);
  detailsStore.setDetails(props.data);
  emit("update");
};

const handleUpdateRole = (val) => {
  const { id } = val;
  props.data.roleId = id;
  taskStore.updateTask(props.data);
  detailsStore.setDetails(props.data);
  emit("update");
};

const handleUpdateOptOut = (val) => {
  props.data.optOut = val;
  taskStore.updateTask(props.data);
  detailsStore.setDetails(props.data);
  emit("update");
};

const roundNearQtr = (number) => {
  return (Math.round(number * 4) / 4).toFixed(2);
};

const numberDotSeperator = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const roleOptions = computed(() => {
  return roleStore.ROLES.map((role) => {
    return { id: role.id, name: role.roleName, hourlyWage: role.hourlyWage };
  });
});

const riskProfileOptions = computed(() => {
  return riskProfileStore.RISK_PROFILES.map((riskProfile) => {
    return {
      id: riskProfile.id,
      name: riskProfile.profileName,
      percentage: riskProfile.percentage,
      global: riskProfile.global,
      default: riskProfile.default,
    };
  });
});

const currentRiskProfile = computed(() => {
  return riskProfileStore.RISK_PROFILES.filter((riskProfile) => {
    return riskProfile.id == props.data.riskProfileId;
  })[0];
});

const currentRole = computed(() => {
  return roleStore.ROLES.filter((role) => {
    return role.id == props.data.roleId;
  })[0];
});

const currentEstimate = computed(() => {
  return parseFloat(props.data.hourEstimate).toFixed(2).replace(".", ",");
});

const hoursRealistic = computed(() => {
  return parseFloat(
    roundNearQtr(
      props.data.hourEstimate *
        (1 + currentRiskProfile.value.percentage / 2 / 100)
    )
  )
    .toFixed(2)
    .replace(".", ",");
});

const priceRealistic = computed(() => {
  if (!currentRole.value?.hourlyWage) return "Ingen rolle";
  return numberDotSeperator(
    parseFloat(
      currentRole.value?.hourlyWage *
        props.data.hourEstimate *
        (1 + currentRiskProfile.value.percentage / 2 / 100)
    )
      .toFixed(2)
      .replace(".", ",")
  );
});

const hoursPessimistic = computed(() => {
  return parseFloat(
    roundNearQtr(
      props.data.hourEstimate * (1 + currentRiskProfile.value.percentage / 100)
    )
  )
    .toFixed(2)
    .replace(".", ",");
});

const pricePessimistic = computed(() => {
  if (!currentRole.value?.hourlyWage) return "Ingen rolle";

  return numberDotSeperator(
    parseFloat(
      currentRole.value?.hourlyWage *
        props.data.hourEstimate *
        (1 + currentRiskProfile.value.percentage / 100)
    )
      .toFixed(2)
      .replace(".", ",")
  );
});
</script>

<template>

  <div class="task__row" :class="{ 'task--disabled': props.data.optOut }">

    <div class="task__col">
      <Input
        class="input__text--task task__input--name"
        :default="props.data.taskName"
        emit="updateTaskName"
        @updateTaskName="handleUpdateTaskName"
      />
    </div>

    <div class="task__col">
      <Input
        class="input__select--task task__input--risk"
        type="select"
        :options="riskProfileOptions"
        emit="updateRiskProfile"
        :placeholder="currentRiskProfile.profileName"
        @updateRiskProfile="handleUpdateRiskProfile"
      />
    </div>

    <div class="task__col">
      <Input
        class="input__select--task task__input--role"
        type="select"
        :placeholder="currentRole?.roleName ? currentRole.roleName : 'Vælg rolle'"
        :options="roleOptions"
        emit="updateRole"
        @updateRole="handleUpdateRole"
      />
    </div>

    <div class="task__col">
      <Input
        class="input__number--task task__input--estimate"
        :default="currentEstimate"
        emit="updateEstimate"
        @updateEstimate="handleUpdateEstimate"
        ref="estimateInput"
      />
    </div>

    <div class="task--realistic">
      <div class="task__col">
        <span class="task__hours">
          {{ hoursRealistic }}
        </span>
      </div>
      <div class="task__col">
        <span class="task__price">
          {{ priceRealistic }}
        </span>
      </div>
    </div>

    <div class="task--pessimistic">
      <div class="task__col">
        <span class="task__hours">
          {{ hoursPessimistic }}
        </span>
      </div>
      <div class="task__col">
        <span class="task__price">
          {{ pricePessimistic }}
        </span>
      </div>
    </div>

    <div class="task__col">
      <Input
        class="input__checkbox--task task__input--opt-out"
        type="checkbox"
        emit="updateOptOut"
        @updateOptOut="handleUpdateOptOut"
        :default="props.data.optOut"
      />
    </div>

    <div class="task__col task__col--more">
      <Icon icon="icon-dots" class="task__icon" />
    </div>

  </div>

</template>

<style lang="scss" scoped>

.task {
  &__row {
    display: grid;
    grid-template-columns: var(--table-columns);
    // gap: var(--table-gap);
    color: var(--font-color-primary);
    background-color: var(--color-task);
    border-radius: 4px;
  }
  &__col {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: var(--table-columns-padding);

    &--more {
      padding-right: calc(var(--table-columns-padding) / 2 + var(--input-padding) / 2);
      padding-left: 0;
    }
  }
  &__icon {
    max-height: var(--width-more);
    max-width: var(--width-more);
    cursor: pointer;
  }
  &__hours {
    text-align: right;
    width: var(--width-hours);
    margin: var(--input-padding);
  }
  &__price {
    text-align: right;
    width: var(--width-price);
    margin: var(--input-padding);
  }
  &__input {
    &--name {
    }
    &--risk {
      width: var(--width-risk);
    }
    &--role {
      width: var(--width-role);
    }
    &--estimate {
      width: var(--width-estimate);
    }
    &--opt-out {
      width: var(--width-opt-out);
    }
  }
  &--realistic, &--pessimistic {
    display: flex;
    color: var(--font-color-secondary);
    grid-column: span 2;
  }
  &--realistic {
    background-color: var(--color-realistic);
  }
  &--pessimistic {
    background-color: var(--color-pessimistic);
  }
  &--disabled {
    background: var(--color-disabled);
    color: var(--font-color-secondary);
    font-style: italic;
    .task--realistic, .task--pessimistic {
      background: var(--color-disabled);
    }
    .task__col {
      opacity: 0.6;
    }
  }
}
</style>
