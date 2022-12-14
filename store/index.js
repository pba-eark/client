import { defineStore } from "pinia";
import { useCustomerStore } from "./customers";
import { useEpicStore } from "./epics";
import { useEpicStatusStore } from "./epicStatus";
import { useEstimateSheetStore } from "./estimateSheets";
import { useRiskProfileStore } from "./riskProfiles";
import { useRoleStore } from "./roles";
import { useTaskStore } from "./tasks";
import { useUserStore } from "./users";
<<<<<<< HEAD
import { useEstimateSheetRiskProfileStore } from "./composites/estimateSheetRiskProfiles";
<<<<<<< HEAD
import { useEstimateSheetUserStore } from "./composites/estimateSheetUsers";
import { useSheetStatusStore } from "./sheetStatus";
=======
>>>>>>> abf643b (Delete and Create functions for)
=======
import { useEstimateSheetRiskProfileStore } from "~/store/composites/estimateSheetRiskProfiles";
import { useEstimateSheetUserStore } from "~/store/composites/estimateSheetUsers";
import { useEstimateSheetRoleStore } from "./composites/estimateSheetRoles";
>>>>>>> ddeb690 (DELETE & UPDATE functions)

export const useGlobalStore = defineStore("global-store", () => {
  const customerStore = useCustomerStore();
  const epicStore = useEpicStore();
  const epicStatusStore = useEpicStatusStore();
  const sheetStore = useEstimateSheetStore();
  const riskProfileStore = useRiskProfileStore();
  const roleStore = useRoleStore();
  const taskStore = useTaskStore();
  const userStore = useUserStore();
<<<<<<< HEAD
  const sheetRiskProfileStore = useEstimateSheetRiskProfileStore();
  const sheetUserStore = useEstimateSheetUserStore();
<<<<<<< HEAD
  const sheetStatusStore = useSheetStatusStore();
=======
  const estimateSheetRiskProfileStore = useEstimateSheetRiskProfileStore();
>>>>>>> abf643b (Delete and Create functions for)
=======
  const sheetRoleStore = useEstimateSheetRoleStore();
>>>>>>> ddeb690 (DELETE & UPDATE functions)

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
<<<<<<< HEAD
    await sheetRiskProfileStore.getEstimateSheetRiskProfiles();
    await sheetUserStore.getEstimateSheetUsers();
<<<<<<< HEAD
    await sheetStatusStore.getSheetStatus();
    return setLoaded(true);
=======
    await estimateSheetRiskProfileStore.getEstimateSheetRiskProfiles();
>>>>>>> abf643b (Delete and Create functions for)
=======
    await sheetRoleStore.getEstimateSheetRoles();
>>>>>>> ddeb690 (DELETE & UPDATE functions)
  };

  const scrollToEpic = async (sheetId, epicId) => {
    if (sheetStore.IS_OVERVIEW_TOGGLED)
      await sheetStore.toggleSheetOverview(sheetId);
    const element = document.querySelector(`[data-epic-id="${epicId}"]`);
    const topPos = element.offsetTop;
    document.querySelector("main").scrollTop = topPos - 60;
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
