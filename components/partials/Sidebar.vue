<script setup>
import { useCustomerStore } from "~/store/customers";
import { useEstimateSheetStore } from "~~/store/estimateSheets";
const customerStore = useCustomerStore();
const sheetStore = useEstimateSheetStore();

let customers = ref([]);

watchEffect(() => {
  /* Merge customers and projects */
  if (customerStore.GET_CUSTOMERS && sheetStore.getEstimateSheets) {
    customerStore.GET_CUSTOMERS.map((c) => {
      sheetStore.GET_ESTIMATE_SHEETS.filter((s) => {
        s.customerId === c.id
          ? customers.value.push({ ...c, sheets: s })
          : customers.value.push({ ...c });
      });
    });

    console.log(customers.value);
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
        <li v-for="customer in customerStore.GET_CUSTOMERS">
          {{ customer.customerName }} ({{ customer.id }})

          <!-- Projects for customer -->
          <ul>
            <li v-for="sheet in sheetStore.GET_ESTIMATE_SHEETS">
              * {{ sheet.sheetName }}
            </li>
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
