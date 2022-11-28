import { defineStore } from "pinia";

export const useJiraStore = defineStore("jira-store", () => {
  /* State */
  const jwt = ref("");
  const cloudIds = ref([]);
  const projects = ref([]);

  /* Actions */
  const setJwt = async (token) => {
    jwt.value = token;
    localStorage.setItem("jira", token);

    await getCloudIds(token);
    await getProjects(cloudIds.value[0], token);
  };

  const setCloudIds = (clouds) => {
    cloudIds.value = clouds;
    console.log("Jira clouds set", clouds);
  };

  const setProjects = (arr) => {
    projects.value = arr;
    console.log("Jira projects set", projects.value);
  };

  const getCloudIds = async (token) => {
    if (!token) return console.log("No access token!");

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

    return setCloudIds(cloudIds);
  };

  const getProjects = async ({ id }, token) => {
    fetch(`https://api.atlassian.com/ex/jira/${id}/rest/api/2/project`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setProjects(data);
      });
  };

  /* Getters */
  const JIRA_API_TOKEN = computed(() => jwt.value);

  return {
    JIRA_API_TOKEN,
    setJwt,
    getCloudIds,
  };
});
