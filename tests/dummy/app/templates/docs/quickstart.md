# Quickstart

This quickstart guide will get you started using ember-selects in your ember app. After completion you'll understand which select component to use for different use cases, and how ember-selects can improve your select 

## Installation

```
ember install ember-selects
```

## The Components

`ember-selects` exposes 4 primary components for use in your app. When starting out its important to understand which component to use for various use-cases. 

1. `select-native`
<br><br>
This component is merely a convenient component wrapper around the native HTML `select` element. Use this when your don't need multiple selection, your options only need to display text (no html), and you'd like to take advantage of the browser native look and feel of the select menu (especially important on mobile browsers). 

2. `select-listbox`
<br><br>
This component is an implementation of the WAI-ARIA `listbox` pattern, basically a more flexible version of html's `select` element. Supports single or multi select, and arbitrary option html. Use this when you need full control over the options (ie. arbitrary html) or you need the option of allowing multiple selections.

3. `select-combobox`
<br><br>
This component is an implementation of the WAI-ARIA `combobox` pattern, aka autocomplete. Use this when you need an autocomplete-style input where the user is shown a list of suggestions as they type.

4. `select-menu`
<br><br>
This component is an implementation of the WAI-ARIA `menu` pattern. Use this when presenting the user with a menu of actions rather than a list of selectable options.

## Usage

Each `ember-selects` component can be invoked with a similar component API, in either inline or block form. 

In it's simplest form, an `ember-selects` component takes an array of strings of possible `options`, a `selected` option string, and an `onchange` action.

{{#docs-snippet name='quickstart-inline.hbs' title='inline-invocation/template.hbs'}}

  {{select-listbox
    onchange=(action 'changeFruit')
    selected=currentFruit
    options=fruits}}

{{/docs-snippet}}

For more complicated use cases, you can use the block form to customize the rendered option, and use objects instead of strings to represent the options.

{{#docs-snippet name='quickstart-block.hbs' title='block-invocation/template.hbs'}}

  {{#select-listbox
    label="Choose a User"
    key="userId"
    onchange=(action 'changeUser')
    selected=currentUser
    options=users as |option|}}

    <img src={{option.avatar}} alt="" /> {{option.username}}

  {{/select-listbox}}

{{/docs-snippet}}


## Tree shaking

`ember-selects` is built to be treeshakable, so you opt-in to the components you need, or opt-out of the components you don't need.

Details coming soon.