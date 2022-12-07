<script setup>
import { useAuthStore } from "~/store/auth";
import { useTaskStore } from "~/store/tasks";
import { useDetailsStore } from "~/store/details";

const authStore = useAuthStore();
const taskStore = useTaskStore();
const detailsStore = useDetailsStore();

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const handleCreateTask = async () => {
  const obj = {
    parentId: 0,
    taskName: "Ny task",
    hourEstimate: 2,
    estimateReasoning: "Begrundelse for estimat...",
    optOut: false,
    taskDescription: "Beskrivelse...",
    epicId: props.data.id,
    roleId: null,
    riskProfileId: 1,
  };

  await taskStore.createTask(obj);
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
        <div class="epic__table-col">Navn</div>
        <div class="epic__table-col">Risikoprofil</div>
        <div class="epic__table-col">Rolle</div>
        <div class="epic__table-col">Estimat</div>
        <div class="epic__table-col epic__table--realistic">
          <div class="">Timer</div>
          <div class="">Pris DKK</div>
        </div>
        <div class="epic__table-col epic__table--pessimistic">
          <div class="">Timer</div>
          <div class="">Pris DKK</div>
        </div>
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
      <!-- <Button text="Ny task" @click="handleCreateTask" /> -->
      <Button
        text="Ny task"
        @click="taskStore.createTask(parseInt(props.data.id))"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.epic {
  margin: 5px 0;
  padding: 5px;

  &__table {
    display: grid;
    gap: 3px;

    &-header {
      width: 100%;
      display: grid;
      grid-template-columns: auto 100px 200px 70px 70px 100px 70px 100px 75px;
      gap: 3px;
      margin-bottom: 3px;
    }

    &-col {
      background-color: black;
      color: white;
      padding: 10px;
    }

    &--realistic {
      grid-column: span 2;
      background-color: green;
      display: grid;
      grid-template-columns: 70px 100px;
    }

    &--pessimistic {
      grid-column: span 2;
      background-color: blue;
      display: grid;
      grid-template-columns: 70px 100px;
    }
  }

  &__header {
    .flex {
      display: flex;
    }
  }
}
</style>
