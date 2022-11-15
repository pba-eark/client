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
    <img src="https://placekitten.com/220/150" alt="Logo" />
    <nav>
      <NuxtLink to="/">Home</NuxtLink>
      <NuxtLink v-if="!store.IS_AUTHORIZED" to="/login">Login</NuxtLink>
      <button v-else>Log out</button>
      <br />
      <span>auth: {{ store.IS_AUTHORIZED }}</span>
    </nav>
  </header>
</template>
