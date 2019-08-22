import Component from "@ember/component";
import { set, computed } from "@ember/object";

export default Component.extend({
  tagName: "",

  userOptions: null,
  colors: computed(() => ["red", "blue", "green", "orange", "pink", "purple"]),
  users: computed(() => [
    { id: "a1", name: "Tim Cook", company: "Apple" },
    { id: "b2", name: "Satya Nadella", company: "Microsoft" },
    { id: "c3", name: "Sundar Pichai", company: "Google" },
    { id: "d4", name: "Mark Zuckerberg", company: "Facebook" },
    { id: "e5", name: "Larry Gadea", company: "Envoy" }
  ]),

  currentColor: "red",
  currentUser: null,

  actions: {
    changeColor(color) {
      set(this, "currentColor", color);
    },
    changeUser(user) {
      set(this, "currentUser", user);
    },
    filterOptions(query) {
      let options = this.users.filter(user =>
        user.name.toLowerCase().includes(query.toLowerCase())
      );
      this.set("userOptions", options);
    },
    validateUser(name) {
      return this.users.some(user => user.name === name);
    }
  }
});
