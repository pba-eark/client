<script setup>
import { useGlobalStore } from "~/store/index";
import { useCustomerStore } from "~/store/customers";
import { useEstimateSheetStore } from "~~/store/estimateSheets";
import { useAuthStore } from "~/store/auth";

const globalStore = useGlobalStore();
const customerStore = useCustomerStore();
const sheetStore = useEstimateSheetStore();
const authStore = useAuthStore();

let customers = ref([]);

watchEffect(async () => {
  /* Merge customers and projects */
  if (globalStore.IS_LOADED) {
    /* Get and set customers in store */
    await customerStore.getCustomers(authStore.API_TOKEN);
    /* Get and set epics in store */
    await sheetStore.getEstimateSheets(authStore.API_TOKEN);

    customerStore.CUSTOMERS.map((c) => {
      const userSheets = sheetStore.ESTIMATE_SHEETS.filter((s) => {
        if (s.customerId === c.id) return s;
      });

      customers.value.push({ ...c, sheets: userSheets });
    });
  }
});
</script>

<template>
  <div class="block">
    <div class="block__header">
      <NuxtLink to="/sheet/create">Nyt estimatark</NuxtLink>
    </div>

    <div class="block__projects">
      <ul>
        <!-- Customer list -->
        <li v-for="customer in customers">
          {{ customer.customerName }} ({{ customer.id }})

          <!-- Projects for customer -->
          <ul>
            <li v-for="sheet in customer.sheets">* {{ sheet.sheetName }}</li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.block {
  height: calc(100vh - var(--header-height));
  overflow-y: scroll;

  &__header {
    height: 200px;
    background: red;
  }

  &__projects {
    height: 100%;
    background: purple;
    color: #fff;
  }
}
</style>
