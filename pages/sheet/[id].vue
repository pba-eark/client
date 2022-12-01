<script setup>
import { useAuthStore } from "~/store/auth";
import { useEstimateSheetStore } from "~/store/estimateSheets";
import { useEpicStore } from "~/store/epics";
import { useEpicStatusStore } from "~/store/epicstatus";
import { useTaskStore } from "~/store/tasks";

import { useSaveStore } from "~/store/save";

import { useTabsStore } from "~/store/tabs";

const authStore = useAuthStore();
const sheetStore = useEstimateSheetStore();
const epicStore = useEpicStore();
const epicStatusStore = useEpicStatusStore();
const taskStore = useTaskStore();
const tabStore = useTabsStore();

const route = useRoute();

const saveStore = useSaveStore();

const epicObj = {
  epicName: "Episk navn",
  estimateSheetId: 1,
  epicStatusId: 1,
};

const taskObj = {
  parentId: 0,
  taskName: "Lav noget database",
  hourEstimate: 5.5,
  estimateReasoning: "En resonering",
  optOut: false,
  taskDescription: "En beskrivelse",
  epicId: 1,
  roleId: 1,
  riskProfileId: 1,
};

const postData = reactive({
  epic: {
    epicName: "Test epic",
    estimateSheetId: route.params.id,
    epicStatusId: null,
  },
});

const sheetElement = ref(null);

onBeforeMount(() => {
  window.addEventListener("click", handleClick);
});

onBeforeUnmount(() => {
  window.removeEventListener("click", handleClick);
});

const gemIstore = () => {
  saveStore.saveToObject("epic", epicObj);
  saveStore.saveToObject("task", taskObj);
};

const gemIDb = () => {
  saveStore.saveToDatabase();
};

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
    {{ $route.params.id }}

    <div>
      <Epic v-for="epic in sheetEpics" :key="epic.id" :data="epic" />
      <Button text="GEM I ARRAY" @click="gemIstore"></Button>
      <Button text="GEM I DB" @click="gemIDb"></Button>
      <Button
        text="Click mig for fanden"
        @click="epicStore.createEpic(authStore.API_TOKEN, postData.epic)"
      ></Button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sheet {
  height: calc(100vh - var(--header-height) - var(--tabs-height));
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
