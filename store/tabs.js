import { defineStore } from "pinia";

export const useTabsStore = defineStore("tabs-store", () => {
  /* State */
  const tabs = ref([]);

  /* Actions */
  const addTab = (payload) => {
    tabs.value = [...tabs.value, payload];
  };

  //   const removeTab = (payload) => {
  //     const index = tabs.value.findIndex(payload);
  //     tabs.value = [...tabs.value, payload];
  //   };

  /* Getters */
  const TABS = computed(() => tabs.value);

  return {
    addTab,
    TABS,
  };
});
