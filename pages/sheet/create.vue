<script setup>
import { useCustomerStore } from "~/store/customers";
import { useEstimateSheetStore } from "~/store/estimateSheets";
import { useTabsStore } from "~/store/tabs";
import { useEpicStore } from "~/store/epics";
import { useTaskStore } from "~/store/tasks";
import { useRiskProfileStore } from "~/store/riskProfiles";
import { useEstimateSheetRiskProfileStore } from "~/store/composites/estimateSheetRiskProfiles";
import { useEstimateSheetUserStore } from "~/store/composites/estimateSheetUsers";
import { useRoleStore } from "~/store/roles";
import { useEstimateSheetRoleStore } from "~/store/composites/estimateSheetRoles";

const customerStore = useCustomerStore();
const sheetStore = useEstimateSheetStore();
const tabStore = useTabsStore();
const epicStore = useEpicStore();
const taskStore = useTaskStore();
const riskProfileStore = useRiskProfileStore();
const roleStore = useRoleStore();
const sheetRiskProfileStore = useEstimateSheetRiskProfileStore();
const sheetUserStore = useEstimateSheetUserStore();
const sheetRoleStore = useEstimateSheetRoleStore();
const { $swal } = useNuxtApp();

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

const handleSubmit = async () => {
  if (!postData.sheet.SheetName) return alert("Sheet name missing");

  /* Set customer if selected */
  if (isCustomerSelected.value) {
    if (customerSelection.selected.id) {
      postData.sheet.customerId = customerSelection.selected.id;
    } else {
      const res = await customerStore.createCustomer(
        customerSelection.selected
      );
      if (!res)
        return $swal.fire({
          icon: "error",
          title: "Ups! Der skete en fejl.",
          text: `Estimat blev ikke oprettet.`,
        });

      postData.sheet.customerId =
        customerStore.CUSTOMERS[customerStore.CUSTOMERS.length - 1].id;
    }
  }

  const newSheet = await sheetStore.createEstimateSheet(postData.sheet);

  if (!newSheet.id)
    return $swal.fire({
      position: "center",
      icon: "error",
      title: `Der skete en fejl!`,
      text: `Estimat blev ikke oprettet.`,
      showConfirmButton: true,
    });

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

  /* Create connection between global sheet statuses and new sheet */
  const roles = [...roleStore.ROLES];

  const globalRoles = roles.filter((role) => {
    return role.global;
  });

  globalRoles.forEach((globalRole) => {
    const obj = {
      estimateSheetId: newSheet.id,
      roleId: globalRole.id,
    };
    sheetRoleStore.createEstimateSheetRole(obj);
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

  $swal.fire({
    position: "center",
    icon: "success",
    title: `Estimatark oprettet!`,
    showConfirmButton: false,
    timer: 1500,
  });

  tabStore.openTab(newSheet);
  await navigateTo(`/sheet/${newSheet.id}`);
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
      <h1>Nyt estimat</h1>
      <!-- Select project customer -->
      <div
        v-if="!isCustomerSelected"
        class="block__customer customer-selection"
      >
        <div class="block__customer-flex">
          <div>
            <Input
              class="customer-selection input__default"
              label="Kunde"
              type="search"
              v-model="searchTerm"
              ref="customerSearchInput"
              @focus="customerSelection.hidden = false"
              emit="customerSearch"
              @customerSearch="handleCustomerSearch"
            />

            <ul
              v-show="!customerSelection.hidden"
              class="customerList customer-selection"
            >
              <li
                v-for="customer in searchCustomers"
                @click="handleSelectCustomer(customer)"
              >
                {{ customer.customerName }}
              </li>
            </ul>
          </div>
          <Button
            :disabled="!validateNewCustomer"
            class="customer-selection"
            text="Opret kunde"
            @click.prevent="handleCreateCustomer(searchTerm)"
          />
        </div>
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
        class="input__default"
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
        class="input__default"
        label="Workbook"
        emit="workbook"
        @workbook="handleSetWorkbook"
        placeholder="Link til Workbook"
      />

      <Input
        class="input__default"
        label="Jira"
        emit="jira"
        @jira="handleSetJira"
        placeholder="Link til Jira"
      />

      <Input
        class="input__default"
        label="Wireframe"
        emit="wireframe"
        @wireframe="handleSetWireframe"
        placeholder="Link til wireframe"
      />
      <!-- <a
        href="https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=f0rb1sOMiQ9pPK860ygqqZ87hKHfHeyx&scope=read%3Ajira-work%20manage%3Ajira-project%20manage%3Ajira-configuration%20read%3Ajira-user%20write%3Ajira-work&redirect_uri=https%3A%2F%2Flocalhost%3A7087%2Fapi%2Fauth%2Fatlassian&state=${YOUR_USER_BOUND_VALUE}&response_type=code&prompt=consent"
        >Jira
      </a> -->

      <Button class="auth-cta" text="Opret estimatark" type="submit" />
    </form>

    <div>
      <h1>Skabelon</h1>
      <div class="block__select">
        <div
          :class="{ active: selectType.selected === 'empty' }"
          @click="handleSelectEmptySheet"
        >
          Tomt estimat
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
          Kopiér estimat
        </div>
      </div>

      <!-- Copy existing estimate sheet -->
      <div class="template" v-show="selectType.selected === 'template'">
        <h3>Benyt template:</h3>
      </div>

      <!-- Copy existing estimate sheet -->
      <div class="copy" v-show="selectType.selected === 'copy'">
        <h3>Kopiér eksisterende estimat:</h3>
        <ul class="copy__customers">
          <li class="copy__customer" v-for="customer in customers">
            <b>{{ customer.customerName }}</b>

            <ul
              v-if="customer.sheets && customer.sheets.length"
              class="copy__sheets"
            >
              <li class="copy__sheet" v-for="sheet in customer.sheets">
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
          <Button
            v-show="copyFromCustomer !== null"
            text="Fjern valgt estimat"
            @click="handleClearCopyCustomer"
          />
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.block {
  background: #fff;
  padding: 24px;
  border-radius: 3px;
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;

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
    position: relative;
    &-flex {
      display: grid;
      grid-template-columns: 1fr auto;
      align-items: center;
    }

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
      width: 100%;
      max-width: 520px;
      overflow-y: scroll;
      top: 4.3rem;

      li {
        cursor: pointer;
        padding: 4px;
        margin-bottom: 4px;

        &:hover {
          background: var(--color-background);
        }
      }
    }
  }
}

.copy {
  padding-top: 15px;

  h3 {
    margin-bottom: 0.6rem;
  }

  &__sheets {
    padding-left: 1rem;
  }
}

.template {
  padding-top: 15px;

  h3 {
    margin-bottom: 0.6rem;
  }
}
</style>
