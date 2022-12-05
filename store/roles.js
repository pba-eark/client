import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
import { typeCheck } from "../helpers/functions";

export const useRoleStore = defineStore("role-store", () => {

  const runtimeConfig = useRuntimeConfig();
  const authStore = useAuthStore();

  /* State */
  const roles = ref([]);

  /* Actions */
  const setRoles = (payload) => {
    roles.value = payload;
  };

  const getRoles = async () => {
    const response = await $fetch(`${runtimeConfig.public.API_URL}/roles`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.API_TOKEN}`,
      },
    });

    setRoles(response);
  };

  const createRole = async (obj) => {

    const response = await $fetch(
      `${runtimeConfig.public.API_URL}/roles`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.API_TOKEN}`,
        },
        body: obj,
      });

      roles.value = [...roles.value, response];
  };

  const updateRole = async (obj) => {
    const { id } = obj;

    const response = await $fetch(
      `${runtimeConfig.public.API_URL}/roles/${id}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.API_TOKEN}`,
        },
        body: obj,
      });

    update(id, response);
  };

  const deleteRole = async (id) => {
    await $fetch(
      `${runtimeConfig.public.API_URL}/roles/${id}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.API_TOKEN}`,
        },
      });

    remove(id);
  };

  /* Helper functions */
  const update = (id, obj) => {

    roles.value.map((role) => {

      if (role.id === typeCheck(id)) Object.assign(role, obj);

    });

  };

  const remove = (id) => {

    roles.value.forEach((element) => {

      element.id;

      if (element.id === typeCheck(id)) {

        let index = roles.value.findIndex(element);
        roles.value.splice(index, 1);

      }

    });

  };

  /* Getters */
  const ROLES = computed(() => roles.value);

  return {
    getRoles,
    createRole,
    updateRole,
    deleteRole,
    ROLES
  };
});
