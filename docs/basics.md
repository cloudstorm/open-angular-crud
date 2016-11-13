# CloudStorm Basics
> [**Home**](../README.md) ▸ [**Reference**](../docs/README.md) ▸ **CloudStorm Basics**

## CS Resource

> TODO :warning: Document merge override

```json
@descriptor = {
  type: 'products'
  name: 'A Product'

  fields: [
    { attribute: 'product_type_id', label: 'Product Type', type: 'resource', resource: 'product_types', cardinality: 'one', relationship: 'product_type', required: true, read_only: true }
    { attribute: 'price', label: 'Price', type: 'float', cardinality: 'one', required: true, read_only: false }
    { attribute: 'available_date', label: 'Available from', type: 'date', cardinality: 'one', required: false, read_only: false }
    { attribute: 'stock', label: 'In stock?', type: 'boolean', cardinality: 'one', required: false, read_only: false }
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

Attribute            | Type    | Description
-------------------- | ------- | ----------- 
`type`               | string  | Name of the resource to refer in code
`name`               | string  | Name of the resource to show on frontend
`hint`               | string  | (optional) String used as extra description of the resource.
`create_disabled`    | boolean | (optional) If true, NEW button will not show next to it in CS Index
`fields`             | object  | See below
`fields.attribute`   | string  | ?
`fields.label`       | string  | ?
`fields.default`     | value   | (optional) Default value to be shown on frontend
`fields.hint`        | string  | (optional) String to show as a hint message next to the field in forms
`fields.type`        | string  | ?
`fields.cardinality` | string  | Either 'one' or 'many'
`fields.create_disabled` | boolean | (optional): if true, NEW button will not show next to it in CS Resource Input
`fields.required`    | boolean | If `true`, CloudStorm will append an asterisk `*` to the label of the rendered field, and ???
`fields.read_only`   | boolean | If `true`, the input of the respective attribute will show but will be disabled on all actions except `create`
`display`            | object | See below
`display.name`       | string | ? 
`display.search`     | string | ?
`attributes_to_hide` | object | (optional) Which attributes to hide for each action. (key: action, value:array of strings)

> A CSResource's object attributes are available through the `constructor` of the object. Eg: to get the resource descriptor of a form item in a CS Field, you should call `formItem.constructor.descriptor` instead of `formItem.descriptor`. Because javascript.
