# What is ember-selects?

`ember-selects` was born out of a need to have a limited, focused set of UI components that allow users to select things. 

The HTML `select` element doesn't get us very far, so most ember developers eventually reach for a more robust solution. It turns out that selects are a suprisingly easy thing for ambitious developers to get wrong (or only half right).

The existing solutions for select elements in the ember ecosystem are either half-baked, just a wrapper around a jquery library, or give you too much rope to hang yourself with.

`ember-selects` aims to remove the guess work from implementing ambitious select UI by giving you a narrow, focused set of excellent out-of-the-box select components that are sufficiently customizable and a breeze to work with.

In pursuit of these design goal, ember-selects makes a few very deliberate API choices that you should be aware of upfront:

* **Accessible out of the box** <br> `ember-selects` exposes a set of components that offer out-of-the-box accessibility by implementing established WAI-ARIA patterns, so it works for all your users without you doing a thing.

* **Blackboxed** <br> Selects are a very easy thing to get wrong once you leave the safety of HTML's built in `select` element. `ember-selects` offers a set of blackboxed components that are hard to break but a breeze to work with. 

* **Customizable visual design** <br> `ember-selects` is designed to be designed. It ships with a set of basic styles and gets out of the way so that you can style it to match your app.

* **Implement established ui patterns** <br> `ember-selects` doesn't reinvent the wheel, it implements established UI patterns that are already part of the WAI-ARIA specs - things like `listbox`, `combobox`, and `menu`. You'll need to understand these patterns to understand which select component to use for a give use case.

* **Don't be everything to everyone** <br> `ember-selects` is **not** here to give you a maximally configurable, composable or customizable API. In fact, it basically give you no rope to hang your self with at all. Instead, ember-selects offers a limited set of components that each do one thing and do it well. This means that `ember-selects` might not meet your need if you have a particularly unique design or UI pattern to implement.

* **Built with ember, for ember** <br> `ember-selects` is built from the ground up with ember code and ember conventions, so it Just Works with async, promises, ember objects, etc. No external js libraries were involved in the creation of this addon.

* **Built for performance** <br> ember-selects offers opt-in tree-shaking, so you only need to ship the components that you are actually using in your app.

