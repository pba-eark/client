import { defineStore } from "pinia";

export const useDetailsStore = defineStore("details-store", () => {
  /* State */
  const details = ref(null);
  const detailsChart = ref({
    labels: [],
    datasets: {},
  });

  /* Actions */
  const setDetails = (payload) => {
    details.value = payload;
  };

  const setDetailsChart = (payload) => {
    detailsChart.value = payload;
  };

  /* Getters */
  const DETAILS = computed(() => details.value);
  const DETAILS_CHART = computed(() => detailsChart.value);

  return {
    setDetails,
    setDetailsChart,
    DETAILS,
    DETAILS_CHART,
  };
});
