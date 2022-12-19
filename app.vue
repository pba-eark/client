<script setup>
import { useGlobalStore } from "~/store/index";
import { useUserStore } from "~/store/users";
import { useAuthStore } from "~/store/auth";
import { useJiraStore } from "~/store/jira";

const layout = ref("login");
const authStore = useAuthStore();
const userStore = useUserStore();
const jiraStore = useJiraStore();
const globalStore = useGlobalStore();

onMounted(async () => {
  handleAuthorization();
  /* Check if user is logged in */
  if (!authStore.IS_AUTHORIZED && localStorage.getItem("jwt")) {
    await authStore.setJwt(localStorage.getItem("jwt"));
    userStore.setCurrentUser(JSON.parse(localStorage.getItem("user")));
  } else {
    globalStore.setLoaded(true);
  }

  /* Check if user is logged in */
  if (!authStore.IS_AUTHORIZED && localStorage.getItem("user"))
    if (localStorage.getItem("jira") && !jiraStore.JIRA_API_TOKEN.length)
      /* Check for jira jwt in localstorage */
      await jiraStore.setJwt(localStorage.getItem("jira"));
});

watch(
  () => authStore.IS_AUTHORIZED,
  () => {
    handleAuthorization();
  }
);

const handleAuthorization = async () => {
  if (authStore.IS_AUTHORIZED) {
    layout.value = "default";
    await navigateTo(localStorage.getItem("lastPath") ?? "/");
  } else {
    layout.value = "login";
    await navigateTo("/login");
  }
};

/*
 ** Temporary fix for known bug: https://github.com/nuxt/framework/issues/3141
 ** Occurs when navigating during page transition and prevents the page content from loading.
 ** "Fix": Page reloads automatically when error occurs.
 */
if (process.client) {
  window.onerror = function (e) {
    if (e.includes("NotFoundError:")) {
      document.location.reload();
      return true;
    }
  };
}

const runtimeConfig = useRuntimeConfig();
console.log("API", runtimeConfig.public.API_URL);
</script>

<template>
  <div v-if="globalStore.IS_LOADED">
    <NuxtLayout :name="layout">
      <LazyNuxtPage />
    </NuxtLayout>
  </div>
</template>
