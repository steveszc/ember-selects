import hbs from "htmlbars-inline-precompile";
import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import {
  click,
  fillIn,
  find,
  blur,
  render,
  triggerKeyEvent
} from "@ember/test-helpers";

const COLORS = ["red", "orange", "yellow"];
const KEY = {
  EVENT: "keydown",
  UP: "ArrowUp",
  DOWN: "ArrowDown",
  ENTER: "Enter",
  ESCAPE: "Escape"
};

const getActivedescendant = () =>
  find('[role="combobox"]').getAttribute("aria-activedescendant");

module("Integration | Component | ComboBox", function(hooks) {
  setupRenderingTest(hooks);

  test("Clicking around", async function(assert) {
    assert.expect(11);
    this.set("colors", COLORS);
    this.set("setColor", color => {
      this.set("color", color);
    });

    await render(
      hbs`<SelectCombobox
            @options={{this.colors}}
            @selected={{this.color}}
            @onSelect={{action this.setColor}}
            as |option|
          >
            {{option}}
          </SelectCombobox>`
    );
    assert.dom('[role="combobox"]').hasValue("", "input is initially empty");
    assert.dom('[role="option"]').doesNotExist("no options are visible");

    await click('[role="combobox"]');

    assert
      .dom('[role="option"][aria-selected="false"]')
      .exists({ count: 3 }, "after clicking input, options are visible");
    assert
      .dom('[aria-selected="true"]')
      .doesNotExist("no options are initially selected");

    await click('[role="option"]:first-of-type');

    assert
      .dom('[role="combobox"]')
      .hasValue(COLORS[0], "clicking the first value selects the first option");

    await click('[role="combobox"]');

    assert
      .dom('[role="option"][aria-selected="false"]')
      .exists(
        { count: 2 },
        "after making a selection there are 6 unselected options"
      );
    assert
      .dom('[role="option"]:first-of-type')
      .hasAttribute(
        "aria-selected",
        "true",
        "after making a selection, one option is selected"
      );

    await click('[role="option"]:last-of-type');

    assert
      .dom('[role="combobox"]')
      .hasValue(
        COLORS[COLORS.length - 1],
        "clicking the last option updates the selection"
      );

    await click('[role="combobox"]');

    assert
      .dom('[role="option"][aria-selected="false"]')
      .exists(
        { count: 2 },
        "after making a second selection, there are still 6 unselected options"
      );
    assert
      .dom('[role="option"]:last-of-type')
      .hasAttribute(
        "aria-selected",
        "true",
        "after making a second selection, the last option is selected"
      );

    await blur();
    assert
      .dom('[role="option"]')
      .doesNotExist("after blur, the options are hidden");
  });

  test("Typing a value", async function(assert) {
    assert.expect(9);
    this.set("colors", COLORS);
    this.set("onInput", color => {
      assert.ok(true, "onInput action called");
      this.set("color", color);
      return color.toLowerCase(); // closure action can talk back, e.g. enhance input
    });
    this.set("setColor", color => this.set("color", color));
    this.set("color", "orange");

    await render(
      hbs`<SelectCombobox
            @options={{this.colors}}
            @selected={{this.color}}
            @onInput={{action this.onInput}}
            @onSelect={{action this.setColor}}
            as |option|
          >
            {{option}}
          </SelectCombobox>`
    );

    await click('[role="combobox"]');
    assert
      .dom('[role="combobox"]')
      .hasValue("orange", "input shows the initial value orange");
    await fillIn('[role="combobox"]', "bl");
    assert.equal(
      this.get("color"),
      "bl",
      "color updates as backspace is pressed"
    );
    await fillIn('[role="combobox"]', "");
    assert
      .dom('[role="combobox"]')
      .hasValue("", "input is empty after backspacing");
    await fillIn('[role="combobox"]', "Red");
    assert
      .dom('[role="combobox"]')
      .hasValue("red", "input is updated after typing");
    assert.equal(
      this.get("color"),
      "red",
      "color updates after new value is typed"
    );
    assert
      .dom('[role="option"][aria-selected="true"]')
      .hasText("red", "the typed color is now the selected option");
  });

  test("Typing a value with a validator", async function(assert) {
    assert.expect(9);
    this.set("colors", COLORS);
    this.set("color", "orange");
    this.set("setColor", color => this.set("color", color));
    this.set("validateColor", color => COLORS.includes(color));

    await render(
      hbs`<SelectCombobox
            @options={{this.colors}}
            @selected={{this.color}}
            @validateUserInput={{action this.validateColor}}
            @onSelect={{action this.setColor}}
            as |option|
          >
            {{option}}
          </SelectCombobox>`
    );

    await click('[role="combobox"]');
    assert
      .dom('[role="combobox"]')
      .hasValue("orange", "input shows the initial value orange");
    await fillIn('[role="combobox"]', "oran");
    assert.equal(
      this.get("color"),
      "orange",
      "color does not update to an invalid color"
    );
    await fillIn('[role="combobox"]', "");
    assert
      .dom('[role="combobox"]')
      .hasValue("", "input is empty after backspacing");
    assert.equal(
      this.get("color"),
      "orange",
      "color does not update to an empty string"
    );
    await fillIn('[role="combobox"]', "red");
    assert.dom('[role="combobox"]').hasValue("red", "input is updated");
    assert.equal(
      this.get("color"),
      "red",
      "color updates after new valid value is typed"
    );
    assert
      .dom('[role="option"][aria-selected="true"]')
      .hasText("red", "the typed color is now the selected option");
    await fillIn('[role="combobox"]', "r");
    await blur();
    assert
      .dom('[role="combobox"]')
      .hasValue(
        "red",
        "invalid input is reverted to previous selection on blur"
      );
    assert.equal(
      this.get("color"),
      "red",
      "the selection remains valid when bluring an invalid input"
    );
  });

  test("Keyboard navigation", async function(assert) {
    assert.expect(16);
    this.set("color", "red");
    this.set("colors", COLORS);
    this.set("setColor", color => this.set("color", color));

    await render(
      hbs`<SelectCombobox
            @options={{this.colors}}
            @selected={{this.color}}
            @onSelect={{action this.setColor}}
            as |option|
          >
            {{option}}
          </SelectCombobox>`
    );
    await click('[role="combobox"]'); // focus doesn't seem to trigger the focusIn handler here, but click does
    assert
      .dom('[role="combobox"]')
      .hasValue("red", "input shows the initial value");
    assert
      .dom('[role="option"]')
      .exists({ count: 3 }, "all options are shown upon focusing");

    await triggerKeyEvent('[role="combobox"]', KEY.EVENT, KEY.DOWN);

    assert
      .dom(`#${getActivedescendant()}`)
      .hasText("red", "down arrow changes activedescendant");
    await triggerKeyEvent('[role="combobox"]', KEY.EVENT, KEY.DOWN);
    assert
      .dom(`#${getActivedescendant()}`)
      .hasText("orange", "down arrow changes activedescendant again");
    await triggerKeyEvent('[role="combobox"]', KEY.EVENT, KEY.ENTER);
    assert
      .dom('[role="combobox"]')
      .hasValue("orange", "pressing enter updates the selection");
    assert
      .dom('[role="option"]')
      .doesNotExist("pressing enter hides the options");

    await focus('[role="combobox"]');
    await triggerKeyEvent('[role="combobox"]', KEY.EVENT, KEY.DOWN);
    await triggerKeyEvent('[role="combobox"]', KEY.EVENT, KEY.UP);
    assert
      .dom('[role="option"][aria-selected="false"]')
      .exists(
        { count: 2 },
        "options are shown after pressing enter and refocusing"
      );
    assert
      .dom('[role="option"][aria-selected="true"]')
      .hasText(
        "orange",
        "the selected option is selected after pressing enter and refocusing"
      );

    await triggerKeyEvent('[role="combobox"]', KEY.EVENT, KEY.ESCAPE);
    assert
      .dom('[role="option"]')
      .doesNotExist("after pressing escape there are no options shown");
    assert
      .dom('[role="combobox"]')
      .hasValue(
        "orange",
        "after pressing escape the input has the previous selection value"
      );

    await focus('[role="combobox"]');
    await triggerKeyEvent('[role="combobox"]', KEY.EVENT, KEY.DOWN);
    assert
      .dom(`#${getActivedescendant()}`)
      .hasText("orange", "down arrow changes activedescendant");
    await triggerKeyEvent('[role="combobox"]', KEY.EVENT, KEY.DOWN);
    assert
      .dom(`#${getActivedescendant()}`)
      .hasText("yellow", "down arrow changes activedescendant");
    await triggerKeyEvent('[role="combobox"]', KEY.EVENT, KEY.UP);
    assert
      .dom(`#${getActivedescendant()}`)
      .hasText("orange", "up arrow changes activedescendant");
    await triggerKeyEvent('[role="combobox"]', KEY.EVENT, KEY.UP);
    assert
      .dom(`#${getActivedescendant()}`)
      .hasText("red", "up arrow changes activedescendant again");

    assert.equal(
      find(`#${getActivedescendant()}`),
      document.activeElement,
      "the activedescendent is focused"
    );
    await triggerKeyEvent('[role="combobox"]', KEY.EVENT, KEY.UP);
    assert.equal(
      find(`[role="combobox"]`),
      document.activeElement,
      "after up arrow on first option, the input is focused"
    );
  });
});
