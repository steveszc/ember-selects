# select-combobox

{{#demo-context/select-combobox as |context|}}

  {{#docs-demo as |demo|}}
    {{#demo.example name='docs-select-combobox-inline.hbs'}}
      <p>The selected value is: {{context.currentColor}}</p>
      <div>
        {{select-combobox
          onchange=context.changeColor
          selected=context.currentColor
          options=context.colors}}
      </div>
    {{/demo.example}}

    {{demo.snippet 'docs-select-combobox-inline.hbs'}}
  {{/docs-demo}}

  {{#docs-demo as |demo|}}
    {{#demo.example name='docs-select-combobox-block.hbs'}}
      <p>The selected value is: {{context.currentUser.name}}</p>
      <div>
        {{#select-combobox
          valueKey="userId"
          placeholder="Choose a user"
          onchange=context.changeUser
          selected=context.currentUser
          options=context.users as |user|}}
          {{user.name}} ({{user.company}})
        {{/select-combobox}}
      </div>
    {{/demo.example}}

    {{demo.snippet 'docs-select-combobox-block.hbs'}}
  {{/docs-demo}}

{{/demo-context/select-combobox}}


