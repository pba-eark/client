<script setup>
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "vue-chartjs";

ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps({
  labels: {
    type: Array,
    required: false,
    default: ["VueJs", "EmberJs", "ReactJs", "AngularJs"],
  },
  datasets: {
    type: Array,
    required: false,
    default: [
      {
        backgroundColor: ["#41B883", "#E46651", "#00D8FF", "#DD1B16"],
        data: [40, 20, 80, 10],
      },
    ],
  },
});

const data = computed(() => {
  return { labels: props.labels, datasets: props.datasets };
});

const options = {
  responsive: true,
  maintainAspectRatio: false,
};
</script>

<template>
  <div>
    {{ labels }}
    <br />
    {{ datasets }}
    <div>
      <Pie :data="data" :options="options" />
    </div>
  </div>
</template>
