"use strict"

app = angular.module('cloudStorm.index.sidePanel', [])

# ===== DIRECTIVE =============================================================

app.directive "csIndexSidepanel", ['$rootScope', 'csAlertService', 'csSettings', 'csRoute', ($rootScope, csAlertService, csSettings, csRoute) ->

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

      $scope.i18n = csSettings.settings['i18n-engine']

      $scope.editWizardOptions =
        "resource-type" : $scope.resourceType
        "form-item" : $scope.item
        "form-mode" : "edit"
        "keep-first": true
        "events":
          'wizard-canceled': (resource) ->
            $scope.unselectItem()
            csAlertService.addAlert($scope.i18n?.t('alert.nothing_changed') || 'translation missing', 'info')
          'wizard-submited': (resource) ->
            $scope.unselectItem()
            csAlertService.addAlert($scope.i18n?.t('alert.changes_saved') || 'translation missing', 'success')
          'wizard-error': (resource) ->
            csAlertService.addAlert($scope.i18n?.t('alert.error_happened')  || 'translation missing', 'danger')

      angular.merge $scope.editWizardOptions, _.omit($scope.csIndexSidepanelOptions, "selectedItem")

      $scope.$watch 'item', (newItem, oldItem) ->
        if newItem != oldItem
          if options = $scope.editWizardOptions
            options['form-item'] = newItem
      
      $scope.closePanel = () ->
        csRoute.go("type", { resourceType : $scope.resourceType})
        $scope.$broadcast 'wizard-cancel'
      
      return

  # ===== CONFIGURE ===========================================================

  return {
    restrict: 'E'
    compile: compile
    templateUrl: 'components/cs-index/cs-index-sidepanel/cs-index-sidepanel-template.html'
    scope:
      resourceType: '='
      item: '='
      itemId : '='   
      unselectItem: '&unselectItem'
      csIndexSidepanelOptions: '='
      panelNumberCallback: '='
  }

]
