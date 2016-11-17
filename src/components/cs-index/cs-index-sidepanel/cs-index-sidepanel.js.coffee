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

app.directive "csIndexSidepanel", ['$rootScope', 'CSAlertService', ($rootScope, CSAlertService) ->

  # ===== COMPILE =============================================================

  compile = ($templateElement, $templateAttributes) ->

    # Only modify the DOM in compile, use (pre/post) link for others
    $templateElement.addClass "cs-index-sidepanel"

    # Pre-link: gets called for parent first
    pre: ($scope, element, attrs, controller) ->
      return
    
    # Post-link: gets called for children recursively after post() traversed the DOM tree
    post: link

  # ===== LINK ==================================================================

    link = ( $scope, element, attrs ) ->

      $scope.editWizardOptions = 
        "resource-type" : $scope.resourceType
        "form-item" : $scope.item
        "form-mode" : "edit"
        "keep-first": true
        "events":
          'wizard-canceled': (resource) -> 
            $scope.unselectItem()
            CSAlertService.addAlert "Nem változott semmi", 'info'
          'wizard-submited': (resource) -> 
            CSAlertService.addAlert "Változtatások elmentve!", 'success'
          'wizard-error': (resource) ->
            CSAlertService.addAlert 'Hiba történt.', 'danger'

      angular.merge $scope.editWizardOptions, _.omit($scope.csIndexSidepanelOptions, "selectedItem")

      $scope.$watch 'item', (newItem, oldItem) ->
        if newItem != oldItem
          if options = $scope.editWizardOptions
            options['form-item'] = newItem

      return

  # ===== CONFIGURE ===========================================================

  return {
    restrict: 'E'
    compile: compile
    templateUrl: 'cloudstorm/src/components/cs-index/cs-index-sidepanel/cs-index-sidepanel-template.html'
    scope:
      resourceType: '='
      item: '='
      closePanel: '&closePanel' 
      unselectItem: '&unselectItem' 
      csIndexSidepanelOptions: '='
      panelNumberCallback: '='
  }

]