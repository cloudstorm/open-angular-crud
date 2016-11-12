# CloudStorm Basics
> [**Home**](../README.md) ▸ [**Reference**](../docs/README.md) ▸ **CloudStorm Basics**

## CS Resource

> TODO :warning: Document merge override

```javascript
@descriptor = {
  type: 'products'
  name: 'A Product'

  fields: [
    { attribute: 'product_type_id', label: 'Product Type', type: 'resource', resource: 'product_types', cardinality: 'one', relationship: 'product_type', required: true, read_only: true }
    { attribute: 'origin_date', label: 'Available since', type: 'date', cardinality: 'one', required: false, read_only: false }
    { attribute: 'deadline', label: 'Határidő', type: 'date', cardinality: 'one', required: false, read_only: false }
    { attribute: 'availability', label: 'Available?', type: 'boolean', cardinality: 'one', required: false, read_only: false }
  ]

  display: {
    name:   'name'
    search: 'name_x_cont'
  }

  attributes_to_hide: {
    create:['origin_date']
  }
```

The resource descriptor contains the following information:
* `type`: Name of the resource to refer in code
* `name`: Name of the resource to show on frontend
* `hint` (optional): String used as extra description of the resource.
* `create_disabled` (boolean, optional): if true, NEW button will not show next to it in CS Index
* `fields`:
  * `attribute`
  * `label`
  * `default` (optional): default value to be shown on frontend
  * `hint` (optional): String to show as a hint message next to the field in forms
  * `type`
  * `cardinality`: `'one' | 'many'`
  * `create_disabled` (boolean, optional): if true, NEW button will not show next to it in CS Resource Input
  * `required (boolean)` If `true`, CloudStorm will append an asterisk `*` to the label of the rendered field, and ???
  * `read_only (boolean)` If `true`, the input of the respective attribute will show but will be disabled on all actions except `create`
* `display`
  * `name`
  * `search`
* `attributes_to_hide` (optional): which attributes to hide for each action..

> A CSResource's object attributes are available through the `constructor` of the object. Eg: to get the resource descriptor of a form item in a CS Field, you should call `formItem.constructor.descriptor` instead of `formItem.descriptor`. Because javascript.
