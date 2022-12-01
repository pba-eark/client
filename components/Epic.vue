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
    hourEstimate: 0,
    estimateReasoning: "Begrundelse for estimat...",
    optOut: false,
    taskDescription: "Beskrivelse...",
    epicId: props.data.id,
    roleId: 1,
    riskProfileId: 1,
  };

  await taskStore.createTask(authStore.API_TOKEN, obj);
};

const tasksForEpic = computed(() => {
  return taskStore.TASKS.filter((task) => {
    return task.epicId === props.data.id;
  });
});

</script>

<template>
  <div class="block">
    <h2>
      {{ props.data.epicName }}
      <Button text="Edit" @click="detailsStore.setDetails(props.data)" />
    </h2>
    <p>{{ props.data.id }}</p>

    <Task
      v-for="task in tasksForEpic"
      :key="task.id"
      :data="task"
      @click="detailsStore.setDetails(task)"
    />
    <Button text="Add task" @click="handleCreateTask" />
  </div>
</template>

<style lang="scss" scoped>
.block {
  background: purple;
  margin: 2rem 0;
}
</style>
