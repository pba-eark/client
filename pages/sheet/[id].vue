<script setup>
import { useAuthStore } from "~/store/auth";
import { useEstimateSheetStore } from "~/store/estimateSheets";
import { useEpicStore } from "~/store/epics";
import { useEpicStatusStore } from "~/store/epicstatus";
import { useTaskStore } from "~/store/tasks";
import { useTabsStore } from "~/store/tabs";

const authStore = useAuthStore();
const sheetStore = useEstimateSheetStore();
const epicStore = useEpicStore();
const epicStatusStore = useEpicStatusStore();
const taskStore = useTaskStore();
const tabStore = useTabsStore();

const route = useRoute();

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
  <div ref="sheetElement">
    {{ $route.params.id }}

    <div>
      <h1>Epics:</h1>
      <Epic v-for="epic in sheetEpics" :key="epic.id" :data="epic" />

      <Button
        text="Click mig for fanden"
        @click="epicStore.createEpic(authStore.API_TOKEN, postData.epic)"
      />

      <p v-for="status in epicStatusStore.EPIC_STATUS">{{ status }}</p>
      <div>
        <Task v-for="task in taskStore.TASK_STATUS">{{ task }}</Task>
      </div>
    </div>
  </div>
</template>
