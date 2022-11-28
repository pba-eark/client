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

  globalStore.setLoaded(true);
});
</script>

<template>
  <div
    v-if="globalStore.IS_LOADED"
    :class="authStore.IS_AUTHORIZED ? 'layout' : 'loginLayout'"
  >
    <Header v-if="authStore.IS_AUTHORIZED" class="header" />
    <Tabs v-if="authStore.IS_AUTHORIZED" class="tabs" />
    <Sidebar v-if="authStore.IS_AUTHORIZED" class="sidebar-left" />
    <div class="main">
      <LazyNuxtPage />
    </div>

    <div class="sidebar-right">right side bar</div>
  </div>
</template>

<style lang="scss" scoped>
.layout {
  display: grid;
  grid-template-columns: 200px auto 150px;
  grid-template-rows: auto minmax(auto, 50px);
  grid-template-areas:
    "header header header"
    "sidebarLeft tabs sidebarRight"
    "sidebarLeft main sidebarRight";
}

.tabs {
  grid-area: tabs;
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
