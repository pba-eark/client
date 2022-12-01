<script setup>
import { useTaskStore } from "~/store/tasks";
const taskStore = useTaskStore();

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

let hoursRealistic = 2.25;
let priceRealistic = 1125.0;
let hoursPessimistic = 2.5;
let pricePessimistic = 1250.0;

const handleUpdateTaskName = (val) => {
  props.data.taskName = val;
  taskStore.updateTask(props.data);
};
</script>

<template>
  <div class="task__row" :class="{ 'task--disabled': props.data.optOut }">
    <div class="task__col">
      <Input
        :default="props.data.taskName"
        emit="update"
        @update="handleUpdateTaskName"
      />
    </div>

    <div class="task__col">
      <Input
        type="select"
        :options="[
          { id: 1, name: 'Lav' },
          { id: 2, name: 'Middel' },
          { id: 3, name: 'Høj' },
        ]"
      />
    </div>

    <div class="task__col">
      <Input
        type="select"
        :options="[
          { id: 1, name: 'Vælg rolle' },
          { id: 2, name: 'Frontend developer' },
          { id: 3, name: 'Backend developer' },
          { id: 4, name: 'Projektleder' },
          { id: 5, name: 'Partner' },
        ]"
      />
    </div>

    <div class="task__col task--number">
      <Input type="number" :default="props.data.hourEstimate.toFixed(2)" />
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

    <div class="task__col task--checkbox">
      <Input
        type="checkbox"
        v-model="props.data.optOut"
        @change="taskStore.updateTask(props.data)"
        :default="props.data.optOut"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.task {
  &__row {
    width: 100%;
    display: grid;
    grid-template-columns: auto 100px 200px 70px 70px 100px 70px 100px 75px;
    gap: 3px;
  }

  &--disabled {
    background: red;
    .task__col {
      background: red;
    }
  }

  &__col {
    background-color: white;
    color: black;
    padding: 5px;
  }

  &--number {
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
  }

  &--checkbox {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &--realistic {
    background-color: green;
    color: white;
    padding: 10px;
  }

  &--pessimistic {
    background-color: blue;
    color: white;
    padding: 10px;
  }
}
</style>
