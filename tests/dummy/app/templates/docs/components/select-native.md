# select-native

{{#demo-context/select-native as |context|}}

  {{#docs-demo as |demo|}}
    {{#demo.example name='docs-select-native-inline.hbs'}}
      <p>The selected value is: {{context.currentColor}}</p>
      <div>
        {{select-native
          onchange=context.changeColor
          selected=context.currentColor
          options=context.colors}}
      </div>
    {{/demo.example}}

    {{demo.snippet 'docs-select-native-inline.hbs'}}
  {{/docs-demo}}

  {{#docs-demo as |demo|}}
    {{#demo.example name='docs-select-native-block.hbs'}}
      <p>The selected value is: {{context.currentUser.name}}</p>
      <div>
        {{#select-native
          valueKey="userId"
          placeholder="Choose a user"
          onchange=context.changeUser
          selected=context.currentUser
          options=context.users as |user|}}
          {{user.name}} ({{user.company}})
        {{/select-native}}
      </div>
    {{/demo.example}}

    {{demo.snippet 'docs-select-native-block.hbs'}}
  {{/docs-demo}}

{{/demo-context/select-native}}


