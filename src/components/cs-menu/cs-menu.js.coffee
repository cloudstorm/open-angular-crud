"use strict"

app = angular.module('cloudStorm.menu', [])

# ===== DIRECTIVE =============================================================

app.directive "csMenu", ['ResourceService', 'csDescriptorService', 'csRoute', 'csSettings',  (ResourceService, csDescriptorService, csRoute, csSettings) ->

  # ===== COMPILE =============================================================

  compile = ($templateElement, $templateAttributes) ->

    $templateElement.addClass "cs-menu"

    # Only modify the DOM in compile, use (pre/post) link for others

    # Pre-link: gets called for parent first
    pre: ($scope, element, attrs, controller) ->
      returns

    # Post-link: gets called for children recursively after post() traversed the DOM tree
    post: link

  # ===== LINK ==================================================================

    link = ( $scope, element, attrs, ctrl) ->

      csDescriptorService.getPromises().then () ->
        $scope.resources = ResourceService.getResources()
        $scope.$apply()

      $scope.title = csSettings.settings['app-title']
      $scope.selected = null
      $scope.isSelected = (type) ->
        return (type == $scope.selected)

      $scope.select = (type) ->
        $scope.selected = type
        csRoute.go("index", {resourceType : type})


  return {
    restrict: 'E'
    compile: compile
    templateUrl: 'components/cs-menu/cs-menu-template.html'
    scope:
      csIndexOptions: '='
      resourceType: '='
      itemId : '='
  }
]
