<script setup>
import { useEstimateSheetStore } from "~/store/estimateSheets";
import { useEpicStore } from "~/store/epics";
import { useTabsStore } from "~/store/tabs";
import { useTaskStore } from "~/store/tasks";
import { useEpicStatusStore } from "~/store/epicStatus";

const sheetStore = useEstimateSheetStore();
const epicStore = useEpicStore();
const tabStore = useTabsStore();
const taskStore = useTaskStore();
const epicStatusStore = useEpicStatusStore();
const route = useRoute();
const sheetElement = ref(null);
const { $swal } = useNuxtApp();

onBeforeMount(() => {
  window.addEventListener("click", handleClick);
});

onMounted(() => {
  if (sheetStore.IS_OVERVIEW_TOGGLED) sheetStore.setToggleSheetOverview(false);

  /* Save 5 most recently open sheets */
  let recentSheets =
    JSON.parse(window.localStorage.getItem("recentSheets")) ?? [];
  const currentSheet = sheetStore.ESTIMATE_SHEETS.filter((s) => {
    if (s.id == route.params.id) return s;
  })[0];

  if (!recentSheets.some((s) => s.id === currentSheet.id)) {
    recentSheets = [currentSheet, ...recentSheets];
    if (recentSheets.length > 5) recentSheets.pop();
    window.localStorage.setItem("recentSheets", JSON.stringify(recentSheets));
  }
});

/* If page is reloaded while being on a temporary tab, remake the temporary tab */
if (
  tabStore.TABS.filter((tab) => tab.id == route.params.id).length < 1 &&
  tabStore.TEMP_TAB === null
) {
  tabStore.handleOpenTab(
    sheetStore.ESTIMATE_SHEETS.filter((sheet) => sheet.id == route.params.id)[0]
  );
}

if (
  tabStore.TABS.filter((tab) => tab.id == route.params.id).length < 1 &&
  tabStore.TEMP_TAB?.id !== parseInt(route.params.id)
) {
  tabStore.handleOpenTab(
    sheetStore.ESTIMATE_SHEETS.filter((sheet) => sheet.id == route.params.id)[0]
  );
}

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
  ) {
    return tabStore.openTab(sheetStore.CURRENT_ESTIMATE_SHEET);
  }
  return;
};

const handleCreateEpic = async () => {
  const firstDefaultEpicStatus = epicStatusStore.EPIC_STATUS.filter(
    (status) => {
      return status.default;
    }
  )[0];

  if (!firstDefaultEpicStatus)
    return $swal.fire(
      "Der skete en fejl.",
      "Der findes endnu ingen epic status. Opret en epic status og prøv igen.",
      "warning"
    );

  const obj = {
    epicName: "Ny Epic",
    estimateSheetId: parseInt(route.params.id),
    epicStatusId: firstDefaultEpicStatus.id,
  };

  const newEpic = await epicStore.createEpic(obj);

  if (!newEpic)
    return $swal.fire(
      "Ups! Der skete en fejl.",
      "Epic blev ikke oprettet.",
      "error"
    );

  const firstGlobalRiskProfile = riskProfileStore.RISK_PROFILES.filter(
    (profile) => {
      return profile;
    }
  )[0];

  if (!firstGlobalRiskProfile)
    return $swal.fire(
      "Der skete en fejl.",
      "Der findes endnu ingen globale risikoprofiler. Opret en global risikoprofil og prøv igen.",
      "warning"
    );

  const newTask = {
    parentId: 0,
    taskName: "Ny task",
    hourEstimate: 0,
    estimateReasoning: "Begrundelse for estimat...",
    optOut: false,
    taskDescription: "Beskrivelse...",
    epicId: newEpic.id,
    roleId: 0,
    riskProfileId: firstGlobalRiskProfile.id,
  };

  await taskStore.createTask(newTask);
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
    <Epic v-for="epic in sheetEpics" :key="epic.id" :data="epic" />
    <div class="button-placement">
      <Button
        class="new-epic"
        text="Tilføj epic"
        icon="icon-plus"
        @click="handleCreateEpic"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sheet {
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
.button-placement {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  position: relative;
  padding-bottom: 50px;
}
.new-epic {
  position: absolute;
  top: -22px;
  z-index: 99;
}
</style>
