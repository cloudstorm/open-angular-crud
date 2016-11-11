> [Home](..) ▸ **Gallery**

# Under the hood

## CS Resource

> TODO :warning: Document merge override

A CSResource's object attributes are available through the `constructor` of the object. Eg: to get the resource descriptor of a form item in a CS Field, you should call `formItem.constructor.descriptor` instead of `formItem.descriptor`. Because javascript.

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
* `attributes_to_hide` (optional): which attributes to hide for each action. If present for the given action, the listed attributes will NOT show up, even if they were listed in `attributes_to_show` as well.

```
@descriptor = {
  type: 'products'
  name: 'A Product'

  fields: [
    { attribute: 'substance_id', label: 'Anyag', type: 'resource', resource: 'substances', cardinality: 'one', relationship: 'substance', required: true, read_only: true }
    { attribute: 'product_type_id', label: 'Mintatípus', type: 'resource', resource: 'product_types', cardinality: 'one', relationship: 'product_type', required: true, read_only: true }
    { attribute: 'origin_date', label: 'Mintaindítás dátuma', type: 'date', cardinality: 'one', required: false, read_only: false }
    { attribute: 'deadline', label: 'Határidő', type: 'date', cardinality: 'one', required: false, read_only: false }
    { attribute: 'priority', label: 'Prioritásos minta?', type: 'boolean', cardinality: 'one', required: false, read_only: false }
  ]

  display: {
    name:   'name'
    search: 'name_x_cont'
  }

  attributes_to_hide: {
    create:['priority']
  }
```


## CS Resource Service

## CS Template Service

## CS Datastore

## CS REST API

## CS Settings Provider
Provides global settings for all CS Components within your app.
Call `set(option, value)` on the provider to set an app-wide default parameter.

Available options:
* `date-format`
* `time-zone-offset`
