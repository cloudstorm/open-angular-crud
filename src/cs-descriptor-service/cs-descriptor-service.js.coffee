"use strict"

app = angular.module('cloudStorm.descriptorService', [])

# ===== SERVICE ===============================================================
app.service 'csDescriptorService', [ '$q', '$http', 'csResource', 'ResourceService'
($q, $http, csResource, ResourceService) ->


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
      else
        @registerDescriptor(response.data);
    ).catch( (response) =>
      console.log("CS-002: Error while receiving descriptor from '#{descriptorUrl}'")
    );

    @descriptors.push descriptorPromise

  @registerDescriptor = (data) ->

    @desc.push (data)
    console.log(data)
    class Resource extends csResource
      @endpoint = data.endpoint
      @base_url = data.base_url
      @descriptor = _.omit data, ['endpoint', 'base_url']
      @loaded = false
      @data = null
    console.log(Resource)
    try
      ResourceService.register Resource.descriptor.type, Resource
    catch ex
      console.log("Creating Resource class fails", ex)


  # For debug purposes
  window.csDescriptors = this
]
