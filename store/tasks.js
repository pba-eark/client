import { defineStore } from "pinia";

export const useTaskStore = defineStore("task-store", () => {
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

  const getTasks = async (token) => {
    if (!token) return [];
    const runtimeConfig = useRuntimeConfig();

    const tasks = await $fetch(`${runtimeConfig.public.API_URL}/tasks`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    setTasks(tasks);
  };

  const createTask = async (token, obj) => {
    if (!token) return console.log("Missing access token!");
    const runtimeConfig = useRuntimeConfig();

    const response = await $fetch(`${runtimeConfig.public.API_URL}/tasks`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
