"use strict"

app = angular.module('cloudStorm.index', [])

# ===== DIRECTIVE =============================================================

app.directive "csIndex", ['ResourceService', 'csDataStore', 'csRestApi', 'csSettings', '$uibModal', 'csAlertService', '$filter', 'csDescriptorService', 'csRoute', (ResourceService, csDataStore, csRestApi, csSettings, $uibModal, csAlertService, $filter, csDescriptorService, csRoute) ->

  # ===== COMPILE =============================================================

  compile = ($templateElement, $templateAttributes) ->

    # Only modify the DOM in compile, use (pre/post) link for others
    $templateElement.addClass "cs-index"

    # Pre-link: gets called for parent first
    pre: ($scope, element, attrs, controller) ->
      returns

    # Post-link: gets called for children recursively after post() traversed the DOM tree
    post: link

  # ===== LINK ==================================================================

    link = ( $scope, element, attrs, ctrl) ->

     # ===== INIT ============================================

      $scope.i18n = csSettings.settings['i18n-engine']
      $scope.collection = $scope.items
      resource = $scope.resource

      loadData = () ->

        # Should not be used here because the component gets its wrong
        csDescriptorService.getPromises().then () ->

          # Store the received data to be used in the template
          $scope.resource.$index({include: '*'}).then(
            # successCallback
            (items) ->
              $scope.collection = items
            # errorCallback
            (reason) ->
              $scope.collection = null
            # notifyCallback
            () ->
          )

      ###
      $scope.setSelectedItem = () ->

        if $scope.itemId != null
          for res in $scope.collection
            if res.id == $scope.itemId.toString()
              $scope.csIndexOptions.selectedItem = res
              break
          if $scope.csIndexOptions.selectedItem == null
            csAlertService.addAlert($scope.i18n?.t('alert.resource_not_found') + $scope.itemId, 'danger')
      ###

      sortField = undefined

      defaultOptions =
        'selectedItem'    : null # [private API]
        'sortAttribute'   : resource.descriptor.fields[0].attribute # [private API]
        'filterValue'     : "" # [private API]
        'sortReverse'     : false # [private API]
        'condensedView'   : false # [private API]
        'hide-actions'    : false
        'hide-attributes' : resource.descriptor.attributes_to_hide || {}

      $scope.csIndexOptions ||= {}
      indexOptions = angular.copy $scope.csIndexOptions
      angular.copy {}, $scope.csIndexOptions
      angular.merge $scope.csIndexOptions, defaultOptions, indexOptions

      $scope.columns = resource.descriptor.fields

      # ===== SORT =========================================

      $scope.filter = (filterValue) ->
        $scope.filterValue = filterValue

      escapeRegExp = (str) ->
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");

      $scope.filterComparison = (value, index, array) ->
        search = new RegExp(escapeRegExp($scope.csIndexOptions.filterValue), "i")
        _.any resource.descriptor.fields, (field) ->
          if (field_value = $scope.fieldValue(value, field))
            field_value.toString().match(search)

      # ===== GETTERS =========================================

      $scope.listIsEmpty = () ->
        $scope.collection == null

      $scope.columnVisible = (column, index) ->
        length = $scope.columns.length
        if attributeToHide(column.attribute)
          return false
        if $scope.viewIsCompressed() && !_.contains([0, 1, 2], index)
          return false
        return true

      attributeToHide = (attribute) ->
        if hiddenAttrs = $scope.csIndexOptions['hide-attributes'].index
          return hiddenAttrs.indexOf(attribute) > -1
        false

      $scope.sidePanelIsVisible = () ->
        return true if $scope.csIndexOptions.selectedItem
        false

      $scope.viewIsCompressed = () ->
        $scope.sidePanelIsVisible() && $scope.csIndexOptions.condensedView

      # ===== SETTERS =========================================

      $scope.changeSorting = (column) ->
        $scope.csIndexOptions.sortAttribute = column.attribute
        $scope.csIndexOptions.sortReverse = !$scope.csIndexOptions.sortReverse

        sortField = _.find resource.descriptor.fields, { attribute: $scope.csIndexOptions.sortAttribute }

      $scope.selectItem = (item) ->
        $scope.csIndexOptions.selectedItem = (item)

      $scope.destroyItem = ($event, item) ->
        $event.stopPropagation()
        if confirm $scope.i18n?.t('confirm.delete')
          item.$destroy().then(
            # successCallback
            (result) ->
              $scope.csIndexOptions.selectedItem = null
              index = $scope.collection.indexOf(item)
              $scope.collection.splice(index, 1)
            # errorCallback
            (reason) ->
              alert = reason.data?.errors[0].detail
              csAlertService.addAlert alert || $scope.i18n?.t('alert.error_happened'), 'danger'
          )
      $scope.showItem = (item) ->
        if $scope.csIndexOptions.selectedItem == null
          csRoute.go("show", { resourceType : $scope.resourceType, id : item.attributes.id})
        else
          $scope.selectItem(item)

      $scope.unselectItem = () ->
        $scope.csIndexOptions.selectedItem = null

      # ===== WIZARD CALLBACKS ============================

      $scope.getPanelNumber = (length) ->
        if length > 1
          $scope.csIndexOptions.condensedView = true
        else
          $scope.csIndexOptions.condensedView = false

      # ===== UX HANDLES ======================================

      $scope.refreshIndex = () ->
        $scope.unselectItem()
        loadData()

      $scope.testEvent = (test) ->
        alert test

      $scope.openNewResourcePanel = () ->
        $scope.unselectItem()

        $scope.wizardOptions =
          "resource-type": $scope.resourceType
          "form-item": {}
          "form-mode": "create"
          "reset-on-submit": true
          "events": {
            'wizard-canceled': (resource) ->
              modalInstance.close()
              csAlertService.addAlert($scope.i18n?.t('alert.no_resource_created') || 'translation missing', 'info')

            'wizard-submited': (resource) ->
              pushNewItem($scope.collection, resource)
              modalInstance.close() unless $scope.wizardOptions['keep-first']
              csAlertService.addAlert($scope.i18n?.t('alert.new_resource_created') || 'translation missing', 'success')
          }

        angular.merge($scope.wizardOptions, $scope.csIndexOptions)

        modalInstance = $uibModal.open(
          scope: $scope
          keyboard: false
          backdrop  : 'static'
          windowTopClass: 'modal-wizard'
          template: "<div cs-wizard cs-wizard-options=wizardOptions></div>"
          resolve: dummy: ->
            $scope.dummy
        )
        modalInstance.result.then ((selectedItem) ->
          $scope.selected = selectedItem
        ), ->
          console.info 'Modal dismissed at: ' + new Date()

      pushNewItem = (collection, item) ->
        newItem = item.constructor.$new()
        newItem.$clone(item)
        collection.push newItem




  # ===== CONFIGURE ===========================================================

  return {
    restrict: 'E'
    compile: compile
    templateUrl: 'components/cs-index/cs-index-template.html'
    scope:
      csIndexOptions: '='
      resourceType: '='
      itemId : '='
      items : "<"
      resource : "<"
  }

]
