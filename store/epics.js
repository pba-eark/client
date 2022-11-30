import { defineStore } from "pinia";

export const useEpicStore = defineStore("epic-store", () => {
  /* State */
  const epics = ref([]);

  /* Actions */
  const setEpics = (payload) => {
    epics.value = payload;
  };

  const getAllEpics = async (token) => {
    if (!token) return [];
    const runtimeConfig = useRuntimeConfig();

    const epics = await $fetch(`${runtimeConfig.public.API_URL}/epics`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    setEpics(epics);
  };

  const getEpics = async (token, sheetId) => {
    if (!token) return [];
    const runtimeConfig = useRuntimeConfig();

    const epics = await $fetch(
      `${runtimeConfig.public.API_URL}/epics/sheet/${sheetId}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setEpics(epics);
  };

  const createEpic = async (token, obj) => {
    console.log(obj);
    if (!token) return [];
    const runtimeConfig = useRuntimeConfig();

    const response = await $fetch(`${runtimeConfig.public.API_URL}/epics`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: obj,
    });

    console.log("post epic res", response);
  };

  /* Getters */
  const EPICS = computed(() => epics.value);

  return {
    getAllEpics,
    getEpics,
    createEpic,
    EPICS,
  };
});
