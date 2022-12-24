<script setup>
import { useTaskStore } from "~/store/tasks";
import { useRiskProfileStore } from "~/store/riskProfiles";
import { useRoleStore } from "~/store/roles";
import { useEpicStore } from "~/store/epics";
import { useEpicStatusStore } from "~/store/epicStatus";
import { useUserStore } from "~/store/users";
import { useDetailsStore } from "~/store/details";
import { useSheetStatusStore } from "~/store/sheetStatus";
import { useEstimateSheetStore } from "~/store/estimateSheets";
import { useJiraStore } from "~/store/jira";

const taskStore = useTaskStore();
const riskProfileStore = useRiskProfileStore();
const roleStore = useRoleStore();
const epicStore = useEpicStore();
const epicStatusStore = useEpicStatusStore();
const userStore = useUserStore();
const detailsStore = useDetailsStore();
const sheetStatusStore = useSheetStatusStore();
const sheetStore = useEstimateSheetStore();
const jiraStore = useJiraStore();

const { $swal } = useNuxtApp();
const route = useRoute();
const epics = ref([]);

const labels = reactive([]);
const datasets = reactive({
  realisticHours: {
    backgroundColor: [],
    data: [],
  },
  realisticPrice: {
    backgroundColor: [],
    data: [],
  },
  pessimisticHours: {
    backgroundColor: [],
    data: [],
  },
  pessimisticPrice: {
    backgroundColor: [],
    data: [],
  },
});

const totalEpicsRealisticHours = ref(0);
const totalEpicsRealisticPrice = ref(0);
const totalEpicsPessimisticHours = ref(0);
const totalEpicsPessimisticPrice = ref(0);
const totalOptOuts = ref(0);

onMounted(() => {
  detailsStore.setDetails(null);
  calculateOverview();
});

// onUnmounted(() => {
//   detailsStore.setDetailsChart({
//     labels: [],
//     datasets: {},
//   });
// }),
watch(
  () => [taskStore.TASKS.length, epicStore.EPICS.length],
  () => {
    calculateOverview();
  }
);

/* Update epic name, if updated in details store */
watch(
  () => [detailsStore.DETAILS?.epicName, detailsStore.DETAILS?.id],
  ([newEpicName, newEpicId], [oldEpicName, oldEpicId]) => {
    if (
      newEpicName &&
      oldEpicName &&
      newEpicName !== oldEpicName &&
      newEpicId === oldEpicId
    ) {
      epics.value.map((e) => {
        if (e.id === newEpicId) return (e.epicName = newEpicName);
      })[0];
    }
  }
);

const roundNearQtr = (number) => {
  return (Math.round(number * 4) / 4).toFixed(2);
};

const numberDotSeperator = (x) => {
  if (!x) return "0,00";
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const calculateOverview = () => {
  epics.value = [];
  const epicsForSheet = epicStore.EPICS.filter((epic) => {
    return epic.estimateSheetId == route.params.id && !epic.optOut;
  });

  epicsForSheet.forEach((e) => {
    let totalRealisticHours = 0;
    let totalPessimisticHours = 0;
    let totalRealisticPrice = 0;
    let totalPessimisticPrice = 0;

    const epic = {
      ...e,
      roles: [],
      optOuts: 0,
      uncertainty: 0,
      status: {},
      user: {},
    };

    let epicTasks = [];

    /* Get then set epic status */
    const epicStatus = epicStatusStore.EPIC_STATUS.filter((s) => {
      return s.id === e.epicStatusId;
    })[0];

    epic.status = epicStatus;

    /* Get then set user responsible for epic */
    if (epic.userId !== null) {
      const epicUser = userStore.USERS.filter((u) => {
        return u.id === e.userId;
      })[0];

      epic.user = epicUser;
    }

    /* Get tasks for epic */
    const tasksForEpic = taskStore.TASKS.filter((t) => {
      return t.epicId === e.id;
    });

    tasksForEpic.forEach((task) => {
      if (task.optOut) {
        epic.optOuts++;
      }
      const currentRiskProfile = riskProfileStore.RISK_PROFILES.filter((p) => {
        return p.id === task.riskProfileId;
      })[0];

      const currentRole = roleStore.ROLES.filter((r) => {
        return r.id === task.roleId;
      })[0];

      /* Realistic hours */
      task.realisticHours = parseFloat(
        roundNearQtr(
          task.hourEstimate * (1 + currentRiskProfile.percentage / 2 / 100)
        )
      );

      if (!task.optOut) totalRealisticHours += task.realisticHours;

      /* Realistic price */
      if (currentRole) {
        task.realisticPrice = parseFloat(
          currentRole.hourlyWage *
            task.hourEstimate *
            (1 + currentRiskProfile.percentage / 2 / 100)
        );

        if (!task.optOut) totalRealisticPrice += task.realisticPrice;
      }

      /* Pessimistic hours */
      task.pessimisticHours = parseFloat(
        roundNearQtr(
          task.hourEstimate * (1 + currentRiskProfile.percentage / 100)
        )
      );

      if (!task.optOut) totalPessimisticHours += task.pessimisticHours;

      /* Pessimistic price */
      if (currentRole) {
        task.pessimisticPrice = parseFloat(
          currentRole.hourlyWage *
            task.hourEstimate *
            (1 + currentRiskProfile.percentage / 100)
        );

        if (!task.optOut) totalPessimisticPrice += task.pessimisticPrice;
      }

      if (currentRole) {
        if (!epic.roles.some((role) => role.id === currentRole.id)) {
          epic.roles.push({ ...currentRole, tasks: [] });
        }
      } else {
        if (!epic.roles.some((role) => role.id === 0)) {
          epic.roles.push({ id: 0, roleName: "Ingen rolle", tasks: [] });
        } else {
          const unassignedRole = epic.roles.filter((r) => r.id === 0)[0];
          unassignedRole.tasks.push(task);
        }
      }

      if (!task.optOut) {
        totalEpicsRealisticHours.value += task.realisticHours ?? 0;
        totalEpicsRealisticPrice.value += task.realisticPrice ?? 0;
        totalEpicsPessimisticHours.value += task.pessimisticHours ?? 0;
        totalEpicsPessimisticPrice.value += task.pessimisticPrice ?? 0;
      } else {
        totalOptOuts.value++;
      }

      epicTasks.push(task);
    });

    /* Set tasks for epic roles */
    epic.roles.forEach((role) => {
      for (let i = 0; i < epicTasks.length; i++) {
        if (role.id == epicTasks[i].roleId) {
          if (!role.tasks.some((task) => task.id === epicTasks[i].id))
            role.tasks.push(epicTasks[i]);
        }
      }
    });

    /* ******** CHART JS *********** */
    /* ******** CHART JS *********** */
    epic.roles.forEach((role) => {
      role.optOuts = 0;
      let totalRealisticHours = 0;
      let totalRealisticPrice = 0;
      let totalPessimisticHours = 0;
      let totalPessimisticPrice = 0;
      role.tasks.forEach((task) => {
        if (task.optOut) return role.optOuts++;
        totalRealisticHours += task.realisticHours;
        totalRealisticPrice += task.realisticPrice;
        totalPessimisticHours += task.pessimisticHours;
        totalPessimisticPrice += task.pessimisticPrice;
      });
      role.totalRealisticHours = totalRealisticHours;
      role.totalRealisticPrice = totalRealisticPrice;
      role.totalPessimisticHours = totalPessimisticHours;
      role.totalPessimisticPrice = totalPessimisticPrice;

      const index = labels.findIndex((label) => label == role.roleName);
      if (index > -1) {
        datasets.realisticHours.data[index] += totalRealisticHours;
        datasets.realisticPrice.data[index] += totalRealisticPrice;
        datasets.pessimisticHours.data[index] += totalPessimisticHours;
        datasets.pessimisticPrice.data[index] += totalPessimisticPrice;
      } else {
        const color = `#${((Math.random() * 0xffffff) << 0)
          .toString(16)
          .padStart(6, "0")}`;
        labels.push(role.roleName);

        datasets.realisticHours.backgroundColor.push(color);
        datasets.realisticPrice.backgroundColor.push(color);
        datasets.pessimisticHours.backgroundColor.push(color);
        datasets.pessimisticPrice.backgroundColor.push(color);

        datasets.realisticHours.data.push(totalRealisticHours);
        datasets.realisticPrice.data.push(totalRealisticPrice);
        datasets.pessimisticHours.data.push(totalPessimisticHours);
        datasets.pessimisticPrice.data.push(totalPessimisticPrice);
      }
    });
    /* Chart js data structure */
    // data = {
    //   labels: ["VueJs", "EmberJs", "ReactJs", "AngularJs"],
    //   datasets: [
    //     {
    //       backgroundColor: ["#41B883", "#E46651", "#00D8FF", "#DD1B16"],
    //       data: [40, 20, 80, 10],
    //     },
    //   ],
    // };
    /* ******** CHART JS *********** */
    /* ******** CHART JS *********** */

    epic.totalRealisticHours = totalRealisticHours;
    epic.totalPessimisticHours = totalPessimisticHours;
    epic.totalRealisticPrice = totalRealisticPrice;
    epic.totalPessimisticPrice = totalPessimisticPrice;
    epics.value.push(epic);
  });

  detailsStore.setDetailsChart({ labels, datasets });
};

const handleCreateEpic = async () => {
  const firstDefaultEpicStatus = epicStatusStore.EPIC_STATUS.filter(
    (status) => {
      return status.default;
    }
  )[0];

  if (!firstDefaultEpicStatus)
    return $swal.fire(
      "Der skete en fejl.",
      "Der findes endnu ingen epic status. Opret en epic status og prøv igen.",
      "warning"
    );

  const obj = {
    epicName: "Ny Epic",
    estimateSheetId: parseInt(route.params.id),
    epicStatusId: firstDefaultEpicStatus.id,
  };

  const newEpic = await epicStore.createEpic(obj);

  if (!newEpic)
    return $swal.fire(
      "Ups! Der skete en fejl.",
      "Epic blev ikke oprettet.",
      "error"
    );

  const firstGlobalRiskProfile = riskProfileStore.RISK_PROFILES.filter(
    (profile) => {
      return profile;
    }
  )[0];

  if (!firstGlobalRiskProfile)
    return $swal.fire(
      "Der skete en fejl.",
      "Der findes endnu ingen globale risikoprofiler. Opret en global risikoprofil og prøv igen.",
      "warning"
    );

  const newTask = {
    parentId: 0,
    taskName: "Ny task",
    hourEstimate: 0,
    estimateReasoning: "Begrundelse for estimat...",
    optOut: false,
    taskDescription: "Beskrivelse...",
    epicId: newEpic.id,
    roleId: 0,
    riskProfileId: firstGlobalRiskProfile.id,
  };

  await taskStore.createTask(newTask);
};

const handleUpdateSheetStatusId = ({ id }) => {
  const updatedSheet = {
    ...sheetStore.CURRENT_ESTIMATE_SHEET,
    sheetStatusId: id,
  };
  sheetStore.updateEstimateSheet(updatedSheet);
};

const sheetStatusOption = computed(() => {
  return sheetStatusStore.SHEET_STATUS.map((status) => {
    return { id: status.id, name: status.sheetStatusName };
  });
});

const currentSheetStatus = computed(() => {
  return sheetStatusStore.SHEET_STATUS.filter((status) => {
    return status.id === sheetStore.CURRENT_ESTIMATE_SHEET?.sheetStatusId;
  })[0];
});

const currentSheetName = computed(() => {
  return sheetStore.ESTIMATE_SHEETS.find((sheet) => {
    return sheet.id === parseInt(route.params.id);
  }).sheetName;
});

/* CSV EXPORT */
const exportCsv = () => {
  if (epics.value.length < 1)
    return $swal.fire(
      "Der skete en fejl.",
      "Estimatarket er tomt. Eksportéring kræver minimum én epic. ",
      "warning"
    );

  const csvContent = [
    [
      "Epic navn",
      "Timer (Realistisk)",
      "Pris (Realistisk)",
      "Timer (Pessimistisk)",
      "Pris (Pessimistisk)",
    ],
    ...epics.value.map((epic) => [
      epic.epicName,
      epic.totalRealisticHours,
      epic.totalRealisticPrice,
      epic.totalPessimisticHours,
      epic.totalPessimisticPrice,
    ]),
  ]
    .map((e) => e.join(","))
    .join("\n");

  // The download function takes a CSV string, the filename and mimeType as parameters
  const download = (content, fileName, mimeType) => {
    var a = document.createElement("a");
    mimeType = mimeType || "application/octet-stream";

    if (navigator.msSaveBlob) {
      // IE10
      navigator.msSaveBlob(
        new Blob([content], {
          type: mimeType,
        }),
        fileName
      );
    } else if (URL && "download" in a) {
      //html5 A[download]
      a.href = URL.createObjectURL(
        new Blob([content], {
          type: mimeType,
        })
      );
      a.setAttribute("download", fileName);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      location.href =
        "data:application/octet-stream," + encodeURIComponent(content);
    }
  };

  $swal
    .fire({
      title: "Eksportér CSV",
      text: "Vil du downloade estimat arket som CSV?",
      showCancelButton: true,
      confirmButtonText: "Download",
    })
    .then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        download(
          csvContent,
          `estimat_${currentSheetName.value}.csv`,
          "text/csv;encoding:utf-8"
        );
      }
    });
};

const handleJiraSync = () => {
  let options = {};
  let project;
  jiraStore.PROJECTS.map((o) => {
    options[o.id] = o.name;
  });

  $swal
    .fire({
      title: "Vælg Jira projekt",
      input: "select",
      inputOptions: options,
      showCancelButton: true,
      confirmButtonText: "Synkronisér",
      showLoaderOnConfirm: true,
      preConfirm: async (option) => {
        project = jiraStore.PROJECTS.find((p) => p.id == option);

        try {
          await $fetch(project.self, {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${jiraStore.JIRA_API_TOKEN}`,
            },
          }).then(async (data) => {
            await jiraStore.syncJira(parseInt(route.params.id), data);
          });
        } catch (e) {
          return console.log("ERROR", e);
        }
      },
      allowOutsideClick: () => !$swal.isLoading(),
    })
    .then((result) => {
      if (result.isConfirmed) {
        $swal.fire({
          icon: "success",
          title: `Synkroniséring fuldført!`,
          html: `<p>Se ændringerne på <a class="sweetalert-link" href="${jiraStore.CLOUD_ID.url}/browse/${project.key}" target="_blank">${project.name}</a></p>`,
        });
      }
    });
};

const handleCreateJiraProject = () => {
  let projectName;
  let projectKey;
  $swal
    .fire({
      title: "Nyt Jira projekt",
      html: `<input type="text" id="name" class="swal2-input" placeholder="Indtast projekt navn">
  <input type="text" id="key" class="swal2-input" placeholder="Indtast projekt nøgle">`,
      confirmButtonText: "Opret",
      showCancelButton: true,
      focusConfirm: false,
      preConfirm: () => {
        projectName = $swal.getPopup().querySelector("#name").value;
        projectKey = $swal.getPopup().querySelector("#key").value.toUpperCase();
        if (!projectName || !projectKey) {
          $swal.showValidationMessage(`Udfyld venligst både navn og nøgle`);
        }
        return { projectName, projectKey };
      },
    })
    .then(async (result) => {
      if (!result.isConfirmed) return;

      $swal.fire({
        title: "Opretter Jira projekt...",
        text: "Læn dig tilbage og ta' en slapper😎",
        allowOutsideClick: false,
        timerProgressBar: true,
        didOpen: async () => {
          $swal.showLoading();

          const res = await jiraStore.createProject(
            result.value.projectName,
            result.value.projectKey
          );

          console.log("res", res);

          if (!res)
            return $swal.fire({
              icon: "error",
              title: `Ups... Noget gik galt!`,
              text: `Jira projektet blev ikke oprettet. Prøv igen.`,
            });

          return $swal.fire({
            icon: "success",
            title: `Jira projekt oprettet!`,
            html: `<p>Projektet '${result.value.projectName}' blev oprettet. Se projektet <a class="sweetalert-link" href="${jiraStore.CLOUD_ID.url}/browse/${projectKey}" target="_blank">her.</a></p>`,
          });
        },
      });
    });
};
</script>

<template>
  <div class="overview">
    <div class="overview__header">
      <div class="overview__header-flex">
        <h1>Overblik</h1>

        <div>
          <Button
            text="Exportér CSV"
            icon="icon-export"
            @click="exportCsv"
            class="cta"
          />

          <div>
            <div
              v-if="
                jiraStore.JIRA_API_TOKEN && jiraStore.JIRA_API_TOKEN.length > 0
              "
            >
              <Button text="Synkronisér med Jira" @click="handleJiraSync" />
              <Button
                text="Nyt Jira projekt"
                @click="handleCreateJiraProject"
              />
            </div>
            <a
              v-else
              href="https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=f0rb1sOMiQ9pPK860ygqqZ87hKHfHeyx&scope=read%3Ajira-work%20manage%3Ajira-project%20manage%3Ajira-configuration%20read%3Ajira-user%20write%3Ajira-work&redirect_uri=https%3A%2F%2Flocalhost%3A7087%2Fapi%2Fauth%2Fatlassian&state=${YOUR_USER_BOUND_VALUE}&response_type=code&prompt=consent"
            >
              Forbind Jira
            </a>
          </div>
        </div>
      </div>
      <Input
        class="input__select--overview-status"
        type="select"
        :placeholder="
          currentSheetStatus?.sheetStatusName
            ? currentSheetStatus.sheetStatusName
            : 'Vælg status'
        "
        :options="sheetStatusOption"
        emit="updateSheetStatusId"
        @updateSheetStatusId="handleUpdateSheetStatusId"
      />

      <div class="table__header">
        <div class="table__col">
          <div class="table__heading--details"></div>
        </div>

        <div class="table__col">
          <span class="table__heading--name"> Epic navn </span>
        </div>

        <div class="table__header--realistic">
          <div class="table__col">
            <span class="table__heading--hours"> Timer </span>
          </div>
          <div class="table__col">
            <span class="table__heading--price"> Pris DKK </span>
          </div>
        </div>

        <div class="table__header--pessimistic">
          <div class="table__col">
            <span class="table__heading--hours"> Timer </span>
          </div>
          <div class="table__col">
            <span class="table__heading--price"> Pris DKK </span>
          </div>
        </div>

        <div class="table__col">
          <span class="table__heading--opt-out"> Fravalgt </span>
        </div>

        <div class="table__col">
          <span class="table__heading--status"> Status </span>
        </div>

        <div class="table__col">
          <span class="table__heading--responsible"> Ansvarlig </span>
        </div>

        <div class="table__col">
          <span class="table__heading--insecurity"> Usikkerhed </span>
        </div>
      </div>
    </div>

    <div class="table">
      <OverviewEpic
        v-for="epic in epics"
        :key="epic.id"
        :id="epic.id"
        :name="epic.epicName"
        :comment="epic.comment"
        :totalRealisticHours="epic.totalRealisticHours"
        :totalRealisticPrice="epic.totalRealisticPrice"
        :totalPessimisticHours="epic.totalPessimisticHours"
        :totalPessimisticPrice="epic.totalPessimisticPrice"
        :optOuts="epic.optOuts"
        :status="epic.status"
        :tasks="epic.tasks"
        :role="epic.role"
        :roles="epic.roles"
        :userId="epic.userId"
        :user="epic.user"
      />
    </div>

    <div class="table__footer overview__footer">
      <div class="table__col table__col--button">
        <Button
          class="new-epic"
          text="Tilføj epic"
          icon="icon-plus"
          @click="handleCreateEpic"
        />
      </div>

      <div class="table__footer--realistic">
        <div class="table__col">
          <span class="table__sum--hours">
            {{
              numberDotSeperator(
                totalEpicsRealisticHours.toFixed(2).replace(".", ",")
              )
            }}
          </span>
        </div>
        <div class="table__col">
          <span class="table__sum--price">
            {{
              numberDotSeperator(
                totalEpicsRealisticPrice.toFixed(2).replace(".", ",")
              )
            }}
          </span>
        </div>
      </div>

      <div class="table__footer--pessimistic">
        <div class="table__col">
          <span class="table__sum--hours">
            {{
              numberDotSeperator(
                totalEpicsPessimisticHours.toFixed(2).replace(".", ",")
              )
            }}
          </span>
        </div>
        <div class="table__col">
          <span class="table__sum--price">
            {{
              numberDotSeperator(
                totalEpicsPessimisticPrice.toFixed(2).replace(".", ",")
              )
            }}
          </span>
        </div>
      </div>

      <div class="table__col">
        <span class="table__sum--opt-out"> {{ totalOptOuts }} </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.overview {
  h1 {
    padding-left: 10px;
  }
  &__header {
    padding-top: 20px;
    position: sticky;
    top: -20px;
    background: var(--color-background);
    z-index: 1;

    &-flex {
      display: flex;
      justify-content: space-between;

      button {
        border-radius: 4px;
        outline: none;
        border: none;
        padding: 0 5px;
        margin: 0;
        display: flex;
        gap: 10px;
      }
    }
  }
  &__footer {
    padding-bottom: 20px;
    position: sticky;
    bottom: -20px;
    background: var(--color-background);
    z-index: 2;
  }
}
.table {
  display: grid;
  gap: var(--table-gap);

  &__col {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: var(--table-columns-padding);

    &--button {
      display: block;
      grid-column: span 2;
    }
  }

  &__header {
    width: 100%;
    display: grid;
    grid-template-columns: var(--table-columns-overview);
    color: var(--font-color-primary);
    font-weight: 600;
    padding-right: calc(
      var(--width-icon) + var(--table-columns-padding) / 2 +
        var(--input-padding) / 2
    );
    padding-top: 15px;

    span {
      display: block;
    }
    &--realistic,
    &--pessimistic {
      display: flex;
      grid-column: span 2;
      position: relative;
    }
    &--realistic {
      &::before {
        content: "Realistisk";
        position: absolute;
        bottom: 45px;
        width: 100%;
        display: flex;
        justify-content: center;
        opacity: 0.5;
      }
    }
    &--pessimistic {
      &::before {
        content: "Pessimistisk";
        position: absolute;
        bottom: 45px;
        width: 100%;
        display: flex;
        justify-content: center;
        opacity: 0.5;
      }
    }
  }

  &__heading,
  &__sum {
    &--details {
      width: calc(var(--width-icon) + var(--table-columns-padding) * 12);
    }
    &--name {
      width: 100%;
      padding-left: var(--input-padding);
    }
    &--hours {
      width: var(--width-hours-overview);
      text-align: right;
      margin: var(--input-padding);
    }
    &--price {
      width: var(--width-price-overview);
      text-align: right;
      margin: var(--input-padding);
    }
    &--opt-out {
      width: var(--width-opt-out);
      text-align: center;
      margin: var(--input-padding);
    }
    &--status {
      width: var(--width-status-overview);
      padding-left: var(--input-padding);
    }
    &--responsible {
      width: var(--width-responsible-overview);
      padding-left: var(--input-padding);
    }
    &--insecurity {
      width: var(--width-insecurity-overview);
      text-align: center;
      margin: var(--input-padding);
    }
  }
  &__footer {
    width: 100%;
    display: grid;
    grid-template-columns: var(--table-columns-overview);
    color: var(--font-color-primary);
    font-weight: 600;
    padding-right: calc(
      var(--width-icon) + var(--table-columns-padding) / 2 +
        var(--input-padding) / 2 + 412px
    );
    margin-top: var(--table-gap);

    &--realistic,
    &--pessimistic {
      display: flex;
      grid-column: span 2;
      position: relative;
      color: var(--font-color-secondary);
      font-weight: 600;
      text-decoration: underline;
    }
    &--realistic {
      background-color: var(--color-realistic);
    }
    &--pessimistic {
      background-color: var(--color-pessimistic);
    }
  }
}
</style>
