"use strict"

app = angular.module('cloudStorm.datetime', ['ui.bootstrap'])

# ===== DIRECTIVE =============================================================

app.directive "csDatetime", ['uibDateParser', 'csSettings', 'csInputBase', '$filter', (uibDateParser, csSettings, csInputBase, $filter) ->

  # ===== COMPILE =============================================================

  compile = ($templateElement, $templateAttributes) ->

    # Only modify the DOM in compile, use (pre/post) link for others
    $templateElement.addClass "cs-datetime"

    # Pre-link: gets called for parent first
    pre: (scope, element, attrs, controller) ->
      return

    # Post-link: gets called for children recursively after post() traversed the DOM tree
    post: link


  # ===== LINK ================================================================

  format_date = ($scope) ->
    date_format = $scope.options['datetime-format'] || csSettings.settings['datetime-format']
    if date_format
      input_date = $scope.formItem.attributes[$scope.field.attribute]
      if input_date
        if !angular.isDate(input_date)
          input_date = input_date.substring(0, input_date.length - 1);
        # console.log(input_date)
        date = uibDateParser.parse(new Date(input_date), date_format)
        $scope.formItem.attributes[$scope.field.attribute] = date
        $scope.input_date = $filter('date')(date, 'EEEE, MMMM d, y HH:mm')

  link = ($scope, element, attrs, controller) ->
    $scope.i18n = csSettings.settings['i18n-engine']

    csInputBase $scope

    format_date($scope)

    # ===== WATCHES =======================================

    $scope.$watch 'formItem.attributes[field.attribute]', (newValue, oldValue) ->
      if (newValue != oldValue)
        $scope.$emit 'input-value-changed', $scope.field
        # format_date($scope)

  # ===== CONFIGURE ===========================================================

  return {
    restrict: 'E'
    templateUrl: 'components/cs-fields/cs-datetime/cs-datetime-template.html'
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
