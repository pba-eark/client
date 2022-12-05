import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
import { typeCheck } from "../helpers/functions";

export const useEpicStatusStore = defineStore("epic-status-store", () => {

  const runtimeConfig = useRuntimeConfig();
  const authStore = useAuthStore();

  /* State */
  const epicStatus = ref([]);

  /* Actions */
  const setEpicStatus = (payload) => {
    epicStatus.value = payload;
  };

  const getEpicStatus = async () => {

    const response = await $fetch(
      `${runtimeConfig.public.API_URL}/epicstatus`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.API_TOKEN}`,
        },
      });

    setEpicStatus(response);
  };

  const createEpicStatus = async (obj) => {

    const response = await $fetch(
      `${runtimeConfig.public.API_URL}/epicstatus`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.API_TOKEN}`,
        },
        body: obj,
      });

    epics.value = [...epics.value, response];
  };

  const updateEpicStatus = async (obj) => {
    const { id } = obj;

    const response = await $fetch(
      `${runtimeConfig.public.API_URL}/epicstatus/${id}`,
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

  const deleteEpicStatus = async (id) => {
    await $fetch(
      `${runtimeConfig.public.API_URL}/epicstatus/${id}`,
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

    epicStatus.value.map((epicStat) => {

      if (epicStat.id === typeCheck(id)) Object.assign(epicStat, obj);

    });

  };

  const remove = (id) => {

    epicStatus.value.forEach((element) => {

      element.id;

      if (element.id === typeCheck(id)) {

        let index = epicStatus.value.findIndex(element);
        epicStatus.value.splice(index, 1);

      }

    });

  };

  /* Getters */
  const EPIC_STATUS = computed(() => epicStatus.value);

  return {
    getEpicStatus,
    createEpicStatus,
    updateEpicStatus,
    deleteEpicStatus,
    EPIC_STATUS
  };
});
