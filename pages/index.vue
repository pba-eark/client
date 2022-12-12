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

definePageMeta({
  middleware: ["auth"],
});

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
</script>

<template>
  <div class="block">
    <h1>Dashboard</h1>
    <div class="block__dashboard">
      <div>
        <h2>Estimeret af dig</h2>
        <ul>
          <li v-for="sheet in estimatedSheets">
            <NuxtLink :to="`/sheet/${sheet.id}`">
              {{ sheet.sheetName }}
            </NuxtLink>
          </li>
        </ul>
      </div>
      <div>
        <h2>Udført af dig</h2>
        <ul>
          <li v-for="sheet in doneSheets">
            <NuxtLink :to="`/sheet/${sheet.id}`">
              {{ sheet.sheetName }}
            </NuxtLink>
          </li>
        </ul>
      </div>
      <div>
        <h2>Sidste åbne ark</h2>
        <ul>
          <li v-for="sheet in recentlyOpen">
            <NuxtLink :to="`/sheet/${sheet.id}`">
              {{ sheet.sheetName }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.block {
  &__dashboard {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }
}
</style>
