import { defineStore } from "pinia";
export default defineStore("user", {
  state() {
    return {
      account: "",
      name: "",
      token: "",
      desc: "",
      pic_src: "",
      fileId: "",
      love: [],
    };
  },
  actions: {
    update(type, val) {
      if (type === "name") {
        this.name = val;
      }
      if (type === "desc") {
        this.desc = val;
      }
    },
  },
});
