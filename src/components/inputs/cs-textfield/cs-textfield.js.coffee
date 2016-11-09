"use strict"

# ===== SETUP =================================================================

# Make sure that the components module is defined only once
try
  # Module already defined, use it
  app = angular.module("cloudStorm")
catch err
  # Module not defined yet, define it
 app = angular.module('cloudStorm', [])


# ===== DIRECTIVE =============================================================

app.directive "csTextfield", ['$rootScope', 'CSTemplateService', 'CSInputBase', ($rootScope, CSTemplateService, CSInputBase) ->

  # ===== COMPILE =============================================================

  compile = ($templateElement, $templateAttributes) ->

    # Only modify the DOM in compile, use (pre/post) link for others
    $templateElement.addClass "cs-textfield"

    # Pre-link: gets called for parent first
    pre: (scope, element, attrs, controller) ->
      return
    
    # Post-link: gets called for children recursively after post() traversed the DOM tree
    post: link

  # ===== LINK ================================================================

  link = ($scope, element, attrs, controller) ->    
    CSInputBase $scope
    $scope.CSTemplateService = CSTemplateService
    $scope.defaultTemplate = 'cloudstorm/components/inputs/cs-textfield/cs-textfield-template.html'
            
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
    template: '<ng-include src="CSTemplateService.getTemplateUrl(field,options,defaultTemplate)"/>',
    scope:
      field: '=' # The resource item which the form is working with
      formItem: '='
      formMode: '='
      options: '='
    compile: compile
  }

]
