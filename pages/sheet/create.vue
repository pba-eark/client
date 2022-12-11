<script setup>
import { useCustomerStore } from "~/store/customers";
import { useEstimateSheetStore } from "~/store/estimateSheets";
import { useTabsStore } from "~/store/tabs";
import { useEpicStore } from "~/store/epics";
import { useTaskStore } from "~/store/tasks";
import { useRiskProfileStore } from "~/store/riskProfiles";
import { useEstimateSheetRiskProfileStore } from "~/store/composites/estimateSheetRiskProfiles";
import { useEstimateSheetUserStore } from "~/store/composites/estimateSheetUsers";

const customerStore = useCustomerStore();
const sheetStore = useEstimateSheetStore();
const tabStore = useTabsStore();
const epicStore = useEpicStore();
const taskStore = useTaskStore();
const riskProfileStore = useRiskProfileStore();
const sheetRiskProfileStore = useEstimateSheetRiskProfileStore();
const sheetUserStore = useEstimateSheetUserStore();

const customers = ref([]);
const copyFromCustomer = ref(null);

const selectType = reactive({
  selected: "empty",
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
  estimatedBy: [],
  doneBy: [],
});

onBeforeMount(() => {
  window.addEventListener("click", handleClick);
});

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

onBeforeUnmount(() => {
  window.removeEventListener("click", handleClick);
});

definePageMeta({
  middleware: ["auth"],
});

const handleSubmit = async () => {
  if (!postData.sheet.SheetName) return alert("Sheet name missing");

  /* Set customer if selected */
  if (isCustomerSelected.value) {
    if (customerSelection.selected.id) {
      postData.sheet.customerId = customerSelection.selected.id;
    } else {
      await customerStore.createCustomer(customerSelection.selected);

      postData.sheet.customerId =
        customerStore.CUSTOMERS[customerStore.CUSTOMERS.length - 1].id;
    }
  }

  const newSheet = await sheetStore.createEstimateSheet(postData.sheet);

  /* Create connection between global risk profiles and new sheet */
  const riskProfiles = [...riskProfileStore.RISK_PROFILES];

  const globalRiskProfiles = riskProfiles.filter((profile) => {
    return profile.global;
  });

  globalRiskProfiles.forEach((globalProfile) => {
    const obj = {
      estimateSheetId: newSheet.id,
      riskProfileId: globalProfile.id,
    };
    sheetRiskProfileStore.createEstimateSheetRiskProfile(obj);
  });

  /* Create connection between users and new sheet */
  /* Estimated by  */
  if (postData.estimatedBy.length)
    postData.estimatedBy.forEach((user) => {
      const obj = {
        estimateSheetId: newSheet.id,
        userId: user.id,
        type: "estimate",
      };
      sheetUserStore.createEstimateSheetUser(obj);
    });

  /* Done by  */
  if (postData.doneBy.length)
    postData.doneBy.forEach((user) => {
      const obj = {
        estimateSheetId: newSheet.id,
        userId: user.id,
        type: "done",
      };
      sheetUserStore.createEstimateSheetUser(obj);
    });

  /* Copy from sheet, if selected */
  if (selectType.selected === "copy" && copyFromCustomer.value !== null) {
    const epicsToCreate = [];
    epicStore.EPICS.map(async (epic) => {
      if (epic.estimateSheetId == copyFromCustomer.value) {
        const newEpic = { ...epic, estimateSheetId: newSheet.id };
        epicsToCreate.push(newEpic);
      }
    });

    epicsToCreate.map(async (epic) => {
      const epicCopy = { ...epic };
      delete epic.id;
      const newEpic = await epicStore.createEpic(epic);

      taskStore.TASKS.map((task) => {
        if (epicCopy.id === task.epicId)
          taskStore.createTask({ ...task, epicId: newEpic.id });
      });
    });
  }

  tabStore.openTab(newSheet);

  navigateTo(`/sheet/${newSheet.id}`);
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

const handleClick = (event) => {
  if (event.target.classList.contains("customer-selection")) return;
  customerSelection.hidden = true;
};

const handleSelectEstimatedBy = (val) => {
  postData.estimatedBy = val;
};

const handleSelectDoneBy = (val) => {
  postData.doneBy = val;
};

const handleSetWorkbook = (val) => {
  postData.sheet.workbookLink = val;
};

const handleSetJira = (val) => {
  postData.sheet.jiraLink = val;
};

const handleSetWireframe = (val) => {
  postData.sheet.wireframeLink = val;
};

/* Select new sheet type */
const handleSelectEmptySheet = () => {
  selectType.selected = "empty";
  handleClearCopyCustomer();
  handleClearTemplate();
};

const handleSelectTemplateSheet = () => {
  selectType.selected = "template";
  handleClearCopyCustomer();
};

const handleSelectCopySheet = () => {
  selectType.selected = "copy";
  handleClearTemplate();
};

/* Clear template copy / template */
const handleClearCopyCustomer = () => {
  copyFromCustomer.value = null;
};

const handleClearTemplate = () => {
  console.log("clear template");
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

      <SelectUsers label="Estimeret af" @update="handleSelectEstimatedBy" />

      <SelectUsers label="Udført af" @update="handleSelectDoneBy" />

      <!-- Jira -->
      <Input
        label="Workbook"
        emit="workbook"
        @workbook="handleSetWorkbook"
        placeholder="Link til Workbook"
      />

      <Input
        label="Jira"
        emit="jira"
        @jira="handleSetJira"
        placeholder="Link til Jira"
      />

      <Input
        label="Wireframe"
        emit="wireframe"
        @wireframe="handleSetWireframe"
        placeholder="Link til wireframe"
      />
      <!-- <a
        href="https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=f0rb1sOMiQ9pPK860ygqqZ87hKHfHeyx&scope=read%3Ajira-work%20manage%3Ajira-project%20manage%3Ajira-configuration%20read%3Ajira-user%20write%3Ajira-work&redirect_uri=https%3A%2F%2Flocalhost%3A7087%2Fapi%2Fauth%2Fatlassian&state=${YOUR_USER_BOUND_VALUE}&response_type=code&prompt=consent"
        >Jira
      </a> -->

      <br />
      <Button text="Opret estimatark" type="submit" />
    </form>

    <div>
      <div class="block__select">
        <div
          :class="{ active: selectType.selected === 'empty' }"
          @click="handleSelectEmptySheet"
        >
          Tom
        </div>
        <div
          :class="{ active: selectType.selected === 'template' }"
          @click="handleSelectTemplateSheet"
        >
          Template
        </div>
        <div
          :class="{ active: selectType.selected === 'copy' }"
          @click="handleSelectCopySheet"
        >
          Kopiér
        </div>
      </div>

      <div v-show="selectType.selected === 'copy'">
        <ul>
          <li v-for="customer in customers">
            <b>{{ customer.customerName }}</b>

            <ul v-if="customer.sheets && customer.sheets.length">
              <li v-for="sheet in customer.sheets">
                <label>
                  {{ sheet.sheetName }}
                  <input
                    type="radio"
                    name="copy"
                    :value="sheet.id"
                    v-model="copyFromCustomer"
                  />
                </label>
              </li>
            </ul>
          </li>
          <Button text="Clear" @click="handleClearCopyCustomer" />
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.block {
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  &__select {
    display: flex;
    width: 100%;

    > div {
      padding: 8px 15px;
      border: 1px solid #eee;
      margin-right: 8px;
      cursor: pointer;

      &.active {
        background: peru;
        color: #fff;
      }
    }
  }

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
