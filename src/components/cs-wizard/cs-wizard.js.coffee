"use strict"

app = angular.module('cloudStorm.wizard', [])

# ===== DIRECTIVE =============================================================

app.directive "csWizard", ['$rootScope', 'ResourceService', '$document', 'csDescriptorService', 'csLog', 'csAlertService', 'csRoute', ($rootScope, ResourceService, $document, csDescriptorService, csLog, csAlertService, csRoute) ->


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

    #Setting csLog
    csLog.set($scope, "csWizard")
    #csLog.enable($scope)

    $scope.loading = true
    $scope.errors = []

    $scope.setOptions = (resource, item, formMode, wizardMaxDepth, parent) ->

      $scope.log("setOptions")
      panelDescriptor = {
        resource : resource
        item : item
        formMode : formMode
        wizardMaxDepth : wizardMaxDepth
        parent : parent
        directive : directive
      }
      $scope.panelStack = [panelDescriptor]


    $scope.finish = (error)->

      $scope.log("finish")
      $scope.loading = false
      $scope.errors = [error] if error
      throw new Error(error) if error

    if $scope.csWizardOptions

      $scope.log("wizardOptions branch")

      resource_type = $scope.csWizardOptions['resource-type']
      #If the csWizardOptions arrives then descriptors are surely loaded
      #so there is no need for the csDescriptorService.getPromises().then
      resource = angular.copy(ResourceService.get(resource_type))
      item = $scope.csWizardOptions['form-item']
      formMode = $scope.formMode || $scope.csWizardOptions['form-mode']
      parent =  null
      wizardMaxDepth = $scope.csWizardOptions['max-depth'] || 5

      if $scope.csWizardOptions['resource-overrides'] && (override = $scope.csWizardOptions['resource-overrides'][resource_type])
        if override.directive?
          directive = override.directive

      $scope.setOptions(resource, item, formMode, wizardMaxDepth, parent, directive)
      $scope.finish()

    else

      $scope.log("singlePage branch")
      $scope.csWizardOptions = {}
      # TODO Check if all the parameters arrived
      # { resourceType, itemId, pageType}
      formMode = $scope.pageType 
      if formMode != 'show' && formMode != 'edit'
        $scope.finish("'" + formMode + "' is not a valid page type!")#

      resource_type = $scope.resourceType
      $scope.csWizardOptions['form-mode'] = formMode
      wizardMaxDepth = 5
      csDescriptorService.getPromises()
      .then(()->
        try
          _resource_ = ResourceService.get($scope.resourceType)
        catch error
          errorMsg = "'" + $scope.resourceType + "' is not a registered resource."
          $scope.finish(error)

        resource = angular.copy(_resource_)
        # Getting the resource data
        resource.$get($scope.itemId, {include: '*'})
        .then((_item_)->

          item = _item_
          #Setting events
          wizardCanceled = (() ->
            csRoute.go("index", {resourceType : resource.descriptor.type})
          ).bind(resource)

          wizardSubmitted =  (()->
            switch(formMode)
              when "create" then csAlertService.success('new_resource_created')
              when "edit" then csAlertService.success("changes_saved")
            csRoute.go("index", {resourceType : resource.descriptor.type})
          ).bind(formMode, resource)

          $scope.csWizardOptions.events = {
            'wizard-canceled' : wizardCanceled
            'wizard-submited' : wizardSubmitted
          }
          $scope.setOptions(resource, item, formMode, wizardMaxDepth)
          $scope.finish()

        ).catch((reason) ->
            # TODO process the reason
            errorMsg = "There is no " + resource.descriptor.name + " with the id: " + $scope.itemId
            $scope.finish(errorMsg)
        )

    )

    if $scope.panelNumberCallback
      $scope.panelNumberCallback($scope.panelStack.length)

    # ===== WATCHES =======================================

    $scope.$watch "csWizardOptions['form-item']", (newValue, oldValue) ->
      if (newValue != oldValue) && ($scope.panelStack.length > 0)
        $scope.panelStack[0].item = $scope.csWizardOptions['form-item']

    $scope.$watchCollection 'panelStack', (newPanelStack, oldPanelStack) ->

      if newPanelStack
        attrs.$set 'numberOfPanels', newPanelStack.length
        $scope.numberOfPanels = newPanelStack.length
      else
        $scope.log("NotPanelStack")

    # ===== LIFECYCLE EVENTS ==============================

    $scope.$on 'create-resource', (event, resource, attribute, parent) ->
      console.log("attribute", attribute)
      $scope.pushPanel resource, attribute, parent

    $scope.$on 'form-cancel', (event, resource, attribute) ->
      popPanel($scope)
      notify_listeners($scope, 'wizard-canceled', resource) if $scope.panelStack.length == 0

    $scope.$on 'wizard-cancel', (event, resource, attribute) ->
      popAllPanels($scope)
      notify_listeners($scope, 'wizard-canceled', resource) if $scope.panelStack.length == 0

    $scope.$on 'form-submit', (event, resource, attribute) ->

      $scope.log("form-submit-event")
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
        attribute : attribute

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
    $scope.log("notify_listeners")
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
      csWizardOptions: '=?'
      panelNumberCallback: '='
      pageType: "="
      itemId: "="
      resourceType: "="
    compile: compile
  }

]

# ===== DIRECTIVE =============================================================

app.directive "csWizardPanel", ['$rootScope', 'ResourceService', '$compile', 'csLog', ($rootScope, ResourceService, $compile, csLog) ->

  link = ($scope, element, attrs, controller) ->

    $scope.formClass = () ->
      $scope.csWizardOptions['form-class']

    # ===== COMPILE DOM WITH APPROPRIATE DIRECTIVE ========

    csLog.set($scope, "csWizardPanel")
    #csLog.enable($scope)

    $scope.log("Start")

    if $scope.panel.directive
      $scope.log("Directive render")
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
          ng-class='formClass()'
        >
      """
      innerElement.html($compile(inputTemplate)($scope));

  return {
    restrict: 'E'
    templateUrl: 'components/cs-wizard/cs-wizard-panel-template.html'
    link: link
  }
]
