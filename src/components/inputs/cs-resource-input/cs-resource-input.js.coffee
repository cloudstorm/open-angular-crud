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

app.directive "csResourceInput", ['$rootScope', 'ResourceService', 'CSTemplateService', 'CSInputBase', 'csSettings', ($rootScope, ResourceService, CSTemplateService, CSInputBase, csSettings) ->

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
    
    CSInputBase $scope
    $scope.CSTemplateService = CSTemplateService
    $scope.defaultTemplate = 'cloudstorm/src/components/inputs/cs-resource-input/cs-resource-input-template.html'

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

    
    # ===== COMPONENT LIFECYCLE ===========================
      
    $scope.$on 'form-reset', () ->
      # Sets an empty CS Resource as model value
      $scope.model = {object: $scope.formItem.$association($scope.field)}

    # TODO: refactor into a better pattern, perhaps involving the wizard as message broker
    $rootScope.$on 'form-submit', (event, formItem) ->
      if formItem.type == $scope.field.resource
        event.stopPropagation() if event.stopPropagation    
        itemID = formItem.id.slice()
        unless itemID == $scope.formItem.id
          refreshAndSelect(itemID)
    
    # ===== GETTERS =======================================    

    $scope.refresh = (value) -> 
      search_options = angular.merge({datastore: $scope.formItem.$datastore}, $scope.field.resource_endpoint)
      $scope.resource.$search(value, search_options).then(
        # successCallback
        (items) ->
          $scope.associates = items
          if relationships = $scope.formItem.relationships[$scope.field.relationship]
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
      $scope.createResources() && !$scope.formItem.relationships[$scope.field.relationship]?.data?.id

    
    # ===== PRIVATE =======================================    
    
    refreshAndSelect = (itemID) ->
      search_options = angular.merge({}, $scope.field.resource_endpoint)
      $scope.resource.$search(null, search_options).then(
        # successCallback
        (items) ->
          $scope.associates = items
          if $scope.field.cardinality == 'one'
            $scope.model.object = _.findWhere(items,{id:itemID})
          else 
            $scope.model.object ||= []
            $scope.model.object.push _.findWhere(items,{id:itemID})

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
    template: '<ng-include src="CSTemplateService.getTemplateUrl(field,options,defaultTemplate)"/>',
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



