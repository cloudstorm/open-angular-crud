
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


## CS Input Base
Provides helper fuctions through decorating the scope of every directive that calls CSInputBase($scope) on it.
(poor man's directive inheritance - helps to keep the code of different CS Inputs DRY)


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
