"use strict"

app = angular.module('cloudStorm.csMenu', [])

# ===== DIRECTIVE =============================================================

app.directive "csMenu", ['ResourceService', 'csDescriptorService', 'csRoute', (ResourceService, csDescriptorService, csRoute) ->
  
  # ===== COMPILE =============================================================

  compile = ($templateElement, $templateAttributes) ->

    # Only modify the DOM in compile, use (pre/post) link for others

    # Pre-link: gets called for parent first
    pre: ($scope, element, attrs, controller) ->
      returns
  
    # Post-link: gets called for children recursively after post() traversed the DOM tree
    post: link

  # ===== LINK ==================================================================

    link = ( $scope, element, attrs, ctrl) ->
         
      $templateElement.addClass "cs-index"

      csDescriptorService.getPromises().then () ->
        $scope.resources = ResourceService.getResources()
        console.log $scope.resources
        $scope.select(Object.keys($scope.resources)[0])
  
      $scope.selected = null
      $scope.isSelected = (type) ->
        return (type == $scope.selected)
      
      $scope.select = (type) ->
        $scope.selected = type
        csRoute.go("type", {resourceType : type})
      
         
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