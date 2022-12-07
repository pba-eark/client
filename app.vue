<script setup>
import { useGlobalStore } from "~/store/index";
import { useAuthStore } from "~/store/auth";
import { useJiraStore } from "~/store/jira";

const authStore = useAuthStore();
const jiraStore = useJiraStore();
const globalStore = useGlobalStore();

onMounted(async () => {
  /* Check if user is logged in */
  if (!authStore.IS_AUTHORIZED && localStorage.getItem("jwt"))
    authStore.setJwt(localStorage.getItem("jwt"));

  /* Check for jira jwt in localstorage */
  if (localStorage.getItem("jira") && !jiraStore.JIRA_API_TOKEN.length)
    await jiraStore.setJwt(localStorage.getItem("jira"));

  // if (authStore.IS_AUTHORIZED) await globalStore.fetchData();

  return globalStore.setLoaded(true);
});
</script>

<template>
  <div
    v-if="globalStore.IS_LOADED"
    :class="authStore.IS_AUTHORIZED ? 'layout' : 'loginLayout'"
  >
    <Tabs v-if="authStore.IS_AUTHORIZED" class="tab-section" />
    <Sidebar v-if="authStore.IS_AUTHORIZED" class="sidebar-left" />
    <div class="main">
      <LazyNuxtPage />
    </div>

    <Details class="sidebar-right" v-if="authStore.IS_AUTHORIZED" />
  </div>
</template>

<style lang="scss" scoped>
.layout {
  background-color: var(--color-background);
  position: relative;
  height: 100vh;
  overflow: hidden;
  display: grid;
  gap: 0 1px;
  grid-template-columns: 200px auto 350px;
  grid-template-rows: 60px auto;
  grid-template-areas:
    "sidebarLeft tab-section sidebarRight"
    "sidebarLeft main sidebarRight";
}

.tab-section {
  grid-area: tab-section;
}
.header {
  grid-area: header;
}
.sidebar-left {
  grid-area: sidebarLeft;
}
.main {
  grid-area: main;
  overflow-y: auto;
}
.sidebar-right {
  grid-area: sidebarRight;
}
</style>
