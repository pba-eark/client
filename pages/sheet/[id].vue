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

const epics = reactive([]);
const sheetElement = ref(null);

onBeforeMount(() => {
  window.addEventListener("click", handleClick);
});

onBeforeUnmount(() => {
  window.removeEventListener("click", handleClick);
});

onMounted(async () => {
  await epicStatusStore.getEpicStatus(authStore.API_TOKEN);

  epicStatusStore.EPIC_STATUS.forEach((element) => {
    if (element.default) {
      postData.epic.epicStatusId = element.id;
    }
  });

  await epicStore.getEpics(authStore.API_TOKEN, route.params.id);

  epicStore.EPICS.forEach((element) => {
    epics.push(element);
  });

  epics.forEach(async (element) => {
    await taskStore.getTasks(authStore.API_TOKEN, element.id);
  });
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
</script>

<template>
  <div ref="sheetElement" class="sheet">
    {{ $route.params.id }}

    <div>
      <Epic v-for="epic in epics" :key="epic.id" :data="epic" />

      <Button
        text="Click mig for fanden"
        @click="epicStore.createEpic(authStore.API_TOKEN, postData.epic)"
      />
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
