"use strict"

app = angular.module('cloudStorm')

# ===== DIRECTIVE =============================================================

app.directive "csWizard", ['$rootScope', 'ResourceService', '$document', ($rootScope, ResourceService, $document) ->


  # ===== COMPILE =============================================================

  compile = ($templateElement, $templateAttributes) ->

    # Only modify the DOM in compile, use (pre/post) link for others
    $templateElement.addClass "cs-wizard"

    # Pre-link: gets called for parent first
    pre: (scope, element, attrs, controller) ->
      return
    
    # Post-link: gets called for children recursively after post() traversed the DOM tree
    post: link


  # ===== LINK ================================================================

  link = ($scope, element, attrs, controller) ->
    
    wizardMaxDepth = $scope.csWizardOptions['max-depth'] || 5 # NB! duplicated in CSS

    resource_type = $scope.csWizardOptions['resource-type']
    panelDescriptor = { 
      resource: angular.copy(ResourceService.get(resource_type)) 
      item: $scope.csWizardOptions['form-item']
      formMode: $scope.csWizardOptions['form-mode']
      parent: null
    }

    if $scope.csWizardOptions['resource-overrides'] && (override = $scope.csWizardOptions['resource-overrides'][resource_type])
      if override.directive?
        panelDescriptor.directive = override.directive

    $scope.panelStack = [panelDescriptor]
    if $scope.panelNumberCallback
      $scope.panelNumberCallback($scope.panelStack.length)

    # ===== WATCHES =======================================

    $scope.$watch "csWizardOptions['form-item']", (newValue, oldValue) ->
      if (newValue != oldValue) && ($scope.panelStack.length > 0)
        $scope.panelStack[0].item = $scope.csWizardOptions['form-item']

    $scope.$watchCollection 'panelStack', (newPanelStack, oldPanelStack) ->
      attrs.$set 'numberOfPanels', newPanelStack.length
      $scope.numberOfPanels = newPanelStack.length

    # ===== LIFECYCLE EVENTS ==============================

    $scope.$on 'create-resource', (event, resource, attribute, parent) ->
      $scope.pushPanel resource, attribute, parent

    $scope.$on 'form-cancel', (event, resource, attribute) ->
      popPanel($scope)
      notify_listeners($scope, 'wizard-canceled', resource) if $scope.panelStack.length == 0
    
    $scope.$on 'wizard-cancel', (event, resource, attribute) ->
      popAllPanels($scope)
      notify_listeners($scope, 'wizard-canceled', resource) if $scope.panelStack.length == 0

    $scope.$on 'form-submit', (event, resource, attribute) ->
      if $scope.panelStack.length == 1
        notify_listeners($scope, 'wizard-submited', resource) 
        popPanel($scope) unless $scope.csWizardOptions['keep-first']
      else
        popPanel($scope)
      
    $scope.$on 'form-error', (event, resource, attribute) ->
      # TODO: 422 Unprocessable entity is handeled by displaying validation errors
      # alert should only be shown for exceptional errors. Need better mechanism for that.

      unless resource.status == 422
        $scope.$emit 'wizard-error', resource.data
        if $scope.csWizardOptions.events['wizard-error'] && $scope.panelStack.length == 1
          $scope.csWizardOptions.events['wizard-error'](resource)
        
    $scope.$on 'transitioned', (event, child, parent) ->
      if child && parent 
        if $scope.csWizardOptions.transitions
          if transitions = ($scope.csWizardOptions.transitions[parent.type] && $scope.csWizardOptions.transitions[parent.type][child.type])
            for transition in transitions
              transition(child, parent)
            
    keyPressed = (keyEvent) ->
      # Cancel form on escape
      if keyEvent.keyCode == 27
        popPanel($scope)
        notify_listeners($scope, 'wizard-canceled', null) if $scope.panelStack.length == 0
        $scope.$apply()

    $document.on 'keydown', keyPressed

    # ===== DESTRUCTOR ====================================

    $scope.$on '$destroy', () ->
      $document.off 'keydown', keyPressed

    # ===== GETTERS =======================================
        
    $scope.shouldShowNewButton = () ->
      return false if $scope.panelStack.length >= wizardMaxDepth
      true
    
    # ===== SETTERS =======================================

    $scope.panelHover = (hoveredIndex) ->
      _.forEach $scope.panelStack, (panel, panelIndex) ->
        if panelIndex < hoveredIndex
          panel.hoverOrder = -1
        else if panelIndex > hoveredIndex
          panel.hoverOrder = 1
        else
          panel.hoverOrder = 0
    
    $scope.pushPanel = (resource_type, attribute, parent) ->
      panelIndex = $scope.panelStack.length - 1

      # An active field is a highlighted field of the previous panel that we work with in the wizard
      # Inactive fields receive a semi-transparent cover to visually emphasize the sole active field
      _.forEach $scope.panelStack[panelIndex].resource.descriptor.fields, (value) ->
        value.inactive = true

      activeField = _.find($scope.panelStack[panelIndex].resource.descriptor.fields, (o) -> o.attribute == attribute)
      activeField.inactive = false if activeField
      
      panelDescriptor = 
        resource: angular.copy(ResourceService.get(resource_type))
        parent: parent
        formMode: 'create'

      if $scope.csWizardOptions['resource-overrides'] && (override = $scope.csWizardOptions['resource-overrides'][resource_type])
        if override.directive?
          panelDescriptor.directive = override.directive

      $scope.panelStack.push panelDescriptor
      
      # Hack to force induce mouse move event handling on creation
      # (otherwise the new div is created, you move mouse and there's a glitch)
      $scope.panelHover(panelIndex+1)
      
      if $scope.panelNumberCallback
        $scope.panelNumberCallback($scope.panelStack.length)

      return

    overriden_resource_descriptors = {}

    $scope.resource_descriptor = (panel) ->
      if overriden_resource_descriptors[panel.resource.descriptor.type]
        return overriden_resource_descriptors[panel.resource.descriptor.type] 
      else
        descriptor = angular.copy(panel.resource.descriptor)
        overriden_resource_descriptors[panel.resource.descriptor.type] = descriptor
        if $scope.csWizardOptions['resource-overrides']
          if overrides = $scope.csWizardOptions['resource-overrides'][panel.resource.descriptor.type]
            if field_overrides = overrides['fields']
              for field_name, field_override of field_overrides
                field = _.find(descriptor.fields, (f) -> f.attribute == field_name)
                angular.merge(field, field_override)
        return descriptor


  # ===== PRIVATE =============================================================
  
  popPanel = ($scope) ->
    $scope.panelStack.pop()

    panelIndex = $scope.panelStack.length - 1

    if $scope.panelStack[panelIndex]
      # TODO: 'inactive' should probably be kept elsewhere 
      # rather than in the descriptor
      _.forEach $scope.panelStack[panelIndex].resource.descriptor.fields, (value) ->
        value.inactive = false

    $scope.panelHover(panelIndex + 1)
    
    if $scope.panelNumberCallback
      $scope.panelNumberCallback($scope.panelStack.length)

  popAllPanels = ($scope) ->
    $scope.panelStack = []
    if $scope.panelNumberCallback
      $scope.panelNumberCallback($scope.panelStack.length)

  notify_listeners = ($scope, event, resource) ->

    # Notify with emiting the event and calling the callback if set for the event
    $scope.$emit event
    if $scope.csWizardOptions && $scope.csWizardOptions.events
      if $scope.csWizardOptions.events[event]
        # Call the callback if it's set in the wizard options
        $scope.csWizardOptions.events[event](resource)
    
    # If wizard has done it's job (no panels are open anymore) notify about finish as well
    if $scope.panelStack.length == 0
      $scope.$emit 'wizard-finished'
      if $scope.csWizardOptions && $scope.csWizardOptions.events
        if $scope.csWizardOptions.events['wizard-finished']
          # Call the callback if it's set in the wizard options
          $scope.csWizardOptions.events['wizard-finished'](resource)


  # ===== CONFIGURE ===========================================================
  
  return {
    restrict: 'A'
    templateUrl: 'components/cs-wizard/cs-wizard-template.html'
    scope:
      csWizardOptions: '='
      panelNumberCallback: '='
    compile: compile
  }

]

# ===== DIRECTIVE =============================================================

app.directive "csWizardPanel", ['$rootScope', 'ResourceService', '$compile', ($rootScope, ResourceService, $compile) ->

  link = ($scope, element, attrs, controller) ->

    # ===== COMPILE DOM WITH APPROPRIATE DIRECTIVE ========
    
    if $scope.panel.directive
      innerElement = angular.element(element[0])
      inputTemplate = """
        <#{$scope.panel.directive}
          autocomplete="off"
          create-resources="shouldShowNewButton()"
          cs-form-options="csWizardOptions"
          form-item="panel.item"
          form-parent="panel.parent"
          form-mode="{{csWizardOptions['form-mode']}}"
          form-resource="panel.resource"
          form-resource-descriptor="resource_descriptor(panel)"
          role="form"
        >
      """    
      innerElement.html($compile(inputTemplate)($scope));

  return {
    restrict: 'E'
    templateUrl: 'components/cs-wizard/cs-wizard-panel-template.html'
    link: link
  }
]

