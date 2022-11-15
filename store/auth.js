import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth-store", {
  state: () => ({
    jwt: "",
  }),
  actions: {
    async handleLogin(email, password) {
      const runtimeConfig = useRuntimeConfig();

      const JWT = await $fetch(
        `${runtimeConfig.public.API_URL}/authentication`,
        {
          method: "POST",
          body: { email, password },
        }
      );

      this.jwt = JWT;
      console.log("JWT:", this.jwt);
    },

    async handleSignUp(firstName, lastName, email, password) {
      const runtimeConfig = useRuntimeConfig();

      const response = await $fetch(`${runtimeConfig.API_URL}/users`, {
        method: "POST",
        body: {
          firstName,
          lastName,
          email,
          password,
        },
      });

      console.log("sign up res:", response);
    },
  },
  getters: {
    API_TOKEN: (state) => state.jwt,
  },
});
