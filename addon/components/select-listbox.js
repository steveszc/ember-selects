import Component from "@ember/component";
import { get, set, computed } from "@ember/object";
import layout from "../templates/components/select-listbox";

/**
  Render a custom listbox element. Can be used in block-form or inline form.
  Yields an `option` object which can be used to customize each option in the listbox.
  ```hbs
  # inline

  {{select-listbox
    onChange=(action (mut selectedName))
    selected=selectedName
    options=(array 'Steve' 'Bill' 'Katie')}}

  # block

  {{#select-listbox
    onChange=(action 'selectUser')
    selected=selectedUser
    options=users 
    as |option|
  }}
    <div>
      <img src={{option.avatarUrl}} alt="" />
      <strong>{{option.name}}</strong> ({{option.userId}})
    </div>
  {{/select-listbox}}
  ```
  @class SelectListbox
  @public
  @yield {option} option
*/

export default Component.extend({
  layout,
  classNames: ["select-listbox"],
  classNameBindings: ["allowClearStyle", "focusedStyle"],

  selectClass: null,
  optionClass: null,
  focusedClass: "select-listbox--focus",
  clearClass: "select-listbox--allow-clear",

  /**
    The placeholder option in your listbox.
    By default this will be empty. If a selection is already made, the placeholder will not be present.
    ```hbs
    {{select-listbox placeholder='Select a thing'}}
    ```
    @argument placeholder
    @type {String?}
    @default null
  */
  placeholder: null,

  /**
    Adds an aria-label string to the `select` element
    ```hbs
    {{select-listbox aria-label='Select your preference'}}
    ```
    @argument aria-label
    @type {String?}
    @default null
  */
  "aria-label": null,

  /**
    Adds an aria-labelledby string to the `select` element. This must referrence the `id` of another dom element that contains text that labels the select.
    ```hbs
    {{select-listbox aria-labelledby='id-of-the-labelling-element'}}
    ```
    @argument aria-labelledby
    @type {String?}
    @default null
  */
  "aria-labelledby": null,

  /**
    When `true`, adds the `disabled` boolean attribute to the input element
    ```hbs
    {{select-listbox disabled=true}}
    ```
    @argument disabled
    @type {Boolean?}
    @default false
  */
  disabled: false,

  /**
    When `true`, adds the `required` and `aria-required` boolean attributes to the select element
    ```hbs
    {{select-listbox required=true}}
    ```
    @argument required
    @type {Boolean?}
    @default false
  */
  required: false,

  /**
    When `true`, adds a `button` element next to the `select` that calls `onChange` with an empty string
    ```hbs
    {{select-listbox allowClear=true}}
    ```
    @argument allowClear
    @type {Boolean?}
    @default false
  */
  allowClear: false,

  /**
    This required array represents the options available to be selected. A few different formats are supported for this object:
    ```hbs
    {{select-listbox options=users}}
    ```
    ```
    # array of strings
    users: [
      'steve', 
      'bill', 
      'katie'
    ]
    ```

    ```
    # array of objects with default keys
    users: [
      { value: '1', label: 'steve', disabled: false },
      { value: '2', label: 'bill', disabled: false },
      { value: '3', label: 'katie', disabled: false }
    ]
    ```

    ```
    # array of objects with custom keys
    users: [
      { customValue: '1', customLabel: 'steve', customDisabled: false },
      { customValue: '2', customLabel: 'bill', customDisabled: false },
      { customValue: '3', customLabel: 'katie', customDisabled: false }
    ]
    ```

    When using custom property keys, you must declare these keys using the `valueKey` (required), `labelKey` (optional), and `disabledKey` (optional) arguments.

    @argument options
    @type {Array!}
    @required
  */
  options: null,

  /**
    This argument represents the currently selected option.

    This argument should match the format of the items in your `options` array.

    If `options` is an array of strings, then `selected` must be a string that matches one of the strings in the `options` array.
    
    If `options` is an array of objects, then `selected` must be a object with a `value` property (or `valueKey`) that is equal to the `value` property (or `valueKey`) of one of the objects in the `options` array.
    ```hbs
    {{select-listbox selected='my option 1'}}
    ```
    @argument selected
    @type {String | Object}
    @required
  */
  selected: null,

  /**
    Declares a custom key for which the option value should be gotten from each object in the `options` array
    ```hbs
    {{select-listbox valueKey='customValue'}}
    ```
    @argument valueKey
    @type {String?}
    @default "value"
  */
  valueKey: "value",

  /**
    Declares a custom key for which the option label should be gotten from each object in the `options` array
    ```hbs
    {{select-listbox labelKey='customLabel'}}
    ```
    @argument labelKey
    @type {String?}
    @default "label"
  */
  labelKey: "label",

  /**
    Declares a custom key for which the option disabled state should be gotten from each object in the `options` array
    ```hbs
    {{select-listbox disabledKey='customDisabled'}}
    ```
    @argument disabledKey
    @type {String?}
    @default "disabled"
  */
  disabledKey: "disabled",

  /**
    a custom function that is run when the listbox receives focus

    @argument onFocus
    @type {Function?}
  */
  onFocus: null,

  /**
    a custom function that is run when the listbox loses focus

    @argument onBlur
    @type {Function?}
  */
  onBlur: null,

  /**
    This function is run whenever a selection is made by the user. 
  
    This function must change the value of`selected`

    @argument onChange
    @type {Function}
    @required
  */
  onChange: null,

  focusedStyle: computed("hasFocus", "focusedClass", function() {
    if (get(this, "hasFocus")) {
      return get(this, "focusedClass");
    } else {
      return false;
    }
  }),

  allowClearStyle: computed("allowClear", "clearClass", function() {
    if (get(this, "allowClear")) {
      return get(this, "clearClass");
    } else {
      return false;
    }
  }),

  actions: {
    didChangeOption(value) {
      let valueKey = get(this, "valueKey");
      let option = isNaN(parseInt(value, 10))
        ? get(this, "options").find(o => value === o[valueKey])
        : get(this, "options")[value];
      get(this, "onChange")(option);
    },
    didFocus() {
      set(this, "hasFocus", true);
      let onFocus = get(this, "onFocus");
      if (typeof onFocus === "function") onFocus(...arguments);
    },
    didBlur() {
      set(this, "hasFocus", false);
      let onBlur = get(this, "onBlur");
      if (typeof onBlur === "function") onBlur(...arguments);
    }
  }
});
