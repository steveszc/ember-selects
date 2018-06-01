# select-listbox

{{#docs-snippet name='component-select-listbox-inline.hbs' title='inline-invocation/select-listbox/template.hbs'}}

  {{select-listbox
    onchange=(action 'changeFruit')
    selected=currentFruit
    options=fruits}}

{{/docs-snippet}}

{{#docs-snippet name='component-select-listbox-block.hbs' title='block-invocation/select-listbox/template.hbs'}}

  {{#select-listbox
    onchange=(action 'changeUser')
    key="userId"
    selected=selectedUser
    options=users as |options|}}
    <div>
      <img src={{option.avatarUrl}} alt="" /> 
      <strong>{{option.name}}</strong> ({{option.userId}})
    </div>
  {{/select-listbox}}

{{/docs-snippet}}