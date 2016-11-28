"use strict"

app = angular.module('cloudStorm.datetime', ['ui.bootstrap'])

# ===== DIRECTIVE =============================================================

app.directive "csDatetime", ['uibDateParser', 'csSettings', 'CSInputBase', (uibDateParser, csSettings, CSInputBase) ->

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
      if !angular.isDate(input_date)
        input_date = input_date.substring(0, input_date.length - 1);
      console.log(input_date)
      date = uibDateParser.parse(new Date(input_date), date_format)
      $scope.formItem.attributes[$scope.field.attribute] = date

  link = ($scope, element, attrs, controller) ->
    $scope.i18n = csSettings.settings['i18n-engine']

    CSInputBase $scope

    # $scope.getSetTime = (value) ->
    #   if arguments.length # Set
    #     $scope.setTime(value)
    #   else # Get
    #     $scope.getTime()

    # $scope.getTime = () ->
    #   $scope.formItem.attributes[$scope.field.attribute]

    # $scope.setTime = (value) ->
    #   date_format = $scope.options['datetime-format'] || csSettings.settings['datetime-format']
    #   date = uibDateParser.parse(new Date(value), date_format)
    #   $scope.formItem.attributes[$scope.field.attribute] = date
    #   # format_date($scope)


    # $scope.getSetDate = (value) ->
    #   if arguments.length # Set
    #     $scope.setDate(value)
    #   else # Get
    #     $scope.getDate()

    # $scope.getDate = () ->
    #   $scope.formItem.attributes[$scope.field.attribute]

    # $scope.setDate = (value) ->
    #   date_format = $scope.options['datetime-format'] || csSettings.settings['datetime-format']
    #   date = uibDateParser.parse(new Date(value), date_format)
    #   $scope.formItem.attributes[$scope.field.attribute] = date
    #   # format_date($scope)

    format_date($scope)
    # $scope.setDate($scope.formItem.attributes[$scope.field.attribute])
    # $scope.setTime($scope.formItem.attributes[$scope.field.attribute])

    # ===== WATCHES =======================================

    $scope.$watch 'formItem.attributes[field.attribute]', (newValue, oldValue) ->
      if (newValue != oldValue)
        $scope.$emit 'input-value-changed', $scope.field


  # ===== CONFIGURE ===========================================================

  return {
    restrict: 'E'
    templateUrl: 'cloudstorm/src/components/cs-datetime/cs-datetime-template.html'
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
