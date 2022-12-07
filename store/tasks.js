import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
import { typeCheck } from "../helpers/functions";

export const useTaskStore = defineStore("task-store", () => {
  const runtimeConfig = useRuntimeConfig();
  const authStore = useAuthStore();

  /* State */
  const tasks = ref([]);

  /* Actions */
  const setTasks = (payload) => {
    tasks.value = payload;
  };

  const getTasks = async () => {
    try {
      const tasks = await $fetch(`${runtimeConfig.public.API_URL}/tasks`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.API_TOKEN}`,
        },
      });

      setTasks(tasks);
    } catch (e) {
      return console.log("Error", e);
    }
  };

  const createTask = async (task) => {
    try {
      const res = await $fetch(`${runtimeConfig.public.API_URL}/tasks`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.API_TOKEN}`,
        },
        body: task,
      });

      tasks.value = [...tasks.value, res];
    } catch (e) {
      console.log("ERROR", e);
    }
  };

  const updateTask = async (obj) => {
    const { id } = obj;

    try {
      await $fetch(`${runtimeConfig.public.API_URL}/tasks/${id}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.API_TOKEN}`,
        },
        body: obj,
      });
    } catch (e) {
      return console.log("Error", e);
    }

    tasks.value.map((task) => {
      if (task.id === typeCheck(id)) Object.assign(task, obj);
    });
  };

  const deleteTask = async ({ id }) => {
    try {
      await $fetch(`${runtimeConfig.public.API_URL}/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.API_TOKEN}`,
        },
      });
    } catch (e) {
      return console.log("Error", e);
    }

    setTasks(
      tasks.value.filter((task) => {
        return task.id !== id;
      })
    );
  };

  /* Getters */
  const TASKS = computed(() => tasks.value);

  return {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    TASKS,
  };
});
