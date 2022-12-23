import { defineStore } from "pinia";
import { useEpicStore } from "./epics";
import { useTaskStore } from "./tasks";

export const useJiraStore = defineStore("jira-store", () => {
  const epicStore = useEpicStore();
  const taskStore = useTaskStore();

  /* State */
  const jwt = ref("");
  const cloudIds = ref([]);
  const projects = ref([]);

  /* Actions */
  const setJwt = async (token) => {
    jwt.value = token;
    localStorage.setItem("jira", token);

    const cloudIdsRes = await getCloudIds(token);
    if (cloudIdsRes) await getProjects(cloudIds.value[0], token);
  };

  const resetJira = () => {
    jwt.value = "";
    cloudIds.value = [];
    projects.value = [];
    if (localStorage.getItem("jira")) localStorage.removeItem("jira");
  };

  const setCloudIds = (payload) => {
    cloudIds.value = payload;
    console.log("Jira clouds set", payload);
  };

  const setProjects = (payload) => {
    projects.value = payload;
    console.log("Jira projects set", projects.value);
  };

  const getCloudIds = async (token) => {
    if (!token) return console.log("No access token!");

    try {
      const cloudIds = await $fetch(
        "https://api.atlassian.com/oauth/token/accessible-resources",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCloudIds(cloudIds);
      return true;
    } catch (e) {
      console.log("ERROR", e);
      resetJira();
    }
  };

  const getProjects = async ({ id }, token) => {
    try {
      $fetch(`https://api.atlassian.com/ex/jira/${id}/rest/api/2/project`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).then((data) => {
        setProjects(data);
        return true;
      });
    } catch (e) {
      console.log("ERROROOR", e);
      resetJira();
    }
  };

  /* Sync Jira Issues */
  const syncJira = (sheetId, project) => {
    const sheetEpics = epicStore.EPICS.filter((e) => {
      return e.estimateSheetId == sheetId;
    });

    const tasks = [];

    sheetEpics.forEach((e) => {
      const epicTasks = taskStore.TASKS.filter((t) => {
        return t.epicId === e.id;
      });

      epicTasks.forEach((t) => {
        if (t.optOut) return;
        tasks.push(t);
      });
    });

    tasks.forEach((t) => {
      const requestBody = `{
        "update": {},
        "fields": {
          "summary": "${t.taskName}",
          "issuetype": {
            "id": "${project.issueTypes[0].id}"
          },
          "project": {
            "id": "${project.id}"
          },
          "description": {
            "type": "doc",
            "version": 1,
            "content": [
              {
                "type": "paragraph",
                "content": [
                  {
                    "text": "${t.taskDescription}",
                    "type": "text"
                  }
                ]
              }
            ]
          }
        }
      }`;

      $fetch(
        `https://api.atlassian.com/ex/jira/${CLOUD_ID.value.id}/rest/api/3/issue/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${JIRA_API_TOKEN.value}`,
          },
          body: requestBody,
        }
      ).then((data) => {
        console.log("added issue!", data);
      });
    });

    return true;
  };

  /* Getters */
  const JIRA_API_TOKEN = computed(() => jwt.value);
  const CLOUD_ID = computed(() => cloudIds.value[0]);
  const PROJECTS = computed(() => projects.value);

  return {
    JIRA_API_TOKEN,
    setJwt,
    getCloudIds,
    CLOUD_ID,
    PROJECTS,
    syncJira,
  };
});
