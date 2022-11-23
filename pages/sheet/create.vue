<script setup>
import { useCustomerStore } from "~/store/customer";

definePageMeta({
  middleware: ["auth"],
});

const customerStore = useCustomerStore();
let searchTerm = ref("");
const customerSearchInput = ref(null);
let isCustomerSelected = ref(false);
const customerSelection = reactive({
  hidden: true,
  selected: {},
});

const handleClick = (event) => {
  if (event.target.classList.contains("customer-selection")) return;
  customerSelection.hidden = true;
};

onBeforeMount(() => {
  window.addEventListener("click", handleClick);
});

onMounted(() => {
  // console.log("ref", customerSearchInput);
  // customerSearchInput.focus();
});

onBeforeUnmount(() => {
  window.removeEventListener("click", handleClick);
});

const handleSubmit = () => {
  console.log("submit");
};

const createCustomer = (customer) => {
  if (typeof customer === Object) return selectCustomer(customer);

  const obj = {
    customerName: customer,
  };

  selectCustomer(obj);

  console.log("Created & selected customer:", customerSelection.selected);
};

const searchCustomers = computed(() => {
  if (searchTerm.value === "") return customerStore.GET_CUSTOMERS;

  return customerStore.GET_CUSTOMERS.filter((customer) => {
    if (
      customer.customerName
        .toLowerCase()
        .includes(searchTerm.value.toLowerCase())
    ) {
      return customer;
    }
  });
});

const validateNewCustomer = computed(() => {
  if (searchTerm.value === "") return false;

  for (let i = 0; i < customerStore.GET_CUSTOMERS.length; i++) {
    if (
      customerStore.GET_CUSTOMERS[i].customerName.toLowerCase() ===
      searchTerm.value.toLowerCase()
    ) {
      return false;
    }
  }

  return true;
});

const selectCustomer = (customer) => {
  customerSelection.selected = customer;
  searchTerm.value = customer.customerName;
  isCustomerSelected.value = true;
  console.log("customer selected!", customer);
};

const handleCustomerSearch = (val) => {
  searchTerm.value = val;
};

const handleUndoCustomer = () => {
  isCustomerSelected.value = false;
  searchTerm.value = "";
};
</script>

<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <!-- Select project customer -->
      <label
        v-if="!isCustomerSelected"
        class="selectCustomer customer-selection"
      >
        <span class="label customer-selection">Kunde</span>
        <div class="customer-selection">
          <Input
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
                @click="selectCustomer(customer)"
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
          @click.prevent="createCustomer(searchTerm)"
        />
      </label>

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
      <Input label="Navn på ark" placeholder="lol" />

      <!-- Jira -->
      <a
        href="https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=f0rb1sOMiQ9pPK860ygqqZ87hKHfHeyx&scope=read%3Ajira-work%20manage%3Ajira-project%20manage%3Ajira-configuration%20read%3Ajira-user%20write%3Ajira-work&redirect_uri=https%3A%2F%2Flocalhost%3A7087%2Fapi%2Fauth%2Fatlassian&state=${YOUR_USER_BOUND_VALUE}&response_type=code&prompt=consent"
        >Jira
      </a>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.selectCustomer {
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
</style>
