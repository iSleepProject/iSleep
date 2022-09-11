import { createSSRApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import Bus from "@/api/bus";
export function createApp() {
  const app = createSSRApp(App);
  app.use(createPinia());
  app.config.globalProperties.$bus = Bus;
  return {
    app,
  };
}
