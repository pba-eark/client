<script setup>
import { useAuthStore } from "~/store/auth";
import { useJiraStore } from "~/store/jira";
import { useCustomerStore } from "~/store/customer";

const authStore = useAuthStore();
const jiraStore = useJiraStore();
const customerStore = useCustomerStore();

onMounted(() => {
  /* Check if user is logged in */
  if (!authStore.IS_AUTHORIZED && localStorage.getItem("jwt"))
    authStore.setJwt(localStorage.getItem("jwt"));

  /* Check for jira jwt in localstorage */
  if (localStorage.getItem("jira"))
    jiraStore.setJwt(localStorage.getItem("jira"));

  /* Get and set customers in store */
  customerStore.getCustomers();
});
</script>

<template>
  <div :class="authStore.IS_AUTHORIZED ? 'layout' : 'loginLayout'">
    <Header v-if="authStore.IS_AUTHORIZED" class="header" />
    <Sidebar v-if="authStore.IS_AUTHORIZED" class="sidebar-left" />
    <div class="main">
      <LazyNuxtPage />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout {
  display: grid;
  grid-template-columns: 200px auto 150px;
  grid-template-areas:
    "header header header"
    "sidebarLeft main sidebarRight";
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
