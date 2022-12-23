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
const route = useRoute();

onMounted(async () => {
  if (route.path.includes("/callback")) {
    await authStore.setJwt(localStorage.getItem("jwt"));
    userStore.setCurrentUser(JSON.parse(localStorage.getItem("user")));
    globalStore.setLoaded(true);
  }
  handleAuthorization();
  /* Check if user is logged in */
  if (!authStore.IS_AUTHORIZED && localStorage.getItem("jwt")) {
    await authStore.setJwt(localStorage.getItem("jwt"));
    userStore.setCurrentUser(JSON.parse(localStorage.getItem("user")));
  } else {
    globalStore.setLoaded(true);
  }

  /* Check for jira jwt in localstorage */
  if (localStorage.getItem("jira") && !jiraStore.JIRA_API_TOKEN.length) {
    await jiraStore.setJwt(localStorage.getItem("jira"));
  }
});

watch(
  () => authStore.IS_AUTHORIZED,
  () => {
    handleAuthorization();
  }
);

const handleAuthorization = async () => {
  if (authStore.IS_AUTHORIZED || route.fullPath.includes("/callback")) {
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
</script>

<template>
  <div v-if="globalStore.IS_LOADED || route.fullPath.includes('/callback')">
    <NuxtLayout :name="layout">
      <LazyNuxtPage />
    </NuxtLayout>
  </div>

  <LoadSpinner v-else />
</template>
