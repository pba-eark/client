<script setup>
import { useJiraStore } from "~/store/jira";
// definePageMeta({
//   middleware: ["jira"],
// });
const route = useRoute();
const jiraStore = useJiraStore();
onMounted(async () => {
  if (route.query?.token) jiraStore.setJwt(route.query.token);

  if (process.client && localStorage.getItem("lastPath").length > 0) {
    return await navigateTo(`${localStorage.getItem("lastPath")}`);
  }

  return await navigateTo("/");
});
</script>

<template>
  <div></div>
</template>
