<script>
import { useAuthStore } from "~/store/auth";

export default defineComponent({
  async setup() {
    const runtimeConfig = useRuntimeConfig();
    const store = useAuthStore();

    /* Make sure user can't access this page, if logged in */
    watchEffect(() => {
      if (store.IS_AUTHORIZED) return navigateTo("/");
    });
    definePageMeta({
      middleware: ["login-auth"],
    });

    /* State */
    const data = reactive({
      email: "",
      password: "",

      newEmail: "",
      newPassword: "",
      firstName: "",
      lastName: "",
    });

    /* If using async setup(), make sure to register lifecycle hooks before the first await statement. */
    // onMounted(() => {
    //   console.log("api url", runtimeConfig.API_URL);
    // });

    return {
      data,
      store,
    };
  },
});
</script>

<template>
  <div>
    <form @submit.prevent="store.handleLogin(data.email, data.password)">
      <h1>Login</h1>
      <label>
        <p>Email</p>
        <input type="text" v-model="data.email" />
        <p>Password</p>
        <input type="password" v-model="data.password" />

        <br />
        <button type="submit">Sign in</button>
      </label>
    </form>
  </div>
  <div>
    <form
      @submit.prevent="
        store.handleSignUp(
          data.firstName,
          data.lastName,
          data.newEmail,
          data.newPassword
        )
      "
    >
      <h1>Create user</h1>
      <label>
        <p>First name</p>
        <input type="text" v-model="data.firstName" />
        <p>Last name</p>
        <input type="text" v-model="data.lastName" />
        <p>Email</p>
        <input type="text" v-model="data.newEmail" />
        <p>Password</p>
        <input type="password" v-model="data.newPassword" />

        <br />
        <button type="submit">Sign up</button>
      </label>
    </form>
  </div>
</template>
