<script>
import { useAuthStore } from "~/store/auth";

export default defineComponent({
  setup() {
    onMounted(() => {
      const store = useAuthStore();
      if (!store.IS_AUTHORIZED && localStorage.getItem("jwt")) {
        store.setJwt(localStorage.getItem("jwt"));
        navigateTo("/");
      }
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
