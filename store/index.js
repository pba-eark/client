import { defineStore } from "pinia";

export const useGlobalStore = defineStore("global-store", () => {
  /* State */
  const isLoaded = ref(false);

  /* Actions */
  const setLoaded = (payload) => {
    isLoaded.value = payload;
  };

  /* Getters */
  const IS_LOADED = computed(() => isLoaded.value);

  return {
    setLoaded,
    IS_LOADED,
  };
});
