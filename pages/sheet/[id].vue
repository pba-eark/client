<script setup>
import { useGlobalStore } from "~/store/";
import { useEstimateSheetStore } from "~/store/estimateSheets";
import { useEpicStore } from "~/store/epics";
import { useTabsStore } from "~/store/tabs";
import { useTaskStore } from "~/store/tasks";

const globalStore = useGlobalStore();
const sheetStore = useEstimateSheetStore();
const epicStore = useEpicStore();
const tabStore = useTabsStore();
const taskStore = useTaskStore();
const route = useRoute();
const sheetElement = ref(null);

definePageMeta({
  middleware: ["auth"],
});

onBeforeMount(() => {
  window.addEventListener("click", handleClick);
});

onMounted(() => {
  /* Save 5 most recently open sheets */
  let recentSheets =
    JSON.parse(window.localStorage.getItem("recentSheets")) ?? [];
  const currentSheet = sheetStore.ESTIMATE_SHEETS.filter((s) => {
    if (s.id == route.params.id) return s;
  })[0];

  if (!recentSheets.some((s) => s.id === currentSheet.id)) {
    console.log("Adding recent sheet", currentSheet);
    recentSheets = [currentSheet, ...recentSheets];
    if (recentSheets.length > 5) recentSheets.pop();
    window.localStorage.setItem("recentSheets", JSON.stringify(recentSheets));
  }

  if (
    tabStore.TABS.filter((tab) => tab.id == route.params.id).length < 1 &&
    tabStore.TEMP_TAB === null
  ) {
    /* If page is reloaded while being on a temporary tab, remake the temporary tab */
    tabStore.handleOpenTab(
      sheetStore.ESTIMATE_SHEETS.filter(
        (sheet) => sheet.id == route.params.id
      )[0]
    );
  }
});

onBeforeUnmount(() => {
  /* Clean up eventlistener */
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

const handleCreateEpic = async () => {
  const obj = {
    epicName: "Ny Epic",
    estimateSheetId: parseInt(route.params.id),
    epicStatusId: 1,
  };

  const newEpic = await epicStore.createEpic(obj);

  if (!newEpic) return alert("An error occured while creating the epic!");

  const newTask = {
    parentId: 0,
    taskName: "Ny task",
    hourEstimate: 0,
    estimateReasoning: "Begrundelse for estimat...",
    optOut: false,
    taskDescription: "Beskrivelse...",
    epicId: newEpic.id,
    roleId: 0,
    riskProfileId: 1,
  };

  await taskStore.createTask(newTask);
};

const handlePasteEpic = async () => {
  const epic = { ...globalStore.EPIC_CLIPBOARD };
  const tasks = [];

  for (let i = 0; taskStore.TASKS.length > i; i++) {
    if (taskStore.TASKS[i].epicId == epic.id) {
      tasks.push({ ...taskStore.TASKS[i] });
    }
  }

  delete epic.id;
  epic.estimateSheetId = parseInt(route.params.id);
  const newEpic = await epicStore.createEpic(epic);

  tasks.forEach(async (task) => {
    delete task.id;
    task.epicId = newEpic.id;
    await taskStore.createTask(task);
  });
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
      <Button text="Paste epic" @click="handlePasteEpic" />
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
