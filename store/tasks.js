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

  /*const updateTask = async (obj) => {
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
      if (task.id == id) Object.assign(task, res);
    });
  };*/

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

  const updateTask = async (obj) => {
    const { id } = obj;

    const response = await $fetch(
      `${runtimeConfig.public.API_URL}/tasks/${id}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.API_TOKEN}`,
        },
        body: obj,
      });

    update(id, response);
  };

  const deleteTask = async (id) => {
    await $fetch(
      `${runtimeConfig.public.API_URL}/tasks/${id}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.API_TOKEN}`,
        },
      });

    remove(id);
  };

  /* Helper functions */
  const update = (id, obj) => {

    tasks.value.map((task) => {

      if (task.id === typeCheck(id)) Object.assign(task, obj);

    });

  };

  const remove = (id) => {

    tasks.value.forEach((element) => {

      element.id;

      if (element.id === typeCheck(id)) {

        let index = tasks.value.findIndex(element);
        tasks.value.splice(index, 1);

      }

    });

  };
  
  /* Getters */
  const TASKS = computed(() => tasks.value);

  return {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    TASKS
  };
});
