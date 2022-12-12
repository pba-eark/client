<script setup>
import { useTaskStore } from "~/store/tasks";
import { useDetailsStore } from "~/store/details";
import { useRiskProfileStore } from "~/store/riskProfiles";
import { useRoleStore } from "~/store/roles";

const taskStore = useTaskStore();
const detailsStore = useDetailsStore();
const riskProfileStore = useRiskProfileStore();
const roleStore = useRoleStore();

const totalEstimatedHours = ref(0);
const totalRealisticHours = ref(0);
const totalPessimisticHours = ref(0);
const totalRealisticPrice = ref(0);
const totalPessimisticPrice = ref(0);

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

onMounted(() => {
  calculateTotals();
});

const handleCreateTask = async () => {
  const newTask = {
    parentId: 0,
    taskName: "Ny task",
    hourEstimate: 0,
    estimateReasoning: "Begrundelse for estimat...",
    optOut: false,
    taskDescription: "Beskrivelse...",
    epicId: parseInt(props.data.id),
    roleId: 0,
    riskProfileId: 1,
  };

  await taskStore.createTask(newTask);
};

const handleTaskUpdate = () => {
  calculateTotals();
};

const roundNearQtr = (number) => {
  return (Math.round(number * 4) / 4).toFixed(2);
};

const numberDotSeperator = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const tasksForEpic = computed(() => {
  return taskStore.TASKS.filter((task) => {
    return task.epicId === props.data.id;
  });
});

const calculateTotals = () => {
  totalEstimatedHours.value = 0;
  totalRealisticHours.value = 0;
  totalPessimisticHours.value = 0;
  totalRealisticPrice.value = 0;
  totalPessimisticPrice.value = 0;

  tasksForEpic.value.forEach((task) => {
    const currentRiskProfile = riskProfileStore.RISK_PROFILES.filter((p) => {
      return p.id === task.riskProfileId;
    })[0];

    const currentRole = roleStore.ROLES.filter((r) => {
      return r.id === task.roleId;
    })[0];

    /* Total estimated hours */
    totalEstimatedHours.value += task.hourEstimate;

    /* Total realistic hours */
    totalRealisticHours.value += parseFloat(
      roundNearQtr(
        task.hourEstimate * (1 + currentRiskProfile.percentage / 2 / 100)
      )
    );

    /* Total realistic price */
    if (currentRole) {
      totalRealisticPrice.value += parseFloat(
        currentRole.hourlyWage *
          task.hourEstimate *
          (1 + currentRiskProfile.percentage / 2 / 100)
      );
    }

    /* Total pessimistic price */
    totalPessimisticHours.value += parseFloat(
      roundNearQtr(
        task.hourEstimate * (1 + currentRiskProfile.percentage / 100)
      )
    );

    /* Total pessimistic price */
    if (currentRole) {
      totalPessimisticPrice.value += parseFloat(
        currentRole.hourlyWage *
          task.hourEstimate *
          (1 + currentRiskProfile.percentage / 100)
      );
    }
  });
};
</script>

<template>
  <div class="epic" :data-epic-id="props.data.id">
    <div class="epic__header">
      <div class="flex">
        <h2>{{ props.data.epicName }}</h2>
        <Button text="Edit" @click="detailsStore.setDetails(props.data)" />
      </div>
      <div class="epic__table-header">
        <div class="epic__table-col">Task navn</div>
        <div class="epic__table-col">Risikoprofil</div>
        <div class="epic__table-col">Rolle</div>
        <div class="epic__table-col epic__table--right">Estimat</div>
        <div class="epic__table-col epic__table--right">Timer</div>
        <div class="epic__table-col epic__table--right">Pris DKK</div>
        <div class="epic__table-col epic__table--right">Timer</div>
        <div class="epic__table-col epic__table--right">Pris DKK</div>
        <div class="epic__table-col">Fravalgt</div>
      </div>
    </div>

    <div class="epic__table">
      <Task
        v-for="task in tasksForEpic"
        :key="task.id"
        :data="task"
        @click="detailsStore.setDetails(task)"
        @update="handleTaskUpdate"
      />
    </div>

    <div class="epic__footer">
      <Button
        :text="`Ny task (${props.data.epicName})`"
        @click="handleCreateTask"
      />

      <div>
        Estimat i alt {{ totalEstimatedHours.toFixed(2).replace(".", ",") }}
      </div>

      <div>
        Realistisk timer i alt
        {{ totalRealisticHours.toFixed(2).replace(".", ",") }}
      </div>

      <div>
        Realistisk pris i alt
        {{
          numberDotSeperator(totalRealisticPrice.toFixed(2).replace(".", ","))
        }}
      </div>

      <div>
        Pessimistic timer i alt
        {{ totalPessimisticHours.toFixed(2).replace(".", ",") }}
      </div>

      <div>
        Pessimistic pris i alt
        {{
          numberDotSeperator(totalPessimisticPrice.toFixed(2).replace(".", ","))
        }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.epic {
  margin: 5px 0;

  &__table {
    display: grid;
    gap: var(--table-gap);

    &-header {
      width: 100%;
      display: grid;
      gap: var(--table-gap);
      grid-template-columns: var(--table-columns);
      font-weight: 600;
    }

    &-col {
      color: var(--font-color-primary);
      padding: 7px;
    }

    &--right {
      text-align: right;
    }

    &--realistic {
      grid-column: span 2;
      display: grid;
      grid-template-columns: 70px 100px;
    }

    &--pessimistic {
      grid-column: span 2;
      display: grid;
      grid-template-columns: 70px 100px;
    }
  }

  &__header {
    position: sticky;
    top: -20px;
    background: var(--color-background);
    z-index: 1;
    .flex {
      display: flex;
    }
  }

  &__footer {
    position: sticky;
    bottom: -20px;
    background: var(--color-background);
  }
}
</style>
