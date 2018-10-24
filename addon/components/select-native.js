import Component from "@ember/component";
import { get, set, computed } from "@ember/object";
import layout from "../templates/components/select-native";

/**
  Render a native select element. Can be used in block-form or inline form.
  Yields an `option` object which can be used to customize each option in the select.
  ```hbs
  {{!-- inline form --}}

  {{select-native
    onchange=(action 'changeMySelected')
    selected=mySelected
    options=myOption}}

  {{!-- block form --}}

  {{#select-native
    onchange=(action 'changeMySelected')
    selected=mySelected
    options=myOption as |option|
  }}
    option.name (#{{option.id}})
  {{/select-native}}
  ```
  @class SelectNative
  @public
  @yield {option} option
*/

export default Component.extend({
  layout,
  classNames: ["select-native"],
  classNameBindings: ["class", "focusedStyle"],

  focusedStyle: computed("hasFocus", "focusedClass", function() {
    if (get(this, "hasFocus")) {
      return get(this, "focusedClass");
    } else {
      return false;
    }
  }),

  /**
    A string of css classes to be applied to the wrapping div.
    Defaults to `select-native`
    @argument class
    @type {String?}
  */
  class: "select-native",

  /**
    A string of css classes to be conditionally applied to the wrapping div when the select element is focused.
    Defaults to `select-native--focus`
    @argument focusedClass
    @type {String?}
  */
  focusedClass: "select-native--focus",

  /**
    A string of css classes to be applied to the select element.
    Defaults to `select-native__select`
    @argument selectClass
    @type {String?}
  */
  selectClass: "select-native__select",

  /**
    A string of css classes to be applied to each option element.
    Defaults to `select-native__option`
    Note: most browsers will ignore any styles applied to this class
    @argument optionClass
    @type {String?}
  */
  optionClass: "select-native__option",

  /**
    The placeholder option in your select.
    By default this will produce an empty option. 
    If a selection is already made, the placeholder will not be present.

    ```hbs
    {{select-native placeholder='Please make a selection'}}
    ```
    @argument placeholder
    @type {String?}
  */
  placeholder: null,

  /**
    Adds an aria-label string to the `select` element.

    ```hbs
    {{select-native aria-label='Select your preference'}}
    ```
    @argument aria-label
    @type {String?}
    @default null
  */
  "aria-label": null,

  /**
    Adds an aria-labelledby string to the `select` element. This must referrence the `id` of another dom element that contains text that labels the select.
    ```hbs
    {{select-native aria-labelledby='id-of-the-labelling-element'}}
    ```
    @argument aria-labelledby
    @type {String?}
    @default null
  */
  "aria-labelledby": null,

  /**
    When `true`, adds the `disabled` boolean attribute to the select element
    ```hbs
    {{select-native disabled=true}}
    ```
    @argument disabled
    @type {Boolean?}
    @default false
  */
  disabled: false,

  /**
    When `true`, adds the `required` and `aria-required` boolean attributes to the select element
    ```hbs
    {{select-native required=true}}
    ```
    @argument required
    @type {Boolean?}
    @default false
  */
  required: false,

  /**
    This required array represents the options available to be selected. A few different formats are supported for this object:
    ```hbs
    {{select-native options=users}}
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
    {{select-native selected='my option 1'}}
    ```
    @argument selected
    @type {String | Object}
    @required
  */
  selected: null,

  /**
    Declares a custom key for which the option value should be gotten from each object in the `options` array
    ```hbs
    {{select-native valueKey='customValue'}}
    ```
    @argument valueKey
    @type {String?}
    @default "value"
  */
  valueKey: "value",

  /**
    Declares a custom key for which the option label should be gotten from each object in the `options` array
    ```hbs
    {{select-native labelKey='customLabel'}}
    ```
    @argument labelKey
    @type {String?}
    @default "label"
  */
  labelKey: "label",

  /**
    Declares a custom key for which the option disabled state should be gotten from each object in the `options` array
    ```hbs
    {{select-native disabledKey='customDisabled'}}
    ```
    @argument disabledKey
    @type {String?}
    @default "disabled"
  */
  disabledKey: "disabled",

  /**
    a custom function that is run when the select receives focus
    ```hbs
    {{select-native onfocus=(action 'customOnFocus'}}
    ```
    @argument onfocus
    @type {Function?}
  */
  onfocus() {},

  /**
    a custom function that is run when the select loses focus
    ```hbs
    {{select-native onblur=(action 'customOnBlur'}}
    ```
    @argument onblur
    @type {Function?}
  */
  onblur() {},

  /**
    a custom function that is run when the user makes a selection
    ```hbs
    {{select-native onchange=(action 'customOnChange'}}
    ```
    @argument onchange
    @type {Function?}
  */
  onchange() {},

  actions: {
    didChangeOption(value) {
      let valueKey = get(this, "valueKey");
      let options = get(this, "options");
      let option = options.find(o => value === o[valueKey]) || options[value];
      get(this, "onchange")(option);
    },
    didFocus() {
      set(this, "hasFocus", true);
      get(this, "onfocus")(...arguments);
    },
    didBlur() {
      set(this, "hasFocus", false);
      get(this, "onblur")(...arguments);
    }
  }
});
