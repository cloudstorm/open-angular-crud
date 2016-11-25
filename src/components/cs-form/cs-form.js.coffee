"use strict"

app = angular.module('cloudStorm.form', [])

# ===== DIRECTIVE =============================================================

app.directive "csForm", ['csSettings', (csSettings) ->

  # ===== COMPILE =============================================================

  compile = ($templateElement, $templateAttributes) ->

    # Only modify the DOM in compile, use (pre/post) link for others
    $templateElement.addClass "cs-form"

    # Pre-link: gets called for parent first
    pre: (scope, element, attrs, controller) ->
      return

    # Post-link: gets called for children recursively after post() traversed the DOM tree
    post: link

  # ===== LINK ================================================================

  link = ($scope, element, attrs, controller) ->

    $scope.i18n = csSettings.settings['i18n-engine']
    
    $scope.fields = $scope.formResourceDescriptor.fields

    if $scope.formMode == 'create'
      if $scope.formItem
        $scope.formItem = $scope.formResource.$new(value: $scope.formItem) 
      else
        $scope.formItem = $scope.formResource.$new() 

    if $scope.formMode == 'edit'
      $scope.editableItem = $scope.formResource.$new(value: $scope.formItem)
    else
      $scope.editableItem = $scope.formItem

    $scope.$emit 'form-init', $scope
    $scope.$emit 'transitioned', $scope.editableItem, $scope.formParent

    # ===== WATCHES =======================================

    $scope.$watch 'formItem.id', (newValue, oldValue) ->
      if (newValue != oldValue)
        if $scope.formMode == 'edit'
          $scope.editableItem.$clone($scope.formItem)

          # TODO: Errors must not be in the global field object. Workaround.

          _($scope.fields).each (field) ->
            delete field.errors

    # ===== LIFECYCLE EVENTS ==============================

    # --- Trigger events ------------------------
    
    scrollTrigger = _.throttle () -> $scope.$broadcast 'form-scroll', 300
    $(element).find('form').on 'scroll', scrollTrigger
    
    # --- Handle events -------------------------
    
    $scope.$on 'input-value-changed', (event, field) ->
      $scope.$broadcast 'field-value-changed', field
    
    $scope.$on 'submit-form-on-enter', (event, field) ->
      $scope.submit() unless $scope.csFormOptions['skip-on-enter'] && $scope.wizardPanelIndex == 0

    $scope.$on 'form-init', (event, formScope) ->
      if $scope.csFormOptions.events['form-init']
        $scope.csFormOptions.events['form-init'](formScope)

    $scope.$on 'field-value-changed', (event, field) ->
      if $scope.csFormOptions.events['field-value-changed']
        $scope.csFormOptions.events['field-value-changed'](field, $scope)

    # ===== GETTERS =======================================

    $scope.isFieldVisible = (field_attribute) ->
      true unless attributeToHide(field_attribute)

    # ===== SETTERS =======================================

    $scope.cancel = () ->
      $scope.$emit 'form-cancel', $scope.formItem
      $scope.$broadcast 'field-cancel', $scope.formItem

    $scope.submit = () ->
      api_action = null
      if $scope.formMode == 'edit'
        api_action = $scope.editableItem.$save
      else if $scope.formMode == 'create'
        api_action = $scope.editableItem.$create

      api_action.call($scope.editableItem).then(
        # successCallback
        (item) ->
          $scope.formItem.$assign($scope.editableItem) unless $scope.editableItem == $scope.formItem

          $scope.$emit 'form-submit', $scope.formItem
          $scope.$broadcast 'field-submit', $scope.formItem

          if $scope.csFormOptions['reset-on-submit']
            angular.copy($scope.formResource.$new(), $scope.formItem)
            # Notify children that they need to clear their inputs
            $scope.$broadcast 'form-reset'

        # errorCallback
        (reason) ->
          $scope.$emit 'form-error', reason
          $scope.$broadcast 'field-error', reason

        # notifyCallback
        () ->
      )

    # ===== PRIVATE =======================================

    attributeToHide = (field_attribute) ->
      shouldHide = false

      # Check the descriptor options for an entry matching this input's attribute and the current form mode
      attributes = $scope.editableItem.constructor.descriptor.attributes_to_hide
      if attributes && attributes[$scope.formMode]
        # Check if options array contains the current field's attribute
        shouldHide = attributes[$scope.formMode].indexOf(field_attribute) > -1

      # Check the directive options for an entry matching this input's attribute and the current form mode
      # This has precedence over descriptor options, being the more specific
      if $scope.csFormOptions['attributes-to-hide'] && $scope.csFormOptions['attributes-to-hide'][$scope.formMode]
        shouldHide = $scope.csFormOptions['attributes-to-hide'][$scope.formMode].indexOf(field_attribute) > -1

      shouldHide

    # ===== DESTRUCTOR ====================================

    $scope.$on '$destroy', () ->


    return

  # ===== CONFIGURE ===========================================================

  return {
    restrict: 'A'
    templateUrl: 'components/cs-form/cs-form-template.html'
    transclude:
      fields: '?formFields'
      actions: '?formActions'
    scope:
      csFormOptions: '='
      formResource: '=' # The resource which the form is working with
      formResourceDescriptor: '=' # The resource which the form is working with
      formItem: '=?' # The resource item which the form is working with
      formParent: '=?' # The resource item which the form is working with
      formMode: '@' # 'show' / 'edit' / 'create'
      wizardPanelIndex: '=' # Cardinality of the wizard panel in which this form is rendered
      createResources: '&'
      formUpdate: '=' # Callback to handle form update action (mandatory for 'edit' forms)
      formCreate: '=' # Callback to handle form create action (mandatory for 'create' forms)
    compile: compile
  }

]
