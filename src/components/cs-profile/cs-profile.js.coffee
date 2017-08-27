"use strict"

app = angular.module('cloudStorm.profile', [])

app.directive "csProfile", ['ResourceService', 'csDescriptorService', (ResourceService, csDescriptorService) ->
  
  compile = ($templateElement, $templateAttributes) ->

    # Only modify the DOM in compile, use (pre/post) link for others
    #$templateElement.addClass "cs-index-sidepanel"

    # Pre-link: gets called for parent first
    pre: ($scope, element, attrs, controller) ->
      return

    
    post: link
    # Post-link: gets ca
    link = ($scope, element, attr) ->
      
      console.log ($scope.itemId + ' ' + $scope.resourceType)
      csDescriptorService.getPromises().then () ->
        resource = ResourceService.get($scope.resourceType)
        $scope.descriptor = resource.descriptor
        
        loadData = () ->
          resource.$index({include: '*'}).then(
            # successCallback
            (items) ->
              resource.loaded = true
              $scope.collection = items
              resource.data = items
              setSelectedItem()
            # errorCallback
            (reason) ->
              $scope.collection = null
            # notifyCallback
            () ->
          )
        
        setSelectedItem = () ->
        
          if $scope.itemId != null
            for res in $scope.collection
              if res.id == $scope.itemId.toString()
                $scope.item = res 
                break
            if $scope.item == null
              csAlertService.addAlert($scope.i18n?.t('alert.resource_not_found') + $scope.itemId, 'danger')
        
        loadData()
        
        $scope.getValue = (attribute) ->
          if $scope && $scope.item
            return $scope.item.attributes[attribute]
        
      return

  return {
    restrict: 'E'
    compile: compile
    templateUrl: 'components/cs-profile/cs-profile-template.html'
    scope:
      resourceType: '='
      itemId: '='
  }
]