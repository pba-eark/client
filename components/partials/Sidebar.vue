<script setup>
import { useCustomerStore } from "~/store/customers";
import { useEstimateSheetStore } from "~~/store/estimateSheets";
import { useEpicStore } from "~/store/epics";
import { useTabsStore } from "~/store/tabs";
import { useGlobalStore } from "~/store";
import { useSheetStatusStore } from "~/store/sheetStatus";

const customerStore = useCustomerStore();
const sheetStore = useEstimateSheetStore();
const sheetStatusStore = useSheetStatusStore();
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
    const customerSheets = sheetStore.ESTIMATE_SHEETS.filter((sheet) => {
      if (sheet.customerId === c.id) return sheet;
    });

    const customerSheetsWithStatus = customerSheets.map((sheet) => {
      const sheetStatus = sheetStatusStore.SHEET_STATUS.filter((status) => {
        return status.id === sheet.sheetStatusId;
      })[0];

      return { ...sheet, status: sheetStatus || null };
    });

    customers.value.push({ ...c, sheets: customerSheetsWithStatus });
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

      const customerSheets = sheetStore.ESTIMATE_SHEETS.filter((sheet) => {
        if (sheet.customerId === newCustomer.id) return sheet;
      });

      newCustomer.sheets = customerSheets;
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

/* If sheet status change */
watch(
  () => sheetStore.CURRENT_ESTIMATE_SHEET,
  (newSheet, oldSheet) => {
    if (!newSheet || !oldSheet) return;
    if (newSheet?.id !== oldSheet?.id || customers.value.length < 1) return;

    const customerIndex = customers.value.findIndex((customer) => {
      return customer.id === newSheet.customerId;
    });

    if (customerIndex === -1) return;

    const sheetIndex = customers.value[customerIndex].sheets.findIndex(
      (sheet) => {
        return sheet.id === newSheet.id;
      }
    );

    return (customers.value[customerIndex].sheets[sheetIndex] = newSheet);
  },
  { deep: true }
);

const sheetsWithoutCustomers = computed(() => {
  return sheetStore.ESTIMATE_SHEETS.filter((sheet) => {
    const sheetStatus = sheetStatusStore.SHEET_STATUS.filter((status) => {
      return status.id === sheet.sheetStatusId;
    })[0];
    sheet.status = sheetStatus || null;
    return !sheet.customerId;
  });
});

const sheetEpics = computed(() => {
  return epicStore.EPICS.filter((epic) => {
    return epic.estimateSheetId == sheetStore.CURRENT_ESTIMATE_SHEET?.id;
  });
});
</script>

<template>
  <div class="block">
    <Logo />
    <div class="block__wrapper">
      <div class="block__header">
        <div class="block__projects">
          <Button
            text="Estimater"
            :icon="isProjectsOpen ? 'icon-folder' : 'icon-folder-closed'"
            @click="isProjectsOpen = !isProjectsOpen"
            class="projects"
          />
          <ul v-show="isProjectsOpen" class="customers">
            <!-- Customer list -->
            <li
              v-for="customer in customers"
              :key="customer.id"
              v-show="customer.sheets && customer.sheets.length"
            >
              <p @click="customer.visible = !customer.visible">
                <span>
                  <Icon
                    icon="icon-chevron"
                    :class="{ rotate: !customer.visible }"
                  />
                </span>
                <span>
                  {{ customer.customerName }}
                </span>
              </p>

              <!-- Projects for customer -->
              <ul v-show="customer.visible" class="sheets">
                <li v-for="sheet in customer.sheets">
                  <div
                    class="sheet-status"
                    :style="{
                      backgroundColor: sheet.status?.sheetStatusColor
                        ? sheet.status.sheetStatusColor
                        : '#777',
                    }"
                  ></div>
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

              <ul v-show="showMissingCustomerSheets" class="sheets">
                <li v-for="sheet in sheetsWithoutCustomers">
                  <div
                    class="sheet-status"
                    :style="{
                      backgroundColor: sheet.status?.sheetStatusColor
                        ? sheet.status.sheetStatusColor
                        : '#777',
                    }"
                  ></div>
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
        </div>
      </div>

      <div v-show="sheetStore.CURRENT_ESTIMATE_SHEET" class="block__epics">
        <!-- Sheet epic nav -->
        <Button
          :class="{ open: isEpicsOpen }"
          class="sheet-overview"
          :text="sheetStore.CURRENT_ESTIMATE_SHEET?.sheetName"
          icon="icon-chevron"
          @click="isEpicsOpen = !isEpicsOpen"
        />
        <ul v-show="isEpicsOpen" class="block__epics-list">
          <li class="block__epics-list-item">
            <Button
              @click="sheetStore.toggleSheetOverview($route.params.id)"
              class="block__epics-toggle"
              :class="{ active: sheetStore.IS_OVERVIEW_TOGGLED }"
              :text="sheetStore.IS_OVERVIEW_TOGGLED ? 'Epics' : 'Overblik'"
              :icon="
                sheetStore.IS_OVERVIEW_TOGGLED
                  ? 'icon-list'
                  : 'icon-square-list'
              "
            />
          </li>
          <li v-for="epic in sheetEpics" class="block__epics-list-item">
            <button
              @click="globalStore.scrollToEpic($route.params.id, epic.id)"
            >
              {{ epic.epicName }}
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.block {
  display: grid;
  // grid-template-rows: 60px auto 1fr;
  grid-template-rows: 60px auto;
  height: 100vh;
  background-color: var(--color-sidebar);

  &__wrapper {
    max-height: calc(100vh - 60px);
    overflow-y: overlay;

    /* width */
    &::-webkit-scrollbar {
      width: 5px;
    } 
    /* Handle */
    &::-webkit-scrollbar-thumb {
      background: var(--color-scrollbar);
      border-radius: 10px;
    }
    /* Handle on hover */
    &::-webkit-scrollbar-thumb:hover {
      background: var(--color-tabs);
    }
  }

  &__header {
    border-top: 1px solid var(--color-background);
    border-bottom: 1px solid var(--color-background);
    padding: 3px 0;

    button {
      width: 100%;
      height: 36px;
      padding: 0 15px;
      border: none;
      font-weight: 600;

      &.projects {
        margin: 0;
        background: #fff;
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
    display: flex;
    flex-direction: column;
    > ul.customers {
      padding: 0px 15px;

      p {
        padding: 5px 0;
        cursor: pointer;
        user-select: none;
        text-decoration: underline;
        // font-weight: 600;

        svg {
          height: 10px;
          width: 10px;
          margin-right: 8px;
        }
      }

      ul.sheets {
        padding-left: 15px;
        margin-left: 4px;
        margin-bottom: 5px;
        border-left: 2px solid rgba(0, 0, 0, 0.25);

        li {
          padding: 3px 0;
          display: flex;
          gap: 5px;

          .sheet-status {
            margin-top: 0.2rem;
            height: 10px;
            width: 10px;
            border-radius: 50px;
            // background: #777;
          }
        }
      }
    }
  }

  &__epics {
    &-list {
      &-item {
        button {
          padding: 6px 15px;

          &:hover {
            background: var(--color-background) !important;
          }
        }
      }
    }

    &-toggle {
      background: var(--color-background) !important;
      // &.active {
      // }
    }

    button {
      width: 100%;
      background: transparent;
      border: none;
      outline: none;
      text-align: left;
      cursor: pointer;
    }
  }
}

.rotate {
  transform: rotate(270deg);
}
</style>
