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
  unit: {
    type: String,
    required: false,
    default: "",
  },
});

const data = computed(() => {
  return { labels: props.labels, datasets: props.datasets };
});

const options = {
  responsive: true,
  maintainAspectRatio: false,
};

const roles = computed(() => {
  const roles = [];
  if (props.labels.length < 1 || props.datasets.length < 1) return;
  props.datasets[0].data.forEach((value, index) => {
    roles.push({
      name: props.labels[index],
      value,
      color: props.datasets[0].backgroundColor[index],
    });
  });

  return roles;
});

const numberDotSeperator = (x) => {
  if (!x) return "0,00";
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
</script>

<template>
  <div class="chart">
    <div>
      <Pie :data="data" :options="options" />
    </div>

    <ul class="chart__roles">
      <li v-for="role in roles">
        <b :style="{ color: role.color }">{{ role.name }}</b>
        <i>
          {{
            `${
              !isNaN(role.value)
                ? numberDotSeperator(role.value.toFixed(2).replace(".", ","))
                : "0,00"
            }
          ${unit.length ? unit : ""}`
          }}
        </i>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.chart {
  &__roles {
    li {
      display: flex;
      width: 100%;
      justify-content: space-between;
      gap: 5ch;
      margin: 0 auto .5rem auto;
    }
  }
}
</style>
