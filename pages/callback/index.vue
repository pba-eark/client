<script>
import { useJiraStore } from "~/store/jira";
export default defineComponent({
  setup() {
    const route = useRoute();
    const jiraStore = useJiraStore();
    onBeforeMount(() => {
      console.log(route.query.token);
      if (route.query?.token) jiraStore.setJwt(route.query.token);

      if (process.client && localStorage.getItem("lastPath").length > 0) {
        return navigateTo(`${localStorage.getItem("lastPath")}`);
      }

      return navigateTo("/");
    });
  },
});
</script>

<template></template>
