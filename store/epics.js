import { defineStore } from "pinia";
import { useAuthStore } from "./auth";

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
    const epics = await $fetch(`${runtimeConfig.public.API_URL}/epics`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.API_TOKEN}`,
      },
    });

    setEpics(epics);
  };

  const createEpic = async (sheetId) => {
    sheetId = parseInt(sheetId);

    const newEpic = {
      epicName: "Ny Epic",
      estimateSheetId: sheetId,
      epicStatusId: 1,
    };

    const response = await $fetch(`${runtimeConfig.public.API_URL}/epics`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.API_TOKEN}`,
      },
      body: newEpic,
    });

    epics.value = [...epics.value, response];
  };

  const updateEpic = async (obj) => {
    const { id } = obj;
    const res = await $fetch(`${runtimeConfig.public.API_URL}/epics/${id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.API_TOKEN}`,
      },
      body: obj,
    });

    epics.value.map((epic) => {
      if (epic.id === id) Object.assign(epic, res);
    });
  };

  const deleteEpic = async (epicId) => {
    const response = await $fetch(
      `${runtimeConfig.public.API_URL}/epics/${epicId}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.API_TOKEN}`,
        },
      }
    );

    removeEpic(epicId);
  };

  const removeEpic = (epicId) => {
    epics.value.forEach((element) => {
      element.id;
      if (element.id == epicId) {
        let index = epics.value.findIndex(element);
        epics.value.splice(index, 1);
      }
    });
  };

  /* Getters */
  const EPICS = computed(() => epics.value);

  return {
    getEpics,
    createEpic,
    updateEpic,
    EPICS,
  };
});
