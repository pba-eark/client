import { defineStore } from "pinia";
import { useCustomerStore } from "./customers";
import { useEpicStore } from "./epics";
import { useEpicStatusStore } from "./epicStatus";
import { useEstimateSheetStore } from "./estimateSheets";
import { useRiskProfileStore } from "./riskProfiles";
import { useRoleStore } from "./roles";
import { useTaskStore } from "./tasks";
import { useUserStore } from "./users";
import { useEstimateSheetUserStore } from "./composites/estimateSheetUsers";
import { useSheetStatusStore } from "./sheetStatus";
import { useEstimateSheetRiskProfileStore } from "~/store/composites/estimateSheetRiskProfiles";
import { useEstimateSheetRoleStore } from "./composites/estimateSheetRoles";

export const useGlobalStore = defineStore("global-store", () => {
  const customerStore = useCustomerStore();
  const epicStore = useEpicStore();
  const epicStatusStore = useEpicStatusStore();
  const sheetStore = useEstimateSheetStore();
  const riskProfileStore = useRiskProfileStore();
  const roleStore = useRoleStore();
  const taskStore = useTaskStore();
  const userStore = useUserStore();
  const sheetRiskProfileStore = useEstimateSheetRiskProfileStore();
  const sheetUserStore = useEstimateSheetUserStore();
  const sheetStatusStore = useSheetStatusStore();
  const sheetRoleStore = useEstimateSheetRoleStore();

  /* State */
  const isLoaded = ref(false);
  const epicClipboard = ref(null);
  const taskClipboard = ref(null);

  /* Actions */
  const setLoaded = (payload) => {
    isLoaded.value = payload;
  };

  const fetchData = async () => {
    await userStore.getUsers();
    await customerStore.getCustomers();
    await sheetStore.getEstimateSheets();
    await epicStatusStore.getEpicStatus();
    await epicStore.getEpics();
    await riskProfileStore.getRiskProfiles();
    await roleStore.getRoles();
    await taskStore.getTasks();
    await sheetRiskProfileStore.getEstimateSheetRiskProfiles();
    await sheetUserStore.getEstimateSheetUsers();
    await sheetStatusStore.getSheetStatus();
    await sheetRoleStore.getEstimateSheetRoles();
    return setLoaded(true);
  };

  const scrollToEpic = async (sheetId, epicId) => {
    if (sheetStore.IS_OVERVIEW_TOGGLED)
      await sheetStore.toggleSheetOverview(sheetId);

    const element = document.querySelector(`[data-epic-id="${epicId}"]`);
    if (!element) {
      let attempts = 0;
      const scroll = () => {
        attempts++;
        const element = document.querySelector(`[data-epic-id="${epicId}"]`);
        const topPos = element.offsetTop;
        document.querySelector("main").scrollTop = topPos - 60;

        if (element || attempts >= 5) return clearInterval(scrollInterval);
      };
      const scrollInterval = setInterval(scroll, 500);
    } else {
      const topPos = element.offsetTop;
      document.querySelector("main").scrollTop = topPos - 60;
    }
  };

  const copyEpic = (payload) => {
    epicClipboard.value = payload;
  };

  const copyTask = (payload) => {
    taskClipboard.value = payload;
  };

  /* Getters */
  const IS_LOADED = computed(() => isLoaded.value);
  const EPIC_CLIPBOARD = computed(() => epicClipboard.value);
  const TASK_CLIPBOARD = computed(() => taskClipboard.value);

  return {
    fetchData,
    setLoaded,
    scrollToEpic,
    copyEpic,
    copyTask,
    IS_LOADED,
    EPIC_CLIPBOARD,
    TASK_CLIPBOARD,
  };
});
