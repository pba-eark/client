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
  <div>
    <Header />
    <LazyNuxtPage />
  </div>
</template>
