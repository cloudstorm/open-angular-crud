<!-- MarkdownTOC -->

- [Dependencies](#dependencies)
- [Using CloudStorm](#using-cloudstorm)
- [CloudStorm Components](#cloudstorm-components)
    - [CS Wizard](#cs-wizard)
        - [Options](#options)
        - [Lifecycle events](#lifecycle-events)
    - [CS Form](#cs-form)
        - [Options](#options-1)
        - [Lifecycle events](#lifecycle-events-1)
        - [Client-side validation](#client-side-validation)
    - [CS Field](#cs-field)
        - [Lifecycle events](#lifecycle-events-2)
        - [Handling server-side validation](#handling-server-side-validation)
        - [Overrides](#overrides)
        - [Example usage:](#example-usage)
- [example.html](#examplehtml)
- [example.js](#examplejs)
    - [CS Resource Service](#cs-resource-service)
    - [CS Datastore](#cs-datastore)
    - [CS REST API](#cs-rest-api)
    - [CS Settings Provider](#cs-settings-provider)
    - [CS Template Service](#cs-template-service)
    - [CS Input Base](#cs-input-base)

<!-- /MarkdownTOC -->

# Dependencies
* Bootstrap's CSS
* Angular (1.4 or newer)
* Angular UI
* Angular UI Select
* Sass compiler
* CoffeeScript compiler

# Using CloudStorm

1. Require `cloudstorm/cloudstorm.js.coffee` in your app's main JS file
1. Require `cloudstorm/cloudstorm.css.scss` in your app's main CSS file
1. Inject `"cloudStorm"` as dependency in your Angular app
1. Enjoy!

#### Data format / required API
CloudStorm uses the [JSON API format](http://jsonapi.org/format/#document-structure) and convetions for client-server communications.

> If you are unsure whether your backed serves data in the right format, there are [dozens of libraries](http://jsonapi.org/implementations/) to choose from which implement JSON API in Node.js, Ruby, PHP, Python, Java, .NET and more!



#### Configuring CloudStorm settings

You can use the angular `module.config` method to provide app-wide defaults.
**Example**
```
angular.module("myApp").config([
  'csSettingsProvider', function(csSettingsProvider) {
    csSettingsProvider.set('date-format', 'yyy-MM-dd');
    csSettingsProvider.set('time-zone-offset', '+0600');
  }
]);
```

See the [list of available options](#cs-settings-provider) for CS Settings Provider

> If an option is set in both a CS Setting and an attribute on the template chain (in either of csWizard -> csForm -> csField), **the attribute option has precedence over the CS Settings value**


# CloudStorm Components
## CS Wizard

### Options
**panel-number-callback**  
* expects a function with one paremeter: `length`: To keep track of the number of panels open, callback is called with length as parameter

**cs-wizard-options**
* `resource-type`: the type of the form item. Should match the type of its csResource descriptor (string)
* `max-depth`: How many panels deep should the wizard open. If the max depth is reached, there will be no "NEW" buttons on resources of the last open panel.
* `form-item`: the object to edit
* `form-mode`: what kind of form is this? Available options: 'create', 'edit'
* `keep-first`: does not pop the panel on the root form submit
* `template-overrides`: See at [CS Field](#cs-field)
* `directive-overrides`: See at [CS Field](#cs-field)
* `attributes-to-hide`: You can set attribute visibility at component level similarly to [CS Resource](#cs-resource) level.
* `events`: you can add one callback per lifecycle event. Example:
```
"events": {
  'wizard-canceled': (resource) ->
    <<handle event>>
  'wizard-submited': (resource) ->
    <<handle happy event>>
  'wizard-error': (resource) ->
    <<handle sad event>>
}
```

> Note: You can augment the list of CS Wizard Options with options of CS Form and CS Fields -> the options will trickle down to CS Forms and CS Fields, so you only need to set them at the root, where you place a CS Wizard.

### Lifecycle events
* `wizard-finished` emited when a wizard completed, regardless of outcome
* `wizard-canceled` emited when user cancels the wizard
* `wizard-submited` emited when a wizard is successfully submited
* `wizard-error` emited when there was an error submiting a form within the wizard

**Downwards**
The following events are broadcasted to children of the wizard
* `wizard-cancel` when the form was canceled
> The wizard cancels the current form on `ESC` key press.

## CS Form

### Options
**cs-form-options**
* `reset-on-submit`: Resets all inputs in the form on form submit
* `skip-on-enter`: Form should not be submited when hitting enter in a CS Textfield
* `texts` (If a text attribute is not given, default text will be displayed)
  * `validation-text`: Display this hint while the form is invalid
  * `buttons`
    * `submit`
    * `cancel`

### Lifecycle events
**Upwards**
* `form-init` emited when the form is linked. The scope of the form is passed as first argument.
* `form-cancel` emited when user cancels a form (in a CS Wizard or a self-contained CS Form)
* `form-submit` emited when a form is successfully submited
* `form-error` emited when there was server side error with the submited form

**Downwards**
The following events are broadcasted to children of the form
* `form-reset` when form should be reset
* `form-scroll` when the form was scrolled
* `field-error` when there was server side error with the submited form
* `field-cancel` when the form was canceled
* `field-submit` when the form was submited

### Client-side validation
CS Form implements basic Angular client-side validation. You can evaluate the form's validity in the template through the boolean expression `csForm.$invalid`


## CS Field
### Lifecycle events
* `input-value-changed` emited when a value changes
* `create-resource` emited when an input requests the CS Wizard to push a new form to the panel stack for creating a certain type of resource

### Handling server-side validation
* If a validation error is returned for an API call in the [correct JSON API format](http://jsonapi.org/format/#errors), the affected CS Fields automatically show bootstrap `has-error` behavior and a hint text is displayed with the description of the error for the particular fields.

### Overrides
It is possible to set a __template override__ or __directive override__ for all occurrences of a __type__ of CSField (Eg.: CSResourceInput) or for a certain __attribute__.
You can set an override at the following stages of the template chain: [CSWizard, CSForm, CSField].
The respective component options hash may have a `template-overrides` as well as a `directive-overrides` key with array value. You can override any number of attributes or types with the arrays.

#### How to set a directive override
1) overrding inputs for a certain attribute
`{attribute: 'serial_numbers', directive: "directive-for-serial-numbers"}`

2) overrding type of input
`{type: 'resource', directive: "new-resource-directive"}`

(attribute has precedence over type)

> directive-overrides expect the name of the new directive in `kebab-case` as opposed to `normalizedCamelCase`
> When using `directive-override` the entire default logic of the default directive is overriden.

#### How to set a template override
1) overrding inputs for a certain attribute
`{attribute: 'serial_numbers', template: "directives/resource-with-checkboxes.html"}`

2) overrding type of input
`{type: 'resource', template: "directives/resource-with-checkboxes.html"}`

(attribute has precedence over type)

> template-overrides expect a path to a template which will override the default template of the component, leaving the default directive logic intact. Additional logic can be included eg. using a child ng-controller introduced in the new template.

### Example usage:
```
$scope.csWizardOptions =
  "resource-type": "products"
  "form-item": {}
  "form-mode": "create"
  "template-overrides": [ {type: 'resource', template: "directives/resource-with-checkboxes.html"} ]
  "directive-overrides": [ {attribute: 'serial-number', directive: "new-serial-number"},
                           {type: 'boolean' directive: "new-checkbox-directive"} ]
]
  ```

> :warning: When overriding CSResourceInput, don't forget to: call `$scope.refresh()` at initialization, as we rely on this call to populate the selectable resource.

> In order to get access to the helper functions of [CSInputBase](#cs-input-base), inject CSInputBase in your controller / directive and call `CSInputBase($scope)` in controller initialization / directive link of your custom template.

### CS Checkbox
The `required` attribute has no effect on a CS Checkbox.


### CS Date
**cs-field-options**
* `date-format`: optional. If exist, the ng-model of date is parsed with this format through Angular UI's uibDateParser
* `time-zone-offset`: optional. Defaults to 'utc'. If exist, the offset of the date is altered through the ng-model-options parameter of the uib-datepicker. Use a time zone offset, for example, '+0430' (4 hours, 30 minutes east of the Greenwich meridian). Read more at the [official Angular docs](https://docs.angularjs.org/api/ng/directive/ngModelOptions)

### CS Enum
### CS Number
### CS Resource Input

### CS Textfield
#### Lifecycle events
* `submit-form-on-enter`: emited to programmatically submit a form on hitting enter in a `cardinality: one` CS Texfield

## CS Index

If the resource's descriptor contains a `hint` attribute, it's value will be shown as the subheading of the component.

**cs-index-options**
* `resource-type`:  The type of the items to be listed. Should matchhe type of its csResource descriptor (string)
* `attributes-to-hide`: You can set attribute visibility at component level similarly to [CS Resource](#cs-resource) level.
* `hide_actions`: Whether to show the actions at the end of each row (`default: false`)

Example usage:
```
# example.html
  <cs-index resource-type=resourceType cs-index-option=options />

# example.js
  $scope.resourceType = "procedures";
  $scope.options = { 'hide-attributes' : {index: 'eluent_stabilization_id'} };

```


## CS Alert

**Usage**

1. Place a `<cs-alert/>` element in your layout.
1. Include `CSAlertService` as dependency in controller/directive
1. Add an alert by calling `CSAlertService.addAlert(message,type)`. Available types are same as Bootstrap: 'success', 'info', 'warning', 'danger'.

> When used from template make `CSAlertService`accessible on $scope
(eg: in `ng-click => CSAlertService.addAlert('alert','success')`)

:warning:
> Place only one cs-alert element per app, or make sure that there is only one such element in your view at the same time (eg: by placing it in a shared header template)!



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


## CS Datastore


## CS REST API


## CS Settings Provider
Provides global settings for all CS Components within your app.
Call `set(option, value)` on the provider to set an app-wide default parameter.

Available options:
* `date-format`
* `time-zone-offset`


## CS Template Service


## CS Input Base
Provides helper fuctions through decorating the scope of every directive that calls CSInputBase($scope) on it.
(poor man's directive inheritance - helps to keep the code of different CS Inputs DRY)
