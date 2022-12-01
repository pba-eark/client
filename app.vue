<script setup>
import { useGlobalStore } from "~/store/index";
import { useAuthStore } from "~/store/auth";
import { useJiraStore } from "~/store/jira";

const authStore = useAuthStore();
const jiraStore = useJiraStore();
const globalStore = useGlobalStore();

onBeforeMount(async () => {
  /* Check if user is logged in */
  if (!authStore.IS_AUTHORIZED && localStorage.getItem("jwt"))
    authStore.setJwt(localStorage.getItem("jwt"));

  /* Check for jira jwt in localstorage */
  if (localStorage.getItem("jira") && !jiraStore.JIRA_API_TOKEN.length)
    await jiraStore.setJwt(localStorage.getItem("jira"));

  await globalStore.fetchData(authStore.API_TOKEN);
});
</script>

<template>
  <div
    v-if="globalStore.IS_LOADED"
    :class="authStore.IS_AUTHORIZED ? 'layout' : 'loginLayout'"
  >
    <Header v-if="authStore.IS_AUTHORIZED" class="header" />
    <Tabs v-if="authStore.IS_AUTHORIZED" class="tab-section" />
    <Sidebar v-if="authStore.IS_AUTHORIZED" class="sidebar-left" />
    <div class="main">
      <LazyNuxtPage />
    </div>

    <Details class="sidebar-right" />
  </div>
</template>

<style lang="scss" scoped>
.layout {
  display: grid;
  gap: 0 5px;
  grid-template-columns: 200px auto 300px;
  grid-template-rows: var(--header-height) var(--tabs-height) auto;
  grid-template-areas:
    "header header header"
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
}
.sidebar-right {
  grid-area: sidebarRight;
}
</style>
