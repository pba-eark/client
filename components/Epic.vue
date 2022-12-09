<script setup>
import { useTaskStore } from "~/store/tasks";
import { useDetailsStore } from "~/store/details";

const taskStore = useTaskStore();
const detailsStore = useDetailsStore();

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
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

const tasksForEpic = computed(() => {
  return taskStore.TASKS.filter((task) => {
    return task.epicId === props.data.id;
  });
});
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
      />
    </div>

    <div class="epic__footer">
      <Button
        :text="`Ny task (${props.data.epicName})`"
        @click="handleCreateTask"
      />
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
