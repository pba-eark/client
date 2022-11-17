<script>
import { useAuthStore } from "~/store/auth";
export default defineComponent({
  setup() {
    const route = useRoute();
    const store = useAuthStore();
    onBeforeMount(() => {
      console.log(route.query.token);
      if (route.query?.token) store.setJiraAccessToken(route.query.token);
      return navigateTo("/");
    });
  },
});
</script>

<template></template>
