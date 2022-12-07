<script setup>
import { useEstimateSheetStore } from "~/store/estimateSheets";
import { useEpicStore } from "~/store/epics";
import { useTabsStore } from "~/store/tabs";

const sheetStore = useEstimateSheetStore();
const epicStore = useEpicStore();
const tabStore = useTabsStore();
const route = useRoute();
const sheetElement = ref(null);

definePageMeta({
  middleware: ["auth"],
});

onBeforeMount(() => {
  window.addEventListener("click", handleClick);
});

onMounted(() => {
  /* If page is reloaded while being on a temporary tab, remake the temporary tab */
  if (
    tabStore.TABS.filter((tab) => tab.id == route.params.id).length < 1 &&
    tabStore.TEMP_TAB === null
  ) {
    tabStore.handleOpenTab(
      sheetStore.ESTIMATE_SHEETS.filter(
        (sheet) => sheet.id == route.params.id
      )[0]
    );
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("click", handleClick);
});

/* Add sheet to tabs if clicked within */
const handleClick = (e) => {
  if (
    e.target === sheetElement.value ||
    getParents(e.target).includes(sheetElement.value) ||
    Array.from(e.target.children).includes(sheetElement.value)
  )
    return tabStore.openTab(sheetStore.CURRENT_ESTIMATE_SHEET[0]);
  return;
};

const handleCreateEpic = () => {
  const route = useRoute();

  const newEpic = {
    epicName: "Ny Epic",
    estimateSheetId: parseInt(route.params.id),
    epicStatusId: 1,
  };

  epicStore.createEpic(newEpic);
};

const getParents = (node) => {
  let current = node,
    list = [];
  while (
    current.parentNode != null &&
    current.parentNode != document.documentElement
  ) {
    list.push(current.parentNode);
    current = current.parentNode;
  }
  return list;
};

const sheetEpics = computed(() => {
  return epicStore.EPICS.filter((epic) => {
    return epic.estimateSheetId == route.params.id;
  });
});
</script>

<template>
  <div ref="sheetElement" class="sheet">
    <div v-show="sheetStore.IS_OVERVIEW_TOGGLED">
      <h1>overview</h1>
    </div>

    <div v-show="!sheetStore.IS_OVERVIEW_TOGGLED">
      <Epic v-for="epic in sheetEpics" :key="epic.id" :data="epic" />
      <Button text="Ny epic" @click="handleCreateEpic"></Button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sheet {
  height: calc(100vh - 50px);

  &::-webkit-scrollbar-track {
    background-color: black;
  }
  &::-webkit-scrollbar-thumb {
    background-color: gray;
  }

  &::-webkit-scrollbar {
    width: 10px;
  }
}
</style>
