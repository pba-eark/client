<script setup>
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "vue-chartjs";

ChartJS.register(ArcElement, Tooltip, Legend);

defineProps({
  data: {
    type: Object,
  },
});

const data = {
  labels: ["VueJs", "EmberJs", "ReactJs", "AngularJs"],
  datasets: [
    {
      backgroundColor: ["#41B883", "#E46651", "#00D8FF", "#DD1B16"],
      data: [40, 20, 80, 10],
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
};
</script>

<template>
  <Pie :data="data" :options="options" />
</template>
