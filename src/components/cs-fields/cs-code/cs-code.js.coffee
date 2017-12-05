"use strict"

app = angular.module('cloudStorm.code', ['ui.select'])

# ===== DIRECTIVE =============================================================

app.directive "csCode", ['$rootScope', 'csTemplateService', 'csInputBase', ($rootScope, csTemplateService, csInputBase) ->

  # ===== COMPILE =============================================================

  compile = ($templateElement, $templateAttributes) ->

    # Only modify the DOM in compile, use (pre/post) link for others
    $templateElement.addClass "cs-code"

    # Pre-link: gets called for parent first
    pre: (scope, element, attrs, controller) ->
      return

    # Post-link: gets called for children recursively after post() traversed the DOM tree
    post: link

  # ===== LINK ================================================================

  format_code = ($scope) ->
    try
      $scope.formatted_code = JSON.stringify(JSON.parse($scope.formItem.attributes[$scope.field.attribute]), null, '  ')
    catch e
      $scope.formatted_code = $scope.formItem.attributes[$scope.field.attribute]


  link = ($scope, element, attrs, controller) ->
    csInputBase $scope
    $scope.csTemplateService = csTemplateService
    $scope.defaultTemplate = 'components/cs-fields/cs-code/cs-code-template.html'

    format_code($scope)

    # ===== WATCHES =======================================

    $scope.$watch 'formItem.attributes[field.attribute]', (newValue, oldValue) ->
      if (newValue != oldValue)
        $scope.$emit 'input-value-changed', $scope.field

    # ===== UI HANDLES ====================================

    $scope.keyPressed = ($event) ->
      if $event.keyCode == 13
        $scope.$emit 'submit-form-on-enter', $scope.field

    return

  # ===== CONFIGURE ===========================================================

  return {
    restrict: 'E'
    template: '<ng-include src="csTemplateService.getTemplateUrl(field,options,defaultTemplate)"/>',
    scope:
      field: '=' # The resource item which the form is working with
      formItem: '='
      formMode: '='
      options: '='
    compile: compile
    controller: ['$scope',($scope) ->
      $scope.$watch 'formItem.id', (newValue, oldValue) ->
        if (newValue != oldValue)
          format_code($scope)

      $scope.$watch 'formItem.attributes[field.attribute]', (newValue, oldValue) ->
        if (newValue != oldValue)
          format_code($scope)
    ]
  }

]
