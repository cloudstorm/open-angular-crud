"use strict"

app = angular.module('cloudStorm.descriptorService', [])

# ===== SERVICE ===============================================================
app.service 'csDescriptorService', [ '$q', '$http', 'ResourceService', 'csResource', ($q, $http, ResourceService, csResource) ->
  @descriptors = []

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
    class Resource extends csResource
      @endpoint = data.endpoint
      @base_url = data.base_url
      @descriptor = _.omit data, ['endpoint', 'base_url']
      @loaded = false
      @data = null
    ResourceService.register Resource.descriptor.type, Resource

  # For debug purposes
  window.csDescriptors = this
]
