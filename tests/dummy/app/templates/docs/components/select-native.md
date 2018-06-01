# select-native

{{#docs-snippet name='component-select-native-inline.hbs' title='inline-invocation/select-native/template.hbs'}}

  {{select-native
    onchange=(action 'changeFruit')
    selected=currentFruit
    options=fruits}}

{{/docs-snippet}}

{{#docs-snippet name='component-select-native-block.hbs' title='block-invocation/select-native/template.hbs'}}

  {{#select-native
    onchange=(action 'changeUser')
    key="userId"
    selected=currentUser
    options=users as |options|}}
    {{option.name}} ({{option.userId}})
  {{/select-native}}

{{/docs-snippet}}