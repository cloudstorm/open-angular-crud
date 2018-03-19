"use strict"

app = angular.module('cloudStorm.resourceInput', ['ui.select'])

# ===== DIRECTIVE =============================================================

app.directive "csResourceInput", [
  '$rootScope',
  'ResourceService',
  'csTemplateService',
  'csInputBase',
  'csSettings',
  'csDescriptorService',
  ($rootScope,
  ResourceService,
  csTemplateService,
  csInputBase,
  csSettings,
  csDescriptorService) ->

    # ===== COMPILE =============================================================

    compile = ($templateElement, $templateAttributes) ->

      # Only modify the DOM in compile, use (pre/post) link for others
      $templateElement.addClass "cs-resource-input"

      # Pre-link: gets called for parent first
      pre: (scope, element, attrs, controller) ->
        return

      # Post-link: gets called for children recursively after post() traversed the DOM tree
      post: link


    # ===== LINK ================================================================

    link = ($scope, element, attrs, controller) ->

      $scope.i18n = csSettings.settings['i18n-engine']

      csInputBase $scope
      $scope.csTemplateService = csTemplateService
      $scope.defaultTemplate = 'components/cs-fields/cs-resource-input/cs-resource-input-template.html'

      setup_associations($scope)

      # ===== WATCHES =======================================

      if $scope.field.cardinality == 'one'
        $scope.$watch '{id: model.object.id, type: model.object.type}', (newValue, oldValue) ->
          if (newValue.id != oldValue.id) || (newValue.type != oldValue.type)
            $scope.formItem.$assign_association($scope.field, $scope.model.object)
            $scope.$emit 'input-value-changed', $scope.field

      if $scope.field.cardinality == 'many'
        $scope.$watchCollection 'model.object', (newItems, oldItems) ->
          $scope.formItem.$assign_association($scope.field, newItems)
          $scope.$emit 'input-value-changed', $scope.field

      $scope.$watch 'formItem.id', (newValue, oldValue) ->
        if (newValue != oldValue)
          setup_associations($scope)
          $scope.$emit 'input-value-changed', $scope.field

      $scope.$watch 'formItem.relationships[field.relationship].data.id', (newValue, oldValue) ->
        if (newValue != oldValue)
          $scope.model.object = $scope.formItem.$association($scope.field)

      $scope.selectItem = (item) ->
        $scope.formItem.$registerPendingOps($scope.field.relationship, item)

      $scope.removeItem = (item) ->
        $scope.formItem.$deregisterPendingOps($scope.field.relationship, item)

      # ===== COMPONENT LIFECYCLE ===========================

      $rootScope.$on 'edit-assoc', (event, item) ->
        item.forEach (toDelete) ->
          if(toDelete.subject.id == $scope.formItem.id)
            $scope.formItem.$removeRelationship(toDelete.relationship, toDelete.object.id)

      $scope.$on 'form-reset', () ->
        # Sets an empty CS Resource as model value
        $scope.model = {object: $scope.formItem.$association($scope.field)}

      # TODO: refactor into a better pattern, perhaps involving the wizard as message broker
      $rootScope.$on 'form-submit', (event, formItem) ->
        # There are more cs-resource-input directives that might be visible on the FE:
        #   - cs-resource-input is used on the edit and create forms
        #   - cs-resource-input is also used in the cs-index component (through cs-table/cs-table-row)
        # When we submit a sub-form (==? we create a sub-resource) we want to update the previous form(s) in the wizard to
        # have the newly created resource in the respective fields, BUT we do not want to update anything in the table (yet)

        if $scope.formMode != "tableView"
        # TODO: in case when there are multiple fields that have the same sub-resource only fill the one that initiated the sub-form
          if formItem.type == $scope.field.resource
            event.stopPropagation() if event.stopPropagation
            itemID = parseInt(formItem.id.toString().slice())
            unless itemID == $scope.formItem.id
              refreshAndSelect(itemID)
        else
          if $scope.formItem.id == parseInt(formItem.id.toString().slice())
            console.log('TEST', $scope.field)
            $scope.resource = ResourceService.get($scope.field.resource)
            $scope.model = { object: $scope.formItem.$association($scope.field) }

      # ===== GETTERS =======================================

      $scope.refresh = (value) ->
        search_options = angular.merge({datastore: $scope.formItem.$datastore}, $scope.field.resource_endpoint)
        $scope.resource.$search(value, search_options).then(
          # successCallback
          (items) ->
            $scope.associates = items
            if relationships = $scope.formItem.relationships?[$scope.field.relationship]
              $scope.model.object = $scope.formItem.$association($scope.field)
          # errorCallback
          (reason) ->
            console.log reason
          # notifyCallback
          () ->
        )

      # ===== SETTERS =======================================

      $scope.pushPanel = ->
        $scope.$emit 'create-resource', $scope.field.resource, $scope.field.attribute, $scope.formItem

      $scope.canCreateResources = () ->
        $scope.createResources() && !$scope.formItem.relationships?[$scope.field.relationship]?.data?.id

      # ===== PRIVATE =======================================

      refreshAndSelect = (itemID) ->
        search_options = angular.merge({}, $scope.field.resource_endpoint)
        $scope.resource.$search(null, search_options).then(
          # successCallback
          (items) ->
            $scope.associates = items
            if $scope.field.cardinality == 'one'
              $scope.model.object = _.find(items,{id: itemID })
            else
              $scope.model.object ||= []
              $scope.model.object.push _.find(items,{id: itemID })

          # errorCallback
          (reason) ->
            console.log reason
          # notifyCallback
          () ->
        )
      return

    setup_associations = ($scope) ->
      $scope.resource = ResourceService.get($scope.field.resource)
      $scope.model = {object: $scope.formItem.$association($scope.field)}

      if $scope.associates
        $scope.associates = []
        $scope.refresh()
      else
        $scope.associates = []

    # ===== CONFIGURE ===========================================================

    return {
      restrict: 'E'
      template: '<ng-include src="csTemplateService.getTemplateUrl(field,options,defaultTemplate)"/>',
      scope:
        field: '=' # The resource item which the form is working with
        formItem: '='
        formMode: '='
        options: '='
        createResources: '&'
      compile: compile
    }

]

app.directive 'uiSelectOverride', () ->
  require: 'uiSelect',
  link: ($scope, element, attrs, $select) ->
    handleScroll = $scope.$on 'form-scroll', (event, field) ->
      # Close ui-select of multiple type when parent form is scrolled
      # Patches this bug: https://github.com/angular-ui/ui-select/issues/1254
      if $select.multiple
        $select.close()
      $scope.$apply()

    $scope.$on '$destroy', () ->
      # Deregistering listeners
      handleScroll()
