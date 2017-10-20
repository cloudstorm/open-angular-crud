"use strict"

app = angular.module('cloudStorm.profile', [])

app.directive "csProfile", ['ResourceService', 'csDescriptorService', 'csRoute', 'csAlertService', 'csResource', (ResourceService, csDescriptorService, csRoute, csAlertService, csResource) ->

  compile = ($templateElement, $templateAttributes) ->

    # Only modify the DOM in compile, use (pre/post) link for others
    $templateElement.addClass "cs-profile"

    # Pre-link: gets called for parent first
    pre: ($scope, element, attrs, controller) ->
      return

    post: link
    # Post-link: gets ca
    link = ($scope, element, attr) ->

      $scope.loading = false
      $scope.descriptor = $scope.resource.descriptor
      $scope.resources = ResourceService.getResources()

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
        csRoute.go("show", {id : id, resourceType : type})

      getArray = (relationships) ->
        if relationships == undefined
          return []
        else if relationships.data.constructor == Array
          return relationships.data
        else
          arr = []
          arr.push(relationships.data)
          return arr

      init()

  return {
    restrict: 'E'
    compile: compile
    templateUrl: 'components/cs-profile/cs-profile-template.html'
    scope:
      resourceType: '='
      itemId: '='
      resource: "<"
      item : "<"
  }
]
