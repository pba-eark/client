<script>
import { useAuthStore } from "~/store/auth";

export default defineComponent({
  setup() {
    const store = useAuthStore();

    return {
      store,
    };
  },
});
</script>

<template>
  <header>
    <h1>Oxygen</h1>
    <nav>
      <NuxtLink to="/">Home</NuxtLink>
      <NuxtLink v-if="!store.IS_AUTHORIZED" to="/login">Login</NuxtLink>
      <Button v-else text="Log out" @click="store.handleLogOut" />
    </nav>
  </header>

  <!-- <span>authorized: {{ store.IS_AUTHORIZED }}</span>
      <p>jira token: {{ store.JIRA_ACCESS_TOKEN }}</p>

      <button @click="store.authRequest">auth test</button>

      <button @click="store.getCloudIds">test</button>
      <a
        href="https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=f0rb1sOMiQ9pPK860ygqqZ87hKHfHeyx&scope=read%3Ajira-work%20manage%3Ajira-project%20manage%3Ajira-configuration%20read%3Ajira-user%20write%3Ajira-work&redirect_uri=https%3A%2F%2Flocalhost%3A7087%2Fapi%2Fauth%2Fatlassian&state=${YOUR_USER_BOUND_VALUE}&response_type=code&prompt=consent"
      >
        Jira
      </a> -->
</template>

<style lang="scss" scoped>
header {
  display: flex;
  width: 100%;
  height: var(--header-height);
  align-items: center;
  justify-content: space-between;
  background: #000;
  color: #fff;

  > button,
  a {
    color: #fff;
  }
}
</style>
