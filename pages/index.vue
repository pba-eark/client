<script setup>
import { useUserStore } from "~/store/users";
import { useEstimateSheetStore } from "~/store/estimateSheets";
import { useEstimateSheetUserStore } from "~/store/composites/estimateSheetUsers";

const userStore = useUserStore();
const sheetStore = useEstimateSheetStore();
const sheetUserStore = useEstimateSheetUserStore();

const estimations = ref([]);
const responsibilities = ref([]);
const recentlyOpen = ref([]);

onMounted(() => {
  /* Get sheets estimated & done by current user */
  sheetUserStore.ESTIMATE_SHEET_USERS.forEach((connection) => {
    if (connection.userId == userStore.CURRENT_USER.id) {
      if (connection.type === "estimate")
        estimations.value = [...estimations.value, connection];
      if (connection.type === "done")
        responsibilities.value = [...responsibilities.value, connection];
    }
  });

  if (process.client && localStorage.getItem("recentSheets")) {
    recentlyOpen.value = JSON.parse(localStorage.getItem("recentSheets"));
  }
});

const estimatedSheets = computed(() => {
  return estimations.value.map((connection) => {
    return sheetStore.ESTIMATE_SHEETS.filter((sheet) => {
      return sheet.id == connection.estimateSheetId;
    })[0];
  });
});

const doneSheets = computed(() => {
  return responsibilities.value.map((connection) => {
    return sheetStore.ESTIMATE_SHEETS.filter((sheet) => {
      return sheet.id == connection.estimateSheetId;
    })[0];
  });
});

const runtimeConfig = useRuntimeConfig();
</script>

<template>
  <div class="block">
    <h1>Dashboard</h1>
    <p>{{ runtimeConfig.public.API_URL }}</p>
    <div class="block__dashboard">
      <div class="dashboard__item">
        <h2>Mine estimat ark</h2>
        <ul>
          <li v-for="sheet in estimatedSheets">
            <NuxtLink :to="`/sheet/${sheet.id}`">
              {{ sheet.sheetName }}
            </NuxtLink>
          </li>
        </ul>
      </div>
      <div class="dashboard__item">
        <h2>Mine udførte estimater</h2>
        <ul>
          <li v-for="sheet in doneSheets">
            <NuxtLink :to="`/sheet/${sheet.id}`">
              {{ sheet.sheetName }}
            </NuxtLink>
          </li>
        </ul>
      </div>
      <div class="dashboard__item">
        <h2>Senest åbne estimater</h2>
        <ul>
          <li v-for="sheet in recentlyOpen">
            <NuxtLink :to="`/sheet/${sheet.id}`">
              {{ sheet.sheetName }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>

    <!-- <div class="block__charts">
      <div class="block__charts--customers">
        <h1>Kunder</h1>
        <NuxtLink to="/">Redigér kunder</NuxtLink>
        <div class="chart">
          <PieChart />
        </div>
      </div>
    </div> -->
  </div>
</template>

<style lang="scss" scoped>
.block {
  padding: 24px;
  border-radius: 3px;
  background: #fff;
  &__dashboard {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 2rem;
  }

  &__charts {
    margin: 2rem 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
}

.dashboard {
  &__item {
    margin-top: 15px;

    h2 {
      margin-bottom: 5px;
    }

    ul {
      li {
        margin: 5px 0;
      }
    }
  }
}
</style>
