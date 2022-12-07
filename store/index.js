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

  const fetchData = async () => {
    await userStore.getUsers();
    await customerStore.getCustomers();
    await sheetStore.getEstimateSheets();
    await epicStatusStore.getEpicStatus();
    await epicStore.getEpics();
    await riskProfileStore.getRiskProfiles();
    await roleStore.getRoles();
    await taskStore.getTasks();
  };

  /* Actions */
  const setLoaded = (payload) => {
    isLoaded.value = payload;
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

  /* Getters */
  const IS_LOADED = computed(() => isLoaded.value);

  return {
    fetchData,
    setLoaded,
    scrollToEpic,
    IS_LOADED,
  };
});
