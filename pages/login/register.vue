<script setup>
import { useAuthStore } from "~/store/auth";
import { useUserStore } from "~/store/users";

const authStore = useAuthStore();
const { $swal } = useNuxtApp();
const userStore = useUserStore();
const data = reactive({
  email: "",
  password: "",
  passwordRepeat: "",
  firstname: "",
  lastname: "",
});

/* Make sure user can't access this page, if logged in */
watchEffect(async () => {
  if (authStore.IS_AUTHORIZED) {
    return navigateTo(localStorage.getItem("lastPath") ?? "/");
  }
});

const handleSignUp = async () => {
  let errors = [];
  if (!data.firstname.length) errors.push("Fornavn ikke udfyldt.");
  if (!data.lastname.length) errors.push("Efternavn ikke udfyldt.");
  if (!data.email.length) errors.push("Email adresse ikke udfyldt.");
  if (!data.password.length) errors.push("Adgangskode ikke udfyldt.");
  if (data.password !== data.passwordRepeat)
    errors.push("Adgangskoder matcher ikke.");

  if (errors.length) {
    return $swal.fire({
      icon: "error",
      title: "Ups! Der skete en fejl.",
      html: `
            <h3>Ret følgende:</h3>
            <ul>
            ${errors
              .map((e) => {
                return `<li>${e}</li>`;
              })
              .join("")}
            <ul>
            `,
    });
  }

  const res = await authStore.handleSignUp(
    data.firstname,
    data.lastname,
    data.email,
    data.password
  );

  if (res === false)
    return $swal.fire({
      icon: "error",
      title: "Email adresse allerede i brug!",
      text: "Den valgte email adresse er allerede i brug. Prøv en anden!",
    });

  return $swal.fire({
    position: "center",
    icon: "success",
    title: `Konto registréret.`,
    text: `Velkommen ${userStore.CURRENT_USER.firstName}.`,
    showConfirmButton: false,
    timer: 1500,
  });
};

const handleUpdateFirstname = (val) => {
  data.firstname = val;
};

const handleUpdateLastname = (val) => {
  data.lastname = val;
};

const handleUpdateEmail = (val) => {
  data.email = val;
};

const handleUpdatePassword = (val) => {
  data.password = val;
};

const handleUpdatePasswordRepeat = (val) => {
  data.passwordRepeat = val;
};
</script>

<template>
  <div class="block">
    <form @submit.prevent="handleSignUp">
      <h1>Opret konto</h1>
      <Input
        class="input__default"
        placeholder="Indtast dit fornavn"
        required
        type="text"
        label="Fornavn"
        emit="updateFirstname"
        @updateFirstname="handleUpdateFirstname"
      />

      <Input
        class="input__default"
        placeholder="Indtast dit efternavn"
        required
        type="text"
        label="Efternavn"
        emit="updateLastname"
        @updateLastname="handleUpdateLastname"
      />

      <Input
        class="input__default"
        placeholder="Indtast din email adresse"
        required
        type="text"
        label="Email"
        emit="updateNewEmail"
        @updateNewEmail="handleUpdateEmail"
      />

      <Input
        class="input__default"
        placeholder="Indtast din adgangskode"
        required
        :class="{
          warning:
            data.password.length &&
            data.passwordRepeat.length &&
            data.password !== data.passwordRepeat,
        }"
        type="password"
        label="Adgangskode"
        emit="updateNewPassword"
        @updateNewPassword="handleUpdatePassword"
      />

      <Input
        class="input__default"
        placeholder="Gentag din adgangskode"
        required
        :class="{
          warning:
            data.password.length &&
            data.passwordRepeat.length &&
            data.password !== data.passwordRepeat,
        }"
        type="password"
        label="Gentag adgangskode"
        emit="updateNewPassword"
        @updateNewPassword="handleUpdatePasswordRepeat"
      />

      <Button class="cta" text="Sign up" type="submit" />
    </form>

    <NuxtLink class="auth-secondary" to="/login"
      >Har du allerede en konto?</NuxtLink
    >
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
