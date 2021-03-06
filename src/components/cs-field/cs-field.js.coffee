"use strict"

app = angular.module('cloudStorm.field', [])

# ===== DIRECTIVE =============================================================

app.directive "csField", ['$compile', '$templateRequest', 'csInputBase', ($compile, $templateRequest, csInputBase) ->

  # ===== COMPILE =============================================================

  compile = ($templateElement, $templateAttributes, $scope) ->

    # Only modify the DOM in compile, use (pre/post) link for others
    $templateElement.addClass "cs-field"

    # Pre-link: gets called for parent first
    pre: ($scope, element, attrs, controller) ->

      return

    # Post-link: gets called for children recursively after post() traversed the DOM tree
    post: link


  # ===== LINK ================================================================

  link = ($scope, element, attrs, controller) ->

    csInputBase $scope

    if !$scope.field? && $scope.fieldName?
      $scope.field = _.find $scope.formItem.constructor.descriptor.fields, { attribute: $scope.fieldName }

    # ===== COMPILE DOM WITH APPROPRIATE DIRECTIVE ========

    if override = getDirectiveOverride($scope)
      directiveName = override
    else
      type = $scope.field.type

      directiveName = switch
        when type == 'boolean'  then 'cs-checkbox'
        when type == 'date'     then 'cs-date'
        when type == 'datetime' then 'cs-datetime'
        when type == 'enum'     then 'cs-enum'
        when type == 'integer'  then 'cs-number'
        when type == 'float'    then 'cs-number'
        when type == 'resource' then 'cs-resource-input'
        when type == 'string'   then 'cs-textfield'
        when type == 'time'     then 'cs-time'
        when type == 'code'     then 'cs-code'

    wrapperName = ".cs-input-wrapper"
    inputTemplate = "<#{directiveName} form-item='formItem'
                                       field-name='fieldName'
                                       field='field'
                                       form-mode='formMode'
                                       create-resources='createResources()'
                                       options='csFieldOptions'>
                     </#{directiveName}>"

    innerElement = angular.element(element[0].querySelector(wrapperName))
    innerElement.append($compile(inputTemplate)($scope))

    # ===== DOM MANIPULATION ON SCOPE CHANGE ==============

    $scope.$watch 'field.inactive', (newValue, oldValue) ->
      if newValue != oldValue
        element.removeClass 'inactive'
        element.addClass 'inactive' if $scope.field.inactive

    $scope.$watch 'field.errors', (newValue, oldValue) ->
      if newValue != oldValue
        element.removeClass 'has-error'
        element.addClass 'has-error' if $scope.getError($scope.field)

    # ===== STYLE DESCRIPTOR SETTING ===========================

    switch $scope.formMode
      when "edit"
        styleMap =
          required : "show",
          container : "container-vertical",
          label : "field-vertical",
          value : "value-vertical"
      when "create"
        styleMap =
          required : "show",
          container : "container-vertical",
          label : "field-vertical",
          value : "value-vertical"
      when "show"
      	styleMap =
          required : "hidden",
          container : "container-horizontal",
          label : "label-horizontal",
          value : "value-horizontal",
      when "tableView"
      	styleMap =
          required : "hidden",
          container : "container-horizontal",
          label : "hidden",
          value : "value-horizontal",

    $scope.CL = styleMap
    $scope.CL.containerStyle = if $scope.formMode == 'tableView' then 'cs-field-inner-table' else 'cs-field-inner-form'

    # ===== COMPONENT LIFECYCLE ===========================

    $scope.$on 'field-error', (event, reason) ->
      errors = reason.data.errors
      $scope.field.errors = _.filter errors, (error) ->
        err = error.source.pointer.split('/').pop()
        return  err == $scope.field.attribute || err == $scope.field.relationship
      _.each $scope.field.errors, (error, index) ->
        $scope.field.errors[index] = error.detail

    $scope.$on 'field-cancel', (event) ->
      # Reset validation objects
      $scope.field.errors = null

    $scope.$on 'field-submit', (event) ->
      # Reset validation objects
      $scope.field.errors = null

    # ===== GETTERS =======================================

    $scope.getError = (field) ->
      field.errors.toString() if field.errors

    $scope.getHint = (field) ->
      field.hint || null

    return

  # ===== PRIVATE =============================================================

  getDirectiveOverride = ($scope) ->
    overrideName = null

    if (overrides = $scope.csFieldOptions['directive-overrides'])

      _(overrides).forEach (override) ->
        if (override.type == $scope.field.type) && override.directive
          overrideName = override.directive

      # Attribute override has precedence over type, let's iterate again
      _(overrides).forEach (override) ->
        if (override.attribute == $scope.field.attribute) && override.directive
          overrideName = override.directive

    overrideName


  # ===== CONFIGURE ===========================================================

  return {
    restrict: 'E'
    templateUrl: 'components/cs-field/cs-field-template.html'
    scope:
      field: '=?' # The resource item which the form is working with
      fieldName: '@' # The resource item which the form is working with
      formItem: '='
      formMode: '='
      csFieldOptions: '='
      createResources: '&'
      descriptor : "="
    compile: compile
  }

]
