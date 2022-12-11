import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
import { typeCheck } from "../helpers/functions";

export const useEpicStore = defineStore("epic-store", () => {
  const runtimeConfig = useRuntimeConfig();
  const authStore = useAuthStore();

  /* State */
  const epics = ref([]);

  /* Actions */
  const setEpics = (payload) => {
    epics.value = payload;
  };

  const getEpics = async () => {
    try {
      const epics = await $fetch(`${runtimeConfig.public.API_URL}/epics`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.API_TOKEN}`,
        },
      });

      setEpics(epics);
    } catch (e) {
      return console.log("Error", e);
    }
  };

  const createEpic = async (epic) => {
    try {
      const response = await $fetch(`${runtimeConfig.public.API_URL}/epics`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.API_TOKEN}`,
        },
        body: epic,
      });

      setEpics([...epics.value, response]);
      return response;
    } catch (e) {
      return console.log("Error", e);
    }
  };

  const updateEpic = async (obj) => {
    const { id } = obj;

    try {
      const response = await $fetch(
        `${runtimeConfig.public.API_URL}/epics/${id}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${authStore.API_TOKEN}`,
          },
          body: obj,
        }
      );

      epics.value.map((epic) => {
        if (epic.id === typeCheck(id)) Object.assign(epic, response);
      });
    } catch (e) {
      console.log("Error", e);
    }
  };

  const deleteEpic = async ({ id }) => {
    try {
      await $fetch(`${runtimeConfig.public.API_URL}/epics/${id}`, {
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

    setEpics(
      epics.value.filter((epic) => {
        return epic.id !== id;
      })
    );
  };

  /* Getters */
  const EPICS = computed(() => epics.value);

  return {
    getEpics,
    createEpic,
    updateEpic,
    deleteEpic,
    EPICS,
  };
});
