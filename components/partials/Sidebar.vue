<script setup>
import { useCustomerStore } from "~/store/customers";
import { useEstimateSheetStore } from "~~/store/estimateSheets";
import { useEpicStore } from "~/store/epics";
import { useTabsStore } from "~/store/tabs";
import { useGlobalStore } from "~/store";

const customerStore = useCustomerStore();
const sheetStore = useEstimateSheetStore();
const epicStore = useEpicStore();
const tabStore = useTabsStore();
const globalStore = useGlobalStore();

const customers = ref([]);
const isProjectsOpen = ref(false);
const showMissingCustomerSheets = ref(false);
const isEpicsOpen = ref(false);

onMounted(() => {
  customers.value = [];
  customerStore.CUSTOMERS.map((c) => {
    c.visible = false;
    const userSheets = sheetStore.ESTIMATE_SHEETS.filter((sheet) => {
      if (sheet.customerId === c.id) return sheet;
    });

    customers.value.push({ ...c, sheets: userSheets });
  });
});

watch(
  () => [customerStore.CUSTOMERS, sheetStore.ESTIMATE_SHEETS],
  ([newCustomers, newSheets], [oldCustomers, oldSheets]) => {
    /* If sheet was added, update customer sheets */
    if (newSheets.length > oldSheets.length) {
      const newSheet =
        sheetStore.ESTIMATE_SHEETS[sheetStore.ESTIMATE_SHEETS.length - 1];
      customers.value.map((customer) => {
        if (customer.id === newSheet.customerId)
          return (customer.sheets = [...customer.sheets, newSheet]);
      });
    }

    /* If customer was added, update customer sheets */
    if (newCustomers.length > oldCustomers.length) {
      const newCustomer =
        customerStore.CUSTOMERS[customerStore.CUSTOMERS.length - 1];

      const userSheets = sheetStore.ESTIMATE_SHEETS.filter((sheet) => {
        if (sheet.customerId === newCustomer.id) return sheet;
      });

      newCustomer.sheets = userSheets;
      newCustomer.visible = false;

      customers.value = [...customers.value, newCustomer];
    }
  }
);

/* If new sheet is opened, hide projects and show epic navigation */
watch(
  () => tabStore.TABS,
  (newTabs, oldTabs) => {
    if (newTabs.length > oldTabs.length) {
      isEpicsOpen.value = true;
      isProjectsOpen.value = false;
    }
  }
);

const sheetsWithoutCustomers = computed(() => {
  return sheetStore.ESTIMATE_SHEETS.filter((sheet) => {
    return !sheet.customerId;
  });
});

const sheetEpics = computed(() => {
  return epicStore.EPICS.filter((epic) => {
    return epic.estimateSheetId == sheetStore.CURRENT_ESTIMATE_SHEET[0]?.id;
  });
});
</script>

<template>
  <div class="block">
    <div class="block__header">
      <Button text="Globale indstillinger" icon="icon-cog" />

      <div class="block__projects">
        <Button
          text="Projekter"
          icon="icon-folder"
          @click="isProjectsOpen = !isProjectsOpen"
          class="projects"
        />
        <transition name="fade">
          <ul v-show="isProjectsOpen">
            <!-- Customer list -->
            <li v-for="customer in customers">
              <p @click="customer.visible = !customer.visible">
                <span>
                  <Icon
                    icon="icon-chevron"
                    :class="{ rotate: !customer.visible }"
                  />
                </span>
                <span>{{ customer.customerName }} ({{ customer.id }})</span>
              </p>

              <!-- Projects for customer -->
              <ul v-show="customer.visible">
                <li v-for="sheet in customer.sheets">
                  <NuxtLink
                    :to="`/sheet/${sheet.id}`"
                    @click="tabStore.handleOpenTab(sheet)"
                  >
                    {{ sheet.sheetName }}
                  </NuxtLink>
                </li>
              </ul>
            </li>

            <li v-if="sheetsWithoutCustomers && sheetsWithoutCustomers.length">
              <p
                @click="showMissingCustomerSheets = !showMissingCustomerSheets"
              >
                <span>
                  <Icon
                    icon="icon-chevron"
                    :class="{ rotate: !showMissingCustomerSheets }"
                  />
                </span>
                <span>Mangler kunde</span>
              </p>

              <ul v-show="showMissingCustomerSheets">
                <li v-for="sheet in sheetsWithoutCustomers">
                  <NuxtLink
                    :to="`/sheet/${sheet.id}`"
                    @click="tabStore.handleOpenTab(sheet)"
                  >
                    {{ sheet.sheetName }}
                  </NuxtLink>
                </li>
              </ul>
            </li>
          </ul>
        </transition>
      </div>

      <Button
        icon="icon-plus"
        text="Nyt estimatark"
        @click="$router.push('/sheet/create')"
      />
    </div>

    <div class="block__epics"></div>

    <div
      v-show="
        sheetStore.CURRENT_ESTIMATE_SHEET &&
        sheetStore.CURRENT_ESTIMATE_SHEET.length
      "
      class="block__epics"
    >
      isEpicsOpen: {{ isEpicsOpen }}
      <!-- Sheet epic nav -->
      <Button
        :text="sheetStore.CURRENT_ESTIMATE_SHEET[0]?.sheetName"
        icon="icon-chevron"
        @click="isEpicsOpen = !isEpicsOpen"
      />
      <ul v-show="isEpicsOpen">
        <li v-for="epic in sheetEpics">
          <button @click="globalStore.scrollToEpic(epic)">
            {{ epic.epicName }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.block {
  height: calc(100vh - var(--header-height));
  // overflow-y: scroll;
  background: #2e3032;
  padding: 15px;

  &__header {
    border-bottom: 2px solid #242424;
    padding: 15px 0;

    button {
      width: 100%;
      margin-bottom: 15px;
      height: 36px;
      padding: 0 5px;
      border: none;

      &.projects {
        background: #606060;
        color: #fff;
        margin: 0;
      }

      a {
        color: inherit;
        text-decoration: none;
      }
    }
  }

  &__projects {
    height: 100%;
    overflow: hidden;
    margin-bottom: 15px;
    color: #fff;

    > ul {
      border-top: 1px solid #242424;
      background: #606060;
      padding: 5px 8px;

      p {
        padding: 5px 0;
        cursor: pointer;
        user-select: none;
        font-weight: bold;

        svg {
          height: 10px;
          width: 10px;
          margin-right: 8px;
        }
      }

      ul {
        margin-left: 5px;
        border-left: 1px solid #fff;
        padding-left: 6px;
        margin-bottom: 5px;

        li {
          padding: 3px 0;
        }
      }
    }
  }

  &__epics {
    color: #fff;

    button {
      width: 100%;
    }
  }
}

.rotate {
  transform: rotate(270deg);
}
</style>
