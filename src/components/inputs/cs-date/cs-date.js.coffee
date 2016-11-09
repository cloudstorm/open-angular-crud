"use strict"

# ===== SETUP =================================================================

# Make sure that the components module is defined only once
try
  # Module already defined, use it
  app = angular.module("cloudStorm")
catch err
  # Module not defined yet, define it
 app = angular.module('cloudStorm', ['ui.bootstrap'])


# ===== DIRECTIVE =============================================================

app.directive "csDate", ['uibDateParser', 'csSettings', 'CSInputBase', (uibDateParser, csSettings, CSInputBase) ->

  # ===== COMPILE =============================================================

  compile = ($templateElement, $templateAttributes) ->

    # Only modify the DOM in compile, use (pre/post) link for others
    $templateElement.addClass "cs-date"

    # Pre-link: gets called for parent first
    pre: (scope, element, attrs, controller) ->
      return

    # Post-link: gets called for children recursively after post() traversed the DOM tree
    post: link


  # ===== LINK ================================================================

  format_date = ($scope) ->
    format = $scope.options['date-format'] || csSettings.settings['date-format']

    if format
      input_date = $scope.formItem.attributes[$scope.field.attribute]
      date = uibDateParser.parse(input_date, format)      
      date.setHours(14) if date # TODO: 14 is a timezone dependent value, see https://github.com/cloudstorm/cloudstorm/issues/44
      $scope.formItem.attributes[$scope.field.attribute] = date

  link = ($scope, element, attrs, controller) ->
    CSInputBase $scope
    format_date($scope)

    # ===== WATCHES =======================================

    $scope.$watch 'formItem.attributes[field.attribute]', (newValue, oldValue) ->
      if (newValue != oldValue)
        $scope.$emit 'input-value-changed', $scope.field


  # ===== CONFIGURE ===========================================================

  return {
    restrict: 'E'
    templateUrl: 'cloudstorm/src/components/inputs/cs-date/cs-date-template.html'
    priority: 1000
    scope:
      field: '=' # The resource item which the form is working with
      formItem: '='
      formMode: '='
      options: '='
    compile: compile
    controller: ['$scope',($scope) ->
      # NGModelOptions cannot be bound in link time, but can be made available on controller scope
      $scope.getModelOptions = () ->
        offset = $scope.options['time-zone-offset'] || csSettings.settings['time-zone-offset'] || 'utc'
        options = { 'timezone': offset }

      $scope.$watch 'formItem.id', (newValue, oldValue) ->
        if (newValue != oldValue)
          format_date($scope)        
    ]

  }

]
