<script>
import { useAuthStore } from "~/store/auth";
import { useGlobalStore } from "~/store";

export default defineComponent({
  async setup() {
    const globalStore = useGlobalStore();
    const authStore = useAuthStore();

    /* Make sure user can't access this page, if logged in */
    watchEffect(async () => {
      if (authStore.IS_AUTHORIZED) {
        await globalStore.fetchData(authStore.API_TOKEN);
        return navigateTo(localStorage.getItem("lastPath") ?? "/");
      }
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
    //   if (authStore.IS_AUTHORIZED) return navigateTo("/");
    // });

    return {
      data,
      authStore,
    };
  },
});
</script>

<template>
  <div class="block">
    <div class="login">
      <form @submit.prevent="authStore.handleLogin(data.email, data.password)">
        <h1>Login</h1>
        <label>
          <p>Email</p>
          <input type="text" v-model="data.email" />
          <p>Password</p>
          <input type="password" v-model="data.password" />

          <br />
          <Button text="Sign in" type="submit" />
        </label>
      </form>
    </div>

    <div class="register">
      <form
        @submit.prevent="
          authStore.handleSignUp(
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
          <Button text="Sign up" type="submit" />
        </label>
      </form>
    </div>
  </div>
</template>
