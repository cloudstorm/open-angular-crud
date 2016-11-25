"use strict"

app = angular.module('cloudStorm')

# ===== DIRECTIVE =============================================================

app.directive "csCheckbox", ['$rootScope', 'CSInputBase', ($rootScope, CSInputBase) ->


  # ===== COMPILE =============================================================

  compile = ($templateElement, $templateAttributes) ->

    # Only modify the DOM in compile, use (pre/post) link for others
    $templateElement.addClass "cs-checkbox"

    # Pre-link: gets called for parent first
    pre: (scope, element, attrs, controller) ->
      return
    
    # Post-link: gets called for children recursively after post() traversed the DOM tree
    post: link


  # ===== LINK ================================================================

  link = ($scope, element, attrs, controller) ->    
    CSInputBase $scope
    
    $scope.formItem.attributes[$scope.field.attribute] = !!$scope.formItem.attributes[$scope.field.attribute]
    
    # ===== WATCHES =======================================

    $scope.$watch 'formItem.attributes[field.attribute]', (newValue, oldValue) ->
      if (newValue != oldValue)
        $scope.$emit 'input-value-changed', $scope.field

    $scope.$on 'form-reset', () ->
      $scope.formItem.attributes[$scope.field.attribute] = false

    return

  # ===== CONFIGURE ===========================================================
  
  return {
    restrict: 'E'
    templateUrl: 'components/inputs/cs-checkbox/cs-checkbox-template.html'
    scope:
      field: '=' # The resource item which the form is working with
      formItem: '='
      formMode: '='
      options: '='
    compile: compile
  }

]
