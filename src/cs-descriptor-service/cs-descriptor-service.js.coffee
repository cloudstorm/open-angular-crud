"use strict"

app = angular.module('cloudStorm.descriptorService', [])

# ===== SERVICE ===============================================================
app.service 'csDescriptorService', [ '$q', '$http', 'ResourceService', 'csResource', 'csResourceOperation', ($q, $http, ResourceService, csResource, csResourceOperation) ->


  ### Descriptor = [{ attributes_to_hide,
        base_url,
        display : { name },
        endpoint,
        fields : [{
          attribute,
          cardinality,
          label,
          read_only,
          relationship,
          required,
          resource,
          type }]
      }]
  ###
  @inverseSubject = null
  @descriptors = []
  @desc = []
  @postRemoves = []
  # @desc = [Descriptor]

  @pendingOperations = {}
  # @pedingOperation = {
  #  relationship :  [{
  #      subject : Resource{ type, id},
  #      object : Resource{type, id}
  #   }]
  # }


  @getDescriptors = () ->
    if @descriptors
      @descriptors
    else
      []

  @hasPendingPromises = () ->
    return @descriptors.some((x) -> x.$$state.status == 0)

  @getPromises = () ->
    return Promise.all(@getDescriptors())

  @registerDescriptorUrl = (descriptorUrl) ->
    unless @descriptors
      @descriptors = []

    request =
      method: 'GET'
      url: descriptorUrl
      headers:
        'Content-Type': 'application/json'
        'Accept': 'application/json'

    descriptorPromise = $http(request).then( (response) =>
      typeIsArray = Array.isArray || ( value ) -> return {}.toString.call( value ) is '[object Array]'
      if typeIsArray response.data
        response.data.forEach (descriptor) => @registerDescriptor(descriptor);
        @processDescriptors()
      else
        @registerDescriptor(response.data);
    ).catch( (response) =>
      console.log("CS-002: Error while receiving descriptor from '#{descriptorUrl}'")
    );

    @descriptors.push descriptorPromise

  @registerDescriptor = (data) ->

    @desc.push (data)
    class Resource extends csResource
      @endpoint = data.endpoint
      @base_url = data.base_url
      @descriptor = _.omit data, ['endpoint', 'base_url']
      @loaded = false
      @data = null
    ResourceService.register Resource.descriptor.type, Resource

  @processDescriptors = () ->

      # 1st - Select
      object = csResourceOperation.select(@desc, ["type", "fields"])
      # --> [{ type, fields : { ... } }]

      # 2nd - Filter and select relationships
      object = csResourceOperation.where(object, {
        field : "fields",
        select : ["relationship", "cardinality", "resource"],
        query : { type : "resource"}
      })
      # --> [{ type, fields : { relationship , cardinality, resource | type == "resource"} }]

      # 3rd
      object = csResourceOperation.putKeyInside(object, {
        field : "fields"
        keyToPutIn : "type"
        newKey : "subject"
      })
      # --> [{ fields : [{"subject" : type,  relationship", cardinality, resource}] }]

      # 4th
      object = csResourceOperation.mergeArrays(object, "fields")
      # --> [{subject, relationship, cardinality, resource}]

      # 5th
      object = csResourceOperation.renameKey(object, "object", "resource")
      # --> [{subject, relationship, cardinality, object : resource}]

      @rels = object
      ResourceService.setRelationships(object)

  # For debug purposes
  window.csDescriptors = this
]
