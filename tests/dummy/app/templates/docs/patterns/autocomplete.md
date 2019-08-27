# Build an Autocomplete

In this example, we'll walk through building an autocomplete input using `select-combobox`
{{#demo-context/autocomplete as |context|}}
  {{#docs-demo as |demo|}}
    {{#demo.example name='docs-select-autocomplete-block.hbs'}}
      <p>The selected value is: {{context.currentUser.name}}</p>
      <div>
        {{#select-combobox
          emptyOption=null
          valueKey="name"
          searchField="name"
          placeholder="Choose a user"
          onInput=context.filterOptions
          validateUserInput=context.validateUser
          onSelect=context.changeUser
          selected=context.currentUser
          listboxClass="listbox"
          optionClass="option"
          options=context.userOptions as |user|}}
          {{user.name}} ({{user.company}})
        {{/select-combobox}}
      </div>
    {{/demo.example}}

    {{demo.snippet 'docs-select-autocomplete-block.hbs'}}
  {{/docs-demo}}
{{/demo-context/autocomplete}}
