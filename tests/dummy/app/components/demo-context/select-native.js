import Component from "@ember/component";
import { set, computed } from "@ember/object";

export default Component.extend({
  tagName: "",

  colors: computed(() => ["red", "blue", "green", "orange", "pink", "purple"]),
  users: computed(() => [
    { userId: "a1", name: "Tim Cook", company: "Apple" },
    { userId: "b2", name: "Satya Nadella", company: "Microsoft" },
    { userId: "c3", name: "Sundar Pichai", company: "Google" },
    { userId: "d4", name: "Mark Zuckerberg", company: "Facebook" },
    { userId: "e5", name: "Larry Gadea", company: "Envoy" }
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
