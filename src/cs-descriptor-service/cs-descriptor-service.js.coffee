"use strict"

app = angular.module('cloudStorm.descriptorService', [])

# ===== SERVICE ===============================================================
app.service 'csDescriptorService', [ '$q', '$http', 'ResourceService', 'csResource', 'csResourceOperation', ($q, $http, ResourceService, csResource, csResourceOperation) ->

  @descriptors = []
  @desc = []
  @resources = {}

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
        console.log("descriptorPromise - array")
        response.data.forEach (descriptor) => @registerDescriptor(descriptor);
        @getInverse()
      else
        console.log("descriptorPromise")
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
    @resources[Resource.descriptor.type] = Resource
    ResourceService.register Resource.descriptor.type, Resource

  @getInverse = () ->

      # Descriptor scheme
      ### [{ attributes_to_hide,
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

      console.log(@desc)

      # 1st - Select
      # [{ type, fields : { ... } }]
      object = csResourceOperation.select(@desc, ["type", "fields"])


      # 2nd - Filter and select relationships
            # [{ type, fields : { relationship", resource} }]

      object = csResourceOperation.where(object, {
        field : "fields",
        select : ["relationship", "resource"],
        query : { type : "resource"}
      })

      console.log("---------- where ----------")
      console.log(object)

      # 2nd
      # [{ type, fields : [{ relationship, resource }]}]
      #  [{ fields : [{ subject : type, relationship, resource }] }]
      # object = csResourceOperation.ungroup(object, {
      #   field : "fields",
      #   operation : "unGroup",
      #   base : "type",
      #   result : "subject"
      # })


      # # 3rd
      # #  [{ fields : [{ subject : type, relationship, resource }] }]
      # #   -->  [{ subject : type, relationship, resource }]
      #
      # object = csResourceOperation.mergeArray(object, {
      #   field : "fields",
      # })
      #
      #
      # # 4th
      # # [{ subject, relationship, resource }]
      # #  -->[{ subject, relationship, object : resource }]
      #
      # object = csResourceOperation.rename(object, {
      #   base : "resource",
      #   to : "object"
      # })
      #
      # # 5th
      # # [{ subject, relationship, resource }]
      # #  -->[{ subject, relationship, object : resource }]
      #
      #
      # # 0th
      # # { resourceName : { "descriptor" : {}}}
      # #  -> { resourceName : {} }
      # object = csResourceOperation.compactObject(@resources, "descriptor")
      #
      # console.log("--------------- Object ----------------")
      # console.log(object)
      # # 1st
      # # { type : { fields : [ { attribute, resource } | type == "resource" ] }}
      # #   -> { type : { fields : [ { attribute, resource }] }}
      #
      # object = csResourceOperation.deepWhere(object, "fields", { type : "resource"})
      #
      # # 2nd
      # # { type : { fields : [ { attribute, resource }] }}
      # #  -> { type : { attribute, resource }] }
      # object = csResourceOperation.compactObject(object, "fields")
      #
      # # 3rd
      # # { type : [{ attribute, resource }] }
      # #   -> [ { "subject" : type, attribute, resource}]
      # object = csResourceOperation.arrayFromObject(object, "subject")
      #
      # # 4th
      # # [ {subject, attribute, resource}]
      # #   -> [ {subject, attribute, "object" : resource}]
      # object = csResourceOperation.renameKey(object, "object", "resource")
      #
      # # 5th
      # # [ {subject, attribute, object}]
      # #   ->  { attribute : { subject, object}}
      # object = _.indexBy(object, "attribute")
      #
      # console.log(object)

  # For debug purposes
  window.csDescriptors = this
]
