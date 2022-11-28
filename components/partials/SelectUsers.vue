<script setup>
import { useUserStore } from "~/store/users";
import { useAuthStore } from "~/store/auth";

const authStore = useAuthStore();
const userStore = useUserStore();

const userOptions = reactive({
  available: [],
  selected: [],
});

const props = defineProps({
  label: {
    type: String,
    required: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update"]);

onMounted(async () => {
  if (!userStore.USERS.length) {
    await userStore.getUsers(authStore.API_TOKEN);
    userOptions.available = userStore.USERS;
  }
});

const handleSelectUser = (user) => {
  userOptions.selected.push(user);

  const userIndex = userOptions.available.findIndex(
    (obj) => obj.id === user.id
  );

  userOptions.available.splice(userIndex, 1);
  emit("update", userOptions.selected);
};

const handleRemoveSelectedUser = (user) => {
  userOptions.available.push(user);

  const userIndex = userOptions.selected.findIndex((obj) => obj.id === user.id);

  userOptions.selected.splice(userIndex, 1);

  emit("update", userOptions.selected);
};
</script>

<template>
  <p>
    <b>{{ label }}</b>
  </p>

  <ul v-if="userOptions.selected.length > 0">
    <li v-for="user in userOptions.selected">
      {{ `${user.firstName} ${user.lastName}` }}
      <Button text="X" @click="handleRemoveSelectedUser(user)" />
    </li>
  </ul>

  <Input
    :required="required"
    type="select"
    :options="userOptions.available"
    emit="selectedUser"
    placeholder="Vælg brugere"
    @selectedUser="handleSelectUser"
  />
</template>
