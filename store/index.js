import { defineStore } from "pinia";
import { useCustomerStore } from "./customers";
import { useEpicStore } from "./epics";
import { useEpicStatusStore } from "./epicStatus";
import { useEstimateSheetStore } from "./estimateSheets";
import { useRiskProfileStore } from "./riskProfiles";
import { useRoleStore } from "./roles";
import { useTaskStore } from "./tasks";
import { useUserStore } from "./users";
import { useEstimateSheetRiskProfileStore } from "~/store/composites/estimateSheetRiskProfiles";
import { useEstimateSheetUserStore } from "~/store/composites/estimateSheetUsers";

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
  };

  const scrollToEpic = ({ id }) => {
    if (sheetStore.IS_OVERVIEW_TOGGLED) {
      sheetStore.toggleSheetOverview();
      setTimeout(() => {
        const element = document.querySelector(`[data-epic-id="${id}"]`);
        const topPos = element.offsetTop;
        document.querySelector("main").scrollTop = topPos - 50;
      }, 100);
    } else {
      const element = document.querySelector(`[data-epic-id="${id}"]`);
      const topPos = element.offsetTop;
      document.querySelector("main").scrollTop = topPos - 50;
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