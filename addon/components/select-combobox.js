import Component from "@ember/component";
import { computed, get, set } from "@ember/object";
import { dasherize } from "@ember/string";
import { scheduleOnce } from "@ember/runloop";
import layout from "../templates/components/select-combobox";

const id = (parentId, child) => `${parentId}-${child.id || dasherize(child)}`;

export default Component.extend({
  layout,

  // props w/ default values
  activeOptionClass: "",
  ariaLabel: "",
  ariaLabelledby: "",
  closestOption: null,
  emptyOption: "no options",
  inputClass: "",
  inputId: null,
  invalidInputClass: "",
  invalidLabelClass: "",
  isDisabled: false,
  isReadonly: false,
  listboxClass: "",
  onSelect: () => {},
  onInput: () => {},
  options: null,
  optionClass: "",
  placeholder: "",
  scrollToSelection: false,
  searchField: null,
  selected: null,
  selectedOptionClass: "",
  type: "text",
  validateUserInput: () => true,

  //state
  userInput: "",
  isUserInputValid: true,
  shouldShowListbox: false,
  activedescendant: null, // tracks the id of the currently focused option

  selectedValue: computed("searchField", "selected", function() {
    return this.selected && this.searchField
      ? get(this.selected, this.searchField)
      : this.selected || "";
  }),

  value: computed(
    "userInput",
    "selected",
    "selectedValue",
    "isUserInputValid",
    function() {
      if (!this.selected || !this.isUserInputValid) {
        return this.userInput;
      } else {
        return this.selectedValue;
      }
    }
  ).readOnly(),

  optionIds: computed("options.[]", function() {
    return (this.options || []).map(option => id(this.elementId, option));
  }).readOnly(),

  selectedId: computed("selected", function() {
    if (this.selected) {
      return id(this.elementId, this.selected);
    }
    return null;
  }).readOnly(),

  closestOptionId: computed("closestOption", function() {
    if (this.closestOption) {
      return id(this.elementId, this.closestOption);
    }
    return null;
  }).readOnly(),

  focusIn() {
    this._handleFocusIn.call(this);
  },

  focusOut({ relatedTarget }) {
    // focusOut fires when focus is moved to the options
    // only handle a focusOut if focus is actual leaving the component
    if (!this.element.contains(relatedTarget)) {
      this._handleFocusOut.call(this);
    }
  },

  keyDown(e) {
    // handle keyboard events. allow user to navigate combobox according to WAI-ARIA Combobox spec
    switch (e.key) {
      case "Up": // IE/Edge specific value
      case "ArrowUp":
        this._handleArrowUp.call(this);
        e.stopPropagation();
        e.preventDefault();
        break;

      case "Down": // IE/Edge specific value
      case "ArrowDown":
        this._handleArrowDown.call(this);
        e.stopPropagation();
        e.preventDefault();
        break;

      case "Enter":
        this._handleEnter.call(this);
        e.stopPropagation();
        e.preventDefault();
        break;

      case "Esc": // IE/Edge specific value
      case "Escape":
        this._handleEscape.call(this);
        e.stopPropagation();
        e.preventDefault();
        break;
    }
  },

  _handleArrowUp() {
    //    select the previous selection
    // OR return focus to the input if there is no previous selection
    let input = this.element.querySelector('[role="combobox"]');
    let activeOptionId = null;
    let activeOptionIndex = this.optionIds.indexOf(this.activedescendant);
    if (activeOptionIndex === 0) {
      input && input.focus();
    } else if (activeOptionIndex !== -1) {
      activeOptionId = this.optionIds[activeOptionIndex - 1];
    } else if (this.closestOptionId) {
      activeOptionId = this.closestOptionId;
    }
    let activeOptionEl = document.getElementById(activeOptionId);
    activeOptionEl && activeOptionEl.focus();
    set(this, "activedescendant", activeOptionId);
  },

  _handleArrowDown() {
    //    noop if at bottom of list and has active option
    // OR focus the next option if has active option
    // OR focus the selected option if no active option and has selection
    // OR focus the first option if no active option and no selection
    let activeOptionId = null;
    if (!this.shouldShowListbox) {
      set(this, "shouldShowListbox", true);
      this._scrollToSelection.call(this);
    }
    if (this.activedescendant) {
      let activeOptionIndex = this.optionIds.indexOf(this.activedescendant);
      if (activeOptionIndex !== this.optionIds.length - 1) {
        activeOptionId = this.optionIds[activeOptionIndex + 1];
      } else {
        activeOptionId = this.activedescendant;
      }
    } else if (this.selected) {
      let selectedIndex = this.optionIds.indexOf(this.selectedId);
      // the selected item may not exist in the options
      // if it doesn't use the closest option, otherwise use the first option
      if (selectedIndex !== -1) {
        activeOptionId = this.optionIds[selectedIndex];
      } else if (this.closestOptionId) {
        activeOptionId = this.closestOptionId;
      } else {
        activeOptionId = this.optionIds[0];
      }
    } else {
      activeOptionId = this.optionIds[0];
    }
    let activeOptionEl = document.getElementById(activeOptionId);
    activeOptionEl && activeOptionEl.focus();
    set(this, "activedescendant", activeOptionId);
  },

  _handleEnter() {
    //    select the focused suggestion
    // OR select the first suggestion as a default
    let activeOptionEl = document.getElementById(
      this.activedescendant || this.optionIds[0]
    );
    activeOptionEl && activeOptionEl.click();
  },

  _handleEscape() {
    // clear the userInput and suggestions, and return focus to input
    let input = this.element.querySelector('[role="combobox"]');
    set(this, "userInput", "");
    set(this, "activedescendant", null);
    input && input.focus();
    set(this, "shouldShowListbox", false); // hide the listbox after focusIn fires
  },

  _handleFocusIn() {
    if (!this.shouldShowListbox) {
      set(this, "shouldShowListbox", true);
      this._scrollToSelection.call(this);
    }
  },

  _handleFocusOut() {
    if (!this.isUserInputValid) {
      // prevent the input being left in an invalid state
      set(this, "userInput", this.selectedValue);
      set(this, "isUserInputValid", true);
    }
    set(this, "shouldShowListbox", false);
    set(this, "activedescendant", null);
  },

  _scrollToSelection() {
    let scrollToId;
    if (this.optionIds.includes(this.selectedId)) {
      scrollToId = this.selectedId;
    } else if (this.optionIds.includes(this.closestOptionId)) {
      scrollToId = this.closestOptionId;
    }
    if (this.scrollToSelection && scrollToId) {
      // schedule afterRender to make sure the dropdown options are rendered
      scheduleOnce("afterRender", this, function() {
        if (this.isDestroying || this.isDestroyed) return;
        let el = document.getElementById(scrollToId);
        el &&
          el.scrollIntoView({
            behavior: "auto",
            block: "center",
            inline: "start"
          });
      });
    }
  },

  actions: {
    didType(event) {
      set(this, "shouldShowListbox", true);
      let userInput = event.target.value;
      set(this, "userInput", userInput);
      userInput = this.onInput(userInput) || userInput;
      let isUserInputValid = this.validateUserInput(
        userInput,
        this.selectedValue
      );
      set(this, "isUserInputValid", isUserInputValid);
      if (isUserInputValid) {
        this.onSelect(userInput);
      }
    },

    didSelect(option) {
      let input = this.element.querySelector('[role="combobox"]');
      this.onSelect(option);
      set(this, "isUserInputValid", true);
      set(
        this,
        "userInput",
        this.searchField ? get(option, this.searchField) : option
      );
      set(this, "activedescendant", null);
      input && input.focus();
      set(this, "shouldShowListbox", false); // hide the listbox after focusIn fires
    },

    didClickInput() {
      set(this, "shouldShowListbox", true);
      this._scrollToSelection.call(this);
    }
  }
});
