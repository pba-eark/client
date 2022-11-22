<script>
export default defineComponent({
  async setup() {
    const handleClick = (event) => {
      if (event.target.classList.contains("customer-selection")) return;
      customerSelection.hidden = true;
    };

    onBeforeMount(() => {
      window.addEventListener("click", handleClick);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("click", handleClick);
    });

    let searchTerm = ref("");
    let isCustomerSelected = ref(false);
    const customers = await $fetch("https://restcountries.com/v3.1/all");
    const customerSelection = reactive({
      hidden: true,
      selected: {},
    });

    const handleSubmit = () => {
      console.log("submit");
    };

    const createCustomer = (customer) => {
      if (typeof customer === Object) return selectCustomer(customer);

      const obj = {
        name: {
          common: customer,
        },
      };

      selectCustomer(obj);

      console.log("Created & selected customer:", customerSelection.selected);
    };

    const searchCustomers = computed(() => {
      if (searchTerm.value === "") return customers;

      return customers.filter((customer) => {
        if (
          customer.name.common
            .toLowerCase()
            .includes(searchTerm.value.toLowerCase())
        ) {
          return customer;
        }
      });
    });

    const validateNewCustomer = computed(() => {
      if (searchTerm.value === "") return false;

      for (let i = 0; i < customers.length; i++) {
        if (
          customers[i].name.common.toLowerCase() ===
          searchTerm.value.toLowerCase()
        ) {
          return false;
        }
      }

      return true;
    });

    const selectCustomer = (customer) => {
      customerSelection.selected = customer;
      searchTerm.value = customer.name.common;
      isCustomerSelected.value = true;
      console.log("customer selected!", customer);
    };

    return {
      handleSubmit,
      searchTerm,
      customers,
      searchCustomers,
      selectCustomer,
      createCustomer,
      customerSelection,
      isCustomerSelected,
      validateNewCustomer,
    };
  },
});
</script>

<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <label
        v-if="!isCustomerSelected"
        class="selectCustomer customer-selection"
      >
        <span class="label customer-selection">Kunde</span>
        <div class="customer-selection">
          <input
            class="customer-selection"
            type="text"
            v-model="searchTerm"
            @focus="customerSelection.hidden = false"
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
                {{ customer.name.common }}
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
            {{ customerSelection.selected.name.common }}
          </span>

          <Button text="X" @click="isCustomerSelected = false" />
        </p>
      </div>
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
    border: 1px solid #eee;
    max-height: 150px;
    overflow-y: scroll;

    li {
      cursor: pointer;
    }
  }
}
</style>
