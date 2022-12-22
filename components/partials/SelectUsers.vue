<script setup>
import { useUserStore } from "~/store/users";

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

onMounted(() => {
  if (userStore.USERS.length > 0) userOptions.available = [...userStore.USERS];
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
  <div>
    <Input
      class="input__default"
      :required="required"
      type="select"
      :options="userOptions.available"
      emit="selectedUser"
      :label="label"
      placeholder="Vælg brugere"
      @selectedUser="handleSelectUser"
    />
    <ul v-if="userOptions.selected.length > 0">
      <li v-for="user in userOptions.selected">
        <Button text="X" @click="handleRemoveSelectedUser(user)" />
        {{ `${user.firstName} ${user.lastName}` }}
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
div {
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  ul {
    padding: 15px;

    li {
      display: flex;
      width: 100%;
      margin: 5px 0;
    }
  }
}

button {
  border: none;
  background: var(--color-disabled);
  color: #fff;
  padding: 5px;
  border-radius: 4px;
  margin: 0 5px;
  line-height: 0;
}
</style>
