import { defineStore } from "pinia";
import { useAuthStore } from "./auth";

export const useTaskStore = defineStore("task-store", () => {
  const runtimeConfig = useRuntimeConfig();
  const authStore = useAuthStore();

  /* State */
  const tasks = ref([]);

  /* Actions */
  const setTasks = (payload) => {
    tasks.value = payload;
  };

  const updateTask = (obj) => {
    const { id } = obj;

    tasks.value.map((task) => {
      if (task.id === id) Object.assign(task, obj);
    });

    // console.log(`task id ${id} updated!`, obj);
    // console.log("new tasks", tasks.value);
  };

  const getTasks = async () => {
    const tasks = await $fetch(`${runtimeConfig.public.API_URL}/tasks`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.API_TOKEN}`,
      },
    });

    setTasks(tasks);
  };

  const createTask = async (obj) => {
    const response = await $fetch(`${runtimeConfig.public.API_URL}/tasks`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.API_TOKEN}`,
      },
      body: obj,
    });

    tasks.value = [...tasks.value, response];
  };

  /* Getters */
  const TASKS = computed(() => tasks.value);

  return {
    getTasks,
    createTask,
    updateTask,
    TASKS,
  };
});
