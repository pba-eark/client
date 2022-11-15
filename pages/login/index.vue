<script>
export default {
  async setup() {
    const data = reactive({
      email: "",
      password: "",

      newEmail: "",
      firstName: "",
      lastName: "",
    });
    const runtimeConfig = useRuntimeConfig();

    /* If using async setup(), make sure to register lifecycle hooks before the first await statement. */
    onMounted(() => {
      console.log("api url", runtimeConfig.API_URL);
    });

    const handleLogin = async () => {
      const JWT = await $fetch(`${runtimeConfig.API_URL}/authentication`, {
        method: "POST",
        body: { email: data.email, password: data.password },
      });
      console.log("JWT:", JWT);
    };

    const handleSignUp = async () => {
      const signUp = await $fetch(`${runtimeConfig.API_URL}/users`, {
        method: "POST",
        body: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.newEmail,
          password: data.newPassword,
        },
      });

      console.log("sign up res:", signUp);
    };

    return {
      data,
      handleLogin,
      handleSignUp,
    };
  },
};
</script>

<template>
  <div>
    <form @submit.prevent="handleLogin">
      <h1>Login</h1>
      <label>
        <p>Email</p>
        <!-- <input type="email" v-model="data.email" /> -->
        <input type="text" v-model="data.email" />
        <p>Password</p>
        <input type="password" v-model="data.password" />

        <br />
        <button type="submit">Sign in</button>
      </label>
    </form>
  </div>
  <div>
    <form @submit.prevent="handleSignUp">
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
