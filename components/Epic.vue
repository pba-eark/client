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

</script>

<template>
  <div class="block">
    <h2>{{ props.data.epicName }}</h2>
    <p>{{ props.data.id }}</p>

    <Task v-for="task in tasks" :key="task.id" :data="task" />
  </div>
</template>

<style lang="scss" scoped>
.block {
  background: purple;
  margin: 2rem 0;
}
</style>
