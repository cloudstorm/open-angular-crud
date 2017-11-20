"use strict"

app = angular.module('cloudStorm.date', [])

# ===== DIRECTIVE =============================================================

app.directive "csDate", ['uibDateParser', 'csSettings', 'csInputBase', (uibDateParser, csSettings, csInputBase) ->

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
    $scope.input_date = $scope.formItem.attributes[$scope.field.attribute]
    #$scope.formItem.attributes[$scope.field.attribute + "textFormat"] = $scope.formItem.attributes[$scope.field.attribute]
    if format
      input_date = $scope.formItem.attributes[$scope.field.attribute]
      date = uibDateParser.parse(input_date, format)
      date.setHours(14) if date # TODO: 14 is a timezone dependent value, see https://github.com/cloudstorm/cloudstorm/issues/44
      $scope.formItem.attributes[$scope.field.attribute] = date
      $scope.input_date = getTextFormat(date)

  getTextFormat = (date) ->

    year = (date.getYear() + 1900).toString()
    month = date.getMonth().toString()
    month = if month.length == 1 then '0' + month else month
    day = date.getDay().toString()
    day = if day.length == 1 then '0' + day else day
    year + "-" + month + "-" + day

  link = ($scope, element, attrs, controller) ->
    $scope.i18n = csSettings.settings['i18n-engine']

    $scope.getType = () ->
      typeof $scope.formItem.attributes[$scope.field.attribute]

    csInputBase $scope
    format_date($scope)

    # ===== WATCHES =======================================

    $scope.$on 'field-submit', (e, data) ->
      console.log "field submit event #{data}"

    $scope.$watch 'formItem.attributes[field.attribute]', (newValue, oldValue) ->
      if (newValue != oldValue)
        $scope.$emit 'input-value-changed', $scope.field


  # ===== CONFIGURE ===========================================================

  return {
    restrict: 'E'
    templateUrl: 'components/cs-fields/cs-date/cs-date-template.html'
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
        offset = $scope.options['time-zone-offset'] || csSettings.settings['time-zone-offset']
        options = { 'timezone': offset }

      $scope.$watch 'formItem.id', (newValue, oldValue) ->
        if (newValue != oldValue)
          format_date($scope)

      $scope.$watch 'formItem.attributes[field.attribute + \'dateFormat\']', (newValue, oldValue) ->
        if (newValue != oldValue)
          format_date($scope)
    ]

  }

]
