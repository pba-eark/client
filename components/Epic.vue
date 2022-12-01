<script setup>
import { useAuthStore } from "~/store/auth";
import { useTaskStore } from "~/store/tasks";

const authStore = useAuthStore();
const taskStore = useTaskStore();

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const tasks = reactive([]);

onMounted(async () => {
  await taskStore.getTasks(authStore.API_TOKEN, props.data.id);

  taskStore.TASKS.forEach((element) => {
    tasks.push(element);
  });
});

// let dummytask = {
//   taskName: "lol"
// }
</script>

<template>
  <div class="epic">
    <div class="epic__header">
      <h2>{{ props.data.epicName }}</h2>
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
      <Task v-for="task in tasks" :key="task.id" :data="task" />
    </div>

    <div class="epic__footer">
      
    </div>
  </div>
</template>

<style lang="scss" scoped>
.epic {
  background: gray;
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
}
</style>
