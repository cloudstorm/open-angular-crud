"use strict"

app = angular.module('cloudStorm.profile', [])

app.directive "csProfile", ['ResourceService', 'csDescriptorService', 'csRoute', 'csAlertService', (ResourceService, csDescriptorService, csRoute, csAlertService) ->
  
  compile = ($templateElement, $templateAttributes) ->

    # Only modify the DOM in compile, use (pre/post) link for others
    $templateElement.addClass "cs-profile"

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
        $scope.resources = ResourceService.getResources()
        
        loadData = () ->
          resource.$index({include: '*'}).then(
            # successCallback
            (items) ->
              resource.loaded = true
              $scope.collection = items
              resource.data = items
              $scope.item = getItem(items, $scope.itemId)
              #$scope.relatedCategories = $scope.getRelatedItems("categories")
              init()
              if $scope.item == null
                csAlertService.addAlert($scope.i18n?.t('alert.resource_not_found') + $scope.itemId, 'danger')
            # errorCallback
            (reason) ->
              $scope.collection = null
            # notifyCallback
            () ->
          )
        
        init = () ->
         
          resources = []
          $scope.relations = []
          for field in $scope.descriptor.fields
            if field.type == 'resource'  
              $scope.relations.push({
                label : field.label
                resourceType : field.resource
                items : $scope.getRelatedItems(field.relationship, field.resource)
              })
          console.log $scope.relations    

        getItem = (items, id) ->

          item = null
          if $scope.itemId != null
            for res in items
              if res.id == id.toString()
                item = res 
                break
          item
        
        loadData()
        
        $scope.getValue = (attribute) ->
          if $scope && $scope.item
            return $scope.item.attributes[attribute]
        
        $scope.getValue = (attribute) ->
          if $scope && $scope.item
            return $scope.item.attributes[attribute]

        $scope.getRelatedItems = (relationship, type) ->

          if $scope && $scope.item
            items = []
            relationships = getArray($scope.item.relationships[relationship])
            for rel in relationships
              resources = $scope.item.$datastore.repository[rel.type]
              item = resources[rel.id]   
              items.push({ id : item.id, label : getFirstField(item, type)})
            return items
        
        getFirstField = (item, type) ->
        
          field = $scope.resources[type].descriptor.fields[0].attribute
          return item.attributes[field]
        
        $scope.go = (id, type) ->
          csRoute.go("show", {resource : type, id : id})

        getArray = (relationships) ->
          if relationships == undefined
            return []
          else if relationships.data.constructor == Array 
            return relationships.data
          else
            arr = []
            arr.push(relationships.data)
            return arr

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