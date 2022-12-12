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

const emit = defineEmits(["update"]);

const handleUpdateTaskName = (val) => {
  props.data.taskName = val;
  taskStore.updateTask(props.data);
  detailsStore.setDetails(props.data);
};

const handleUpdateEstimate = (val) => {
  val = roundNearQtr(val);
  if (val.includes(",")) val = val.replace(",", ".");
  val = parseFloat(val).toFixed(2);

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
  if (!currentRole.value?.hourlyWage) return "0,00";
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
  if (!currentRole.value?.hourlyWage) return "0,00";

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
        class="input__text--task"
        :default="props.data.taskName"
        emit="updateTaskName"
        @updateTaskName="handleUpdateTaskName"
      />
    </div>

    <div class="task__col">
      <Input
        class="input__select--task"
        type="select"
        :options="riskProfileOptions"
        emit="updateRiskProfile"
        :placeholder="currentRiskProfile.profileName"
        @updateRiskProfile="handleUpdateRiskProfile"
      />
    </div>

    <div class="task__col">
      <Input
        class="input__select--task"
        type="select"
        :placeholder="
          currentRole?.roleName ? currentRole.roleName : 'Vælg rolle'
        "
        :options="roleOptions"
        emit="updateRole"
        @updateRole="handleUpdateRole"
      />
    </div>

    <div class="task__col">
      <Input
        class="input__number--task"
        :default="currentEstimate"
        emit="updateEstimate"
        @updateEstimate="handleUpdateEstimate"
      />
    </div>

    <div class="task__col task--number task--realistic">
      {{ hoursRealistic }}
    </div>

    <div class="task__col task--number task--realistic">
      {{ priceRealistic }}
    </div>

    <div class="task__col task--number task--pessimistic">
      {{ hoursPessimistic }}
    </div>

    <div class="task__col task--number task--pessimistic">
      {{ pricePessimistic }}
    </div>

    <div class="task__col task--center">
      <Input
        type="checkbox"
        class="input__checkbox--task"
        v-model="props.data.optOut"
        @change="taskStore.updateTask(props.data)"
        :default="props.data.optOut"
      />
    </div>

    <div class="task__col task--center">
      <Icon icon="icon-dots" class="task__details-icon" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.task {
  &__row {
    width: 100%;
    background-color: var(--color-task);
    display: grid;
    gap: var(--table-gap);
    grid-template-columns: var(--table-columns);
  }

  &--disabled {
    background: var(--color-disabled);
    .task__col {
      background: var(--color-disabled);
    }
  }

  &__col {
    color: var(--font-color-primary);
    padding: 2px;
  }

  &--number {
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
  }

  &--realistic {
    background-color: var(--color-realistic);
    color: var(--font-color-secondary);
    padding: 8px;
  }

  &--pessimistic {
    background-color: var(--color-pessimistic);
    color: var(--font-color-secondary);
    padding: 8px;
  }

  &--center {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__details-icon {
    max-height: 20px;
    max-width: 20px;
    cursor: pointer;
  }
}
</style>
