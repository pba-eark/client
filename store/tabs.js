import { defineStore } from "pinia";

export const useTabsStore = defineStore("tabs-store", () => {
  onMounted(() => {
    if (localStorage.getItem("tabs"))
      setTabs(JSON.parse(localStorage.getItem("tabs")));
  });

  /* State */
  const tabs = ref([]);

  /* Actions */
  const openTab = (payload) => {
    const index = tabs.value.findIndex((tab) => {
      return tab.id === payload.id;
    });

    if (index > -1) return;

    tabs.value = [...tabs.value, payload];
    localStorage.setItem("tabs", JSON.stringify(tabs.value));
  };

  const closeTab = (payload) => {
    const index = tabs.value.findIndex((tab) => {
      return tab.id === payload.id;
    });

    tabs.value.splice(index, 1);
    localStorage.setItem("tabs", JSON.stringify(tabs.value));

    if (tabs.value.length < 1) navigateTo("/");
  };

  const setTabs = (payload) => {
    tabs.value = payload;
  };

  /* Getters */
  const TABS = computed(() => tabs.value);

  return {
    openTab,
    closeTab,
    TABS,
  };
});
