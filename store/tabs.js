import { defineStore } from "pinia";

export const useTabsStore = defineStore("tabs-store", () => {
  const route = useRoute();

  onMounted(() => {
    if (localStorage.getItem("tabs"))
      setTabs(JSON.parse(localStorage.getItem("tabs")));
  });

  /* State */
  const tabs = ref([]);
  const temporaryTab = ref(null);

  /* Actions */

  const handleOpenTab = (payload, force = false) => {
    const index = tabs.value.findIndex((tab) => {
      return tab.id === payload.id;
    });

    if (index > -1) return;

    if (temporaryTab.value?.id === payload.id) return openTab(payload);
    openTempTab(payload);
  };

  const openTab = (payload) => {
    if (payload.id === temporaryTab.value?.id) temporaryTab.value = null;

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

    /* If last tab is closed and no temporary tab exists, navigate to dashboard */
    if (tabs.value.length < 1 && temporaryTab.value === null)
      return navigateTo("/");

    /* If last tab is closed, navigate to temporary tab */
    if (tabs.value.length < 1)
      return navigateTo(`/sheet/${temporaryTab.value.id}`);

    /* If you close the tab you are currently on, navigate to last open tab */
    if (route.params.id == payload.id)
      return navigateTo(`/sheet/${tabs.value[tabs.value.length - 1].id}`);
  };

  const setTabs = (payload) => {
    tabs.value = payload;
  };

  const openTempTab = (payload) => {
    temporaryTab.value = payload;
  };

  const closeTempTab = () => {
    if (route.params.id == temporaryTab.value.id && tabs.value.length < 1) {
      temporaryTab.value = null;
      return navigateTo("/");
    }

    if (route.params.id == temporaryTab.value.id) {
      temporaryTab.value = null;
      return navigateTo(`/sheet/${tabs.value[tabs.value.length - 1].id}`);
    }

    return (temporaryTab.value = null);
  };

  /* Getters */
  const TABS = computed(() => tabs.value);
  const TEMP_TAB = computed(() => temporaryTab.value);

  return {
    handleOpenTab,
    openTab,
    closeTab,
    closeTempTab,
    TABS,
    TEMP_TAB,
  };
});
