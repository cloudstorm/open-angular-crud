"use strict"

app = angular.module('cloudStorm.time', [])

# ===== DIRECTIVE =============================================================

app.directive "csTime", ['uibDateParser', 'csSettings', 'csInputBase', (uibDateParser, csSettings, csInputBase) ->

  # ===== COMPILE =============================================================

  compile = ($templateElement, $templateAttributes) ->

    # Only modify the DOM in compile, use (pre/post) link for others
    $templateElement.addClass "cs-time"

    # Pre-link: gets called for parent first
    pre: (scope, element, attrs, controller) ->
      return

    # Post-link: gets called for children recursively after post() traversed the DOM tree
    post: link


  # ===== LINK ================================================================

  link = ($scope, element, attrs, controller) ->
    $scope.i18n = csSettings.settings['i18n-engine']

    csInputBase $scope

    # ===== WATCHES =======================================

    $scope.$watch 'formItem.attributes[field.attribute]', (newValue, oldValue) ->
      if (newValue != oldValue)
        $scope.$emit 'input-value-changed', $scope.field


  # ===== CONFIGURE ===========================================================

  return {
    restrict: 'E'
    templateUrl: 'components/cs-fields/cs-time/cs-time-template.html'
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
    ]

  }

]
