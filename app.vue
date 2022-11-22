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
