"use strict"

app = angular.module('cloudStorm.code', ['ui.select'])

# ===== DIRECTIVE =============================================================

app.directive "csCode", ['$rootScope', 'csTemplateService', 'csInputBase', '$uibModal', ($rootScope, csTemplateService, csInputBase, $uibModal) ->

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
    codeString = $scope.formItem.attributes[$scope.field.attribute] || 'null'
    try
      if typeof codeString is 'string'
        codeString = JSON.stringify(JSON.parse($scope.formItem.attributes[$scope.field.attribute]), null, '  ')
      else
        codeString = JSON.stringify($scope.formItem.attributes[$scope.field.attribute], null, ' ')
    catch e
      codeString = $scope.formItem.attributes[$scope.field.attribute] || 'null'

    $scope.formatted_code = codeString
    if codeString.length > 10
      $scope.formatted_code_short = codeString.substring(0, 10) + '\n...'
      $scope.trimmed = true
    else
      $scope.formatted_code_short = codeString
      $scope.trimmed = false


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

    $scope.showFullCode = ($event) ->
        modalTemplate = "" +
        "<cs-full-code " +
          "modal-instance=\"modalInstance\", " +
          "content=\"formatted_code\", " +
          "title=\"field.attribute\" " +
        " </cs-full-code>"

        $scope.modalInstance = $uibModal.open( {
          scope: $scope,
          keyboard: false,
          backdrop: 'static',
          template: modalTemplate
        })

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
