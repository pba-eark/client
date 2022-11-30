import { defineStore } from "pinia";

export const useDetailsStore = defineStore("details-store", () => {
  /* State */
  const details = ref(null);

  /* Actions */
  const setDetails = (payload) => {
    details.value = payload;
  };

  /* Getters */
  const DETAILS = computed(() => details.value);

  return {
    setDetails,
    DETAILS,
  };
});
