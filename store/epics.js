import { defineStore } from "pinia";

export const useEpicStore = defineStore("epic-store", () => {
  /* State */
  const epics = ref([]);

  /* Actions */
  const setEpics = (payload) => {
    epics.value = payload;
  };

  const getEpics = async (token) => {
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

    epics.value = [...epics.value, response];
  };

  const editEpic = async (token, epicId, obj) => {
    if (!token) return [];
    const runtimeConfig = useRuntimeConfig();

    const response = await $fetch(
      `${runtimeConfig.public.API_URL}/epics/${epicId}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: obj,
      }
    );

    updateEpic(epicId, response);
  };

  const deleteEpic = async (token, epicId) => {
    if (!token) return [];
    const runtimeConfig = useRuntimeConfig();

    const response = await $fetch(
      `${runtimeConfig.public.API_URL}/epics/${epicId}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    removeEpic(epicId);
  };

  const updateEpic = (id, obj) => {
    epics.value.map((epic) => {
      if (epic.id === id) Object.assign(epic, obj);
    });
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
    editEpic,
    EPICS,
  };
});
