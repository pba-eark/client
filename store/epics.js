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
      });

    update(id, response);
  };

  const deleteEpic = async (id) => {
    await $fetch(
      `${runtimeConfig.public.API_URL}/epics/${id}`,
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

    epics.value.map((epic) => {

      if (epic.id === typeCheck(id)) Object.assign(epic, obj);

    });

  };

  const remove = (id) => {

    epics.value.forEach((element) => {

      element.id;

      if (element.id === typeCheck(id)) {

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
    deleteEpic,
    EPICS
  };
});
