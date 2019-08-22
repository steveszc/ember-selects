import Component from "@ember/component";
import { set, computed } from "@ember/object";

export default Component.extend({
  tagName: "",

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
    }
  }
});
