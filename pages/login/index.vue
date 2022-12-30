<script setup>
import { useAuthStore } from "~/store/auth";
import { useUserStore } from "~/store/users";

const { $swal } = useNuxtApp();
const authStore = useAuthStore();
const userStore = useUserStore();
const data = reactive({
  email: "",
  password: "",
});

/* Make sure user can't access this page, if logged in */
watchEffect(async () => {
  if (authStore.IS_AUTHORIZED) {
    return navigateTo(localStorage.getItem("lastPath") ?? "/");
  }
});

const handleUpdateEmail = (val) => {
  data.email = val;
};

const handleUpdatePassword = (val) => {
  data.password = val;
};

const handleLogin = async () => {
  if (!data.email.length || !data.password.length)
    return $swal.fire({
      icon: "error",
      title: "Ups! Der skete en fejl.",
      text: `Email adresse og adgangskode passer ikke sammen. Prøv igen!`,
    });

  $swal.fire({
    title: "Logger ind... 🐱‍👤",
    text: "",
    allowOutsideClick: false,
    timerProgressBar: true,
    didOpen: async () => {
      $swal.showLoading();

      const res = await authStore.handleLogin(data.email, data.password);

      if (!res)
        return $swal.fire({
          icon: "error",
          title: "Ups! Der skete en fejl.",
          text: `Email adresse og adgangskode passer ikke sammen. Prøv igen!`,
        });

      return $swal.fire({
        position: "center",
        icon: "success",
        title: `Logget ind 🎉`,
        text: `Velkommen ${userStore.CURRENT_USER.firstName}!`,
        showConfirmButton: false,
        timer: 1500,
      });
    },
  });
};
</script>

<template>
  <div class="block">
    <form @submit.prevent="handleLogin">
      <h1>Login</h1>
      <Input
        class="input__default"
        placeholder="Indtast din email adresse"
        type="text"
        label="Email"
        emit="updateEmailInput"
        @updateEmailInput="handleUpdateEmail"
      />

      <Input
        class="input__default"
        placeholder="Indtast din adgangskode"
        type="password"
        label="Adgangskode"
        emit="updatePasswordInput"
        @updatePasswordInput="handleUpdatePassword"
      />

      <Button class="cta" text="Log ind" type="submit" />
    </form>

    <NuxtLink class="auth-secondary" to="/login/register">Opret konto</NuxtLink>
  </div>
</template>

<style lang="scss" scoped>
.block {
  h1 {
    text-align: center;
  }
  .auth-secondary {
    text-align: center;
    display: block;
    margin: 1.5rem 0;
  }
}
</style>
