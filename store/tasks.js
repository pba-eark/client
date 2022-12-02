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

  const updateTask = async (obj) => {
    const { id } = obj;

    const res = await $fetch(`${runtimeConfig.public.API_URL}/tasks/${id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.API_TOKEN}`,
      },
      body: obj,
    });

    tasks.value.map((task) => {
      if (task.id == id) {
        console.log("DENNE HER", task);
        Object.assign(task, res);
      }
    });
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

  const createTask = async (epicId) => {
    const obj = {
      parentId: 0,
      taskName: "Ny task",
      hourEstimate: 0,
      estimateReasoning: "Begrundelse for estimat...",
      optOut: false,
      taskDescription: "Beskrivelse...",
      epicId,
      roleId: 0,
      riskProfileId: 1,
    };

    try {
      const res = await $fetch(`${runtimeConfig.public.API_URL}/tasks`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.API_TOKEN}`,
        },
        body: obj,
      });

      tasks.value = [...tasks.value, res];
    } catch (e) {
      console.log("ERROR", e);
    }
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
