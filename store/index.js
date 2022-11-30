import { defineStore } from "pinia";
import { useCustomerStore } from "./customers";
import { useEpicStore } from "./epics";
import { useEpicStatusStore } from "./epicstatus";
import { useEstimateSheetStore } from "./estimateSheets";
import { useRiskProfileStore } from "./riskProfiles";
import { useRoleStore } from "./roles";
import { useTaskStore } from "./tasks";
import { useUserStore } from "./users";

export const useGlobalStore = defineStore("global-store", () => {
  const customerStore = useCustomerStore();
  const epicStore = useEpicStore();
  const epicStatusStore = useEpicStatusStore();
  const sheetStore = useEstimateSheetStore();
  const riskProfileStore = useRiskProfileStore();
  const roleStore = useRoleStore();
  const taskStore = useTaskStore();
  const userStore = useUserStore();

  /* State */
  const isLoaded = ref(false);

  const fetchData = async (token) => {
    await userStore.getUsers(token);
    await customerStore.getCustomers(token);
    await sheetStore.getEstimateSheets(token);
    await epicStatusStore.getEpicStatus(token);
    await epicStore.getEpics(token);
    await riskProfileStore.getRiskProfiles(token);
    // await roleStore.getRoles(token);
    await taskStore.getTasks(token);

    setLoaded(true);
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
