<script>
import { useAuthStore } from "~/store/auth";

export default defineComponent({
  setup() {
    onMounted(() => {
      const store = useAuthStore();

      if (localStorage.getItem("jira"))
        store.setJiraAccessToken(localStorage.getItem("jira"));

      if (!store.IS_AUTHORIZED && localStorage.getItem("jwt"))
        store.setJwt(localStorage.getItem("jwt"));
    });
  },
});
</script>

<template>
  <div class="layout">
    <Header class="header" />
    <Sidebar class="sidebar-left" />
    <LazyNuxtPage class="main" />
  </div>
</template>

<style lang="scss" scoped>
.layout {
  display: grid;
  grid-template-areas:
    "header header header header header header"
    "sidebar-left main main main main sidebar-right"
    "footer footer footer footer footer footer";
}

.header {
  grid-area: header;
}
.sidebar-left {
  grid-area: sidebar-left;
}
.main {
  grid-area: main;
}
</style>
