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
    return tabStore.handleOpenTab(sheetStore.CURRENT_ESTIMATE_SHEET[0]);
  return;
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
    <div>
      <Epic v-for="epic in sheetEpics" :key="epic.id" :data="epic" />

      <Button
        text="Ny epic"
        @click="epicStore.createEpic($route.params.id)"
      ></Button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sheet {
  height: 100vh;
  overflow-y: scroll;

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
