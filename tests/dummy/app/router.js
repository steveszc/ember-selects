import AddonDocsRouter, { docsRoute } from "ember-cli-addon-docs/router";
import config from "./config/environment";

const Router = AddonDocsRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  docsRoute(this, function() {
    this.route("quickstart");
    this.route("patterns", function() {
      this.route("native");
      this.route("custom-options");
      this.route("time-picker");
      this.route("multiple-selections");
      this.route("autocomplete");
      this.route("action-menu");
      this.route("standalone-select");
    });
    this.route("components", function() {
      this.route("select-native");
      this.route("select-listbox");
      this.route("select-combobox");
      this.route("select-menu");
    });
  });
  this.route("not-found", { path: "/*path" });
});

export default Router;
