<script setup>
import { useAuthStore } from "~/store/auth";
import { useCustomerStore } from "~/store/customers";
import { useEstimateSheetStore } from "~/store/estimateSheets";
import { useUserStore } from "~/store/users";

onBeforeMount(() => {
  window.addEventListener("click", handleClick);
});

onMounted(async () => {
  if (!userStore.USERS.length) {
    await userStore.getUsers(authStore.API_TOKEN);
    userOptions.available = userStore.USERS;

    console.log("user options", userOptions);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("click", handleClick);
});

const authStore = useAuthStore();
const customerStore = useCustomerStore();
const sheetStore = useEstimateSheetStore();
const userStore = useUserStore();

definePageMeta({
  middleware: ["auth"],
});

let searchTerm = ref("");
const customerSearchInput = ref(null);
let isCustomerSelected = ref(false);
const customerSelection = reactive({
  hidden: true,
  selected: {},
});

const postData = reactive({
  sheet: {},
});

const userOptions = reactive({
  available: [],
  selected: [],
});

const handleSubmit = () => {
  if (!postData.sheet.SheetName) return alert("Sheet name missing");

  /* Set customer if selected */
  if (isCustomerSelected.value) {
    if (customerSelection.selected.id) {
      postData.sheet.customerId = customerSelection.selected.id;
    } else {
      return console.log("CREATE CUSTOMER HERE");
    }
  }

  sheetStore.createEstimateSheet(authStore.API_TOKEN, postData.sheet);
};

const handleCreateCustomer = (customer) => {
  const obj = {
    customerName: customer,
  };

  handleSelectCustomer(obj);
};

const handleSelectCustomer = (customer) => {
  customerSelection.selected = customer;
  searchTerm.value = customer.customerName;
  isCustomerSelected.value = true;
};

const handleCustomerSearch = (val) => {
  searchTerm.value = val;
};

const handleUndoCustomer = () => {
  isCustomerSelected.value = false;
  searchTerm.value = "";
};

const handleSetSheetName = (val) => {
  postData.sheet.SheetName = val;
};

const handleSelectUser = (user) => {
  userOptions.selected.push(user);

  const userIndex = userOptions.available.findIndex(
    (obj) => obj.id === user.id
  );

  userOptions.available.splice(userIndex, 1);
};

const handleRemoveSelectedUser = (user) => {
  userOptions.available.push(user);

  const userIndex = userOptions.selected.findIndex((obj) => obj.id === user.id);

  userOptions.selected.splice(userIndex, 1);
};

const handleClick = (event) => {
  if (event.target.classList.contains("customer-selection")) return;
  customerSelection.hidden = true;
};

const searchCustomers = computed(() => {
  if (searchTerm.value === "") return customerStore.CUSTOMERS;

  return customerStore.CUSTOMERS.filter((customer) => {
    if (
      customer.customerName
        .toLowerCase()
        .includes(searchTerm.value.toLowerCase())
    ) {
      return customer;
    }
  });
});

/*
 ******* FIXME: Return only users NOT in selectedUsers array!!!!!!!
 ******* FIXME: Return only users NOT in selectedUsers array!!!!!!!
 ******* FIXME: Return only users NOT in selectedUsers array!!!!!!!
 */
// const computedUserOptions = computed(() => {
//   return userOptions.available.map((user) => {
//     return { id: user.id, name: `${user.firstName} ${user.lastName}` };
//   });
// });

const validateNewCustomer = computed(() => {
  if (searchTerm.value === "") return false;

  for (let i = 0; i < customerStore.CUSTOMERS.length; i++) {
    if (
      customerStore.CUSTOMERS[i].customerName.toLowerCase() ===
      searchTerm.value.toLowerCase()
    ) {
      return false;
    }
  }

  return true;
});
</script>

<template>
  <div class="block">
    <form @submit.prevent="handleSubmit">
      <!-- Select project customer -->
      <div
        v-if="!isCustomerSelected"
        class="block__customer customer-selection"
      >
        <div class="customer-selection">
          <Input
            label="Kunde"
            type="search"
            class="customer-selection"
            v-model="searchTerm"
            ref="customerSearchInput"
            @focus="customerSelection.hidden = false"
            emit="customerSearch"
            @customerSearch="handleCustomerSearch"
          />

          <div
            v-show="!customerSelection.hidden"
            class="customerList customer-selection"
          >
            <ul class="customer-selection">
              <li
                v-for="customer in searchCustomers"
                @click="handleSelectCustomer(customer)"
              >
                {{ customer.customerName }}
              </li>
            </ul>
          </div>
        </div>

        <Button
          :disabled="!validateNewCustomer"
          class="customer-selection"
          text="Opret kunde"
          @click.prevent="handleCreateCustomer(searchTerm)"
        />
      </div>

      <div v-else>
        <p>
          Kunde:
          <span>
            {{ customerSelection.selected.customerName }}
          </span>

          <Button text="X" @click="handleUndoCustomer" />
        </p>
      </div>

      <!-- Sheet info -->
      <Input
        required
        label="Navn på ark"
        emit="sheetName"
        @sheetName="handleSetSheetName"
        placeholder="Navn på ark"
      />

      <ul v-if="userOptions.selected.length > 0">
        <li v-for="user in userOptions.selected">
          {{ `${user.firstName} ${user.lastName}` }}
          <Button text="X" @click="handleRemoveSelectedUser(user)" />
        </li>
      </ul>

      <Input
        label="Brugere"
        type="select"
        :options="userOptions.available"
        emit="selectedUser"
        placeholder="Vælg brugere"
        @selectedUser="handleSelectUser"
      />

      <!-- Jira -->
      <!-- <a
        href="https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=f0rb1sOMiQ9pPK860ygqqZ87hKHfHeyx&scope=read%3Ajira-work%20manage%3Ajira-project%20manage%3Ajira-configuration%20read%3Ajira-user%20write%3Ajira-work&redirect_uri=https%3A%2F%2Flocalhost%3A7087%2Fapi%2Fauth%2Fatlassian&state=${YOUR_USER_BOUND_VALUE}&response_type=code&prompt=consent"
        >Jira
      </a> -->

      <br />
      <Button text="Opret estimatark" type="submit" />
    </form>
  </div>
</template>

<style lang="scss" scoped>
.block {
  &__customer {
    display: flex;
    flex-wrap: wrap;
    position: relative;
    .label {
      width: 100%;
    }

    input,
    ul {
      width: 200px;
    }
    ul {
      position: absolute;
      list-style: none;
      background: #fff;
      border: 1px solid #eee;
      max-height: 150px;
      overflow-y: scroll;

      li {
        cursor: pointer;
      }
    }
  }
}
</style>
