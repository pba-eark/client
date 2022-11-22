<script>
import { useAuthStore } from "~/store/auth";

export default defineComponent({
  setup() {
    const store = useAuthStore();
    onMounted(() => {
      if (localStorage.getItem("jira"))
        store.setJiraAccessToken(localStorage.getItem("jira"));

      if (!store.IS_AUTHORIZED && localStorage.getItem("jwt"))
        store.setJwt(localStorage.getItem("jwt"));
    });

    return {
      store,
    };
  },
});
</script>

<template>
  <div :class="store.IS_AUTHORIZED ? 'layout' : 'loginLayout'">
    <Header v-if="store.IS_AUTHORIZED" class="header" />
    <Sidebar v-if="store.IS_AUTHORIZED" class="sidebar-left" />
    <div class="main">
      <LazyNuxtPage />
    </div>
    <Sidebar v-if="store.IS_AUTHORIZED" class="sidebar-right" />
  </div>
</template>

<style lang="scss" scoped>
.layout {
  display: grid;
  grid-template-areas:
    "header header header header header header"
    "sidebarLeft main main main main sidebarRight";
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
