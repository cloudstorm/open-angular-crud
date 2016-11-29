"use strict"

app = angular.module('cloudStorm.index', [])

# ===== DIRECTIVE =============================================================

app.directive "csIndex", ['ResourceService', 'csDataStore', 'csRestApi', 'csSettings', '$uibModal', 'csAlertService', '$filter', (ResourceService, csDataStore, csRestApi, csSettings, $uibModal, csAlertService, $filter) ->

  # ===== COMPILE =============================================================

  compile = ($templateElement, $templateAttributes) ->

    # Only modify the DOM in compile, use (pre/post) link for others
    $templateElement.addClass "cs-index"

    # Pre-link: gets called for parent first
    pre: ($scope, element, attrs, controller) ->
      return

    # Post-link: gets called for children recursively after post() traversed the DOM tree
    post: link

  # ===== LINK ==================================================================

    link = ( $scope, element, attrs, ctrl ) ->

      # ===== INIT ============================================

      $scope.i18n = csSettings.settings['i18n-engine']

      # Store the received data to be used in the template
      $scope.collection = []
      resource = ResourceService.get($scope.resourceType)
      loadData = () ->
        resource.$index({include: '*'}).then(
          # successCallback
          (items) ->
            $scope.collection = items
          # errorCallback
          (reason) ->
            $scope.collection = null
            console.log reason
          # notifyCallback
          () ->
        )
      loadData()

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
      $scope.header  = resource.descriptor.name
      $scope.subHeader  = resource.descriptor.hint

      # ===== SORT =========================================

      sortField = _.find resource.descriptor.fields, { attribute: $scope.csIndexOptions.sortAttribute }

      $scope.comparisonValue = (item) ->
        $scope.fieldValue(item, sortField) if sortField

      # ===== COMPARISON ======================================

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
        
      $scope.fieldValue = (item, field) ->
        if field.resource
          if field.cardinality == 'many'
            associations = item.$association(field)
            names = _.map associations, (assoc) ->
              assoc.$display_name()
            return names.join(", ")
          else
            return '' unless item.relationships[field.relationship]
            item_data = item.relationships[field.relationship].data
            relationship = item.$relationship(item_data)
            return '' unless relationship
            relationship.$display_name()
        else if field.enum
          enum_value = _.find(field.enum, { value: item.attributes[field.attribute] })
          return enum_value.name if enum_value
          return item.attributes[field.attribute]
        else if field.type == 'boolean'
            return $scope.i18n?.t(item.attributes[field.attribute]) || item.attributes[field.attribute]
        else if field.type == 'time'
          display_time = new Date(item.attributes[field.attribute])
          return $filter('date')(display_time, 'HH:mm')
        else if field.type == 'datetime'
          # TODO: move formatting to fields, use moment.js
          display_date = new Date(item.attributes[field.attribute])
          return $filter('date')(display_date, 'EEEE, MMMM d, y HH:mm')
        else
          item.attributes[field.attribute]

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

      $scope.createDisabled = () ->
        resource.descriptor.create_disabled

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
          console.info 'Modal dismissed at: ' + new Date

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
  }

]
