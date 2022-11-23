import { defineStore } from "pinia";

export const useJiraStore = defineStore("jira-store", () => {
  /* State */
  const jwt = ref("");

  /* Actions */
  const setJwt = (token) => {
    jwt.value = token;
    localStorage.setItem("jira", token);
  };

  const getCloudIds = async () => {
    if (!jwt.value) return console.log("No access token!");

    const cloudIds = await $fetch(
      "https://api.atlassian.com/oauth/token/accessible-resources",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt.value}`,
        },
      }
    );

    console.log(cloudIds);
  };
  /* Getters */
  const JIRA_API_TOKEN = computed(() => jwt.value);

  return {
    JIRA_API_TOKEN,
    setJwt,
    getCloudIds,
  };
});
