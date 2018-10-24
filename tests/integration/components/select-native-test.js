import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { find, findAll, render } from "@ember/test-helpers";
import hbs from "htmlbars-inline-precompile";

module("Integration | Component | select-native", function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.set("options", ["red", "blue"]);
    this.set("option", "red");
  });

  test("it renders a select element with options", async function(assert) {
    await render(
      hbs`{{select-native options=options selected=option onchange=changeOption}}`
    );

    assert.ok(find("select"));
    assert.equal(findAll("option").length, 2);

    // Template block usage:
    await render(hbs`
      {{#select-native options=options selected=option onchange=changeOption as |option|}}
        color: {{option}}
      {{/select-native}}
    `);

    assert.ok(find("select"));
    assert.equal(findAll("option").length, 2);
    assert.equal(find("option").textContent.trim(), "color: red");
  });
});
