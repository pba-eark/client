const env = process.env.NODE_ENV || "development";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  // app: {
  //     head: {
  //         meta: [
  //             { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  //         ],
  //     },
  // },
  // ssr: false,
  app: {
    pageTransition: { name: "page", mode: "out-in" },
  },
  modules: [
    [
      "@pinia/nuxt",
      {
        autoImports: [
          // automatically imports `defineStore`
          "defineStore", // import { defineStore } from 'pinia'
          // automatically imports `defineStore` as `definePiniaStore`
          ["defineStore", "definePiniaStore"], // import { defineStore as definePiniaStore } from 'pinia'
        ],
      },
    ],
  ],
  build: {
    transpile: ["chart.js"],
  },
  runtimeConfig: {
    // The private keys which are only available within server-side
    apiSecret: "123",
    // Keys within public, will be also exposed to the client-side
    public: {
      API_URL:
        env === "development"
          ? "https://localhost:7087/api"
          : "https://estimatarkapi.azurewebsites.net/api",
    },
  },

  pages: true,

  // serverHandlers: [
  //     { route: '*', handler: 'middleware/index.js' }
  // ],

  alias: {
    "@": "/<rootDir>",
  },

  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],

  css: ["assets/scss/main.scss"],
});
