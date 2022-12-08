import { defineStore } from "pinia";
import { useCustomerStore } from "./customers";
import { useEpicStore } from "./epics";
import { useEpicStatusStore } from "./epicstatus";
import { useEstimateSheetStore } from "./estimateSheets";
import { useRiskProfileStore } from "./riskProfiles";
import { useRoleStore } from "./roles";
import { useTaskStore } from "./tasks";
import { useUserStore } from "./users";
import { useSheetStatusStore } from "./sheetStatus"
import { useEstimateSheetRiskProfileStore } from "./composites/estimateSheetRiskProfiles";

export const useGlobalStore = defineStore("global-store", () => {
  const customerStore = useCustomerStore();
  const epicStore = useEpicStore();
  const epicStatusStore = useEpicStatusStore();
  const sheetStore = useEstimateSheetStore();
  const riskProfileStore = useRiskProfileStore();
  const roleStore = useRoleStore();
  const taskStore = useTaskStore();
  const userStore = useUserStore();
  const sheetStatusStore = useSheetStatusStore();
  const estimateSheetRiskProfileStore = useEstimateSheetRiskProfileStore();

  /* State */
  const isLoaded = ref(false);

  const fetchData = async () => {
    await userStore.getUsers();
    await customerStore.getCustomers();
    await sheetStore.getEstimateSheets();
    await epicStatusStore.getEpicStatus();
    await epicStore.getEpics();
    await riskProfileStore.getRiskProfiles();
    await roleStore.getRoles();
    await taskStore.getTasks();
    await sheetStatusStore.getSheetStatus();
    await estimateSheetRiskProfileStore.getEstimateSheetRiskProfiles();
  };

  /* Actions */
  const setLoaded = (payload) => {
    isLoaded.value = payload;
  };

  /* Getters */
  const IS_LOADED = computed(() => isLoaded.value);

  return {
    fetchData,
    setLoaded,
    IS_LOADED,
  };
});
