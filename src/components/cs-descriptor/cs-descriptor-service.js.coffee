"use strict"

app = angular.module('cloudStorm.descriptorService', [])

# ===== SERVICE ===============================================================
app.service 'csDescriptorService', [ '$q', '$http', 'ResourceService', 'csResource', ($q, $http, ResourceService, csResource) ->
  @descriptors = []

  @getSync = (url) ->
    startTime = Date.now()
    waitTime = 3000
    req = new XMLHttpRequest
    req.open 'get', url, false
    req.send()
    while waitTime > Date.now() - startTime
      if req.status == 200
        return req.response
      else
        throw Error(req.statusText or 'Request failed')
    return

  @getDescriptors = () ->
    if @descriptors
      @descriptors
    else
      []

  @hasPendingPromises = () ->
    return @descriptors.some((x) -> x.$$state.status == 0)

  @addDescriptor = (descriptorUrl) ->
    unless @descriptors
      @descriptors = []

    console.log('Requesting descriptor...')
    # This is how it works:
    # data = JSON.parse(@getSync(descriptorUrl));
    # console.log('Descriptor received.');
    # @registerDescriptor(data);

    # This is how it should be done...
    request =
      method: 'GET'
      url: descriptorUrl
      headers:
        'Content-Type': 'application/json'
        'Accept': 'application/json'

    descriptorPromise = $http(request).success( (data, status, headers, config) =>
      console.log('Descriptor received.');
      @registerDescriptor(data);
    ).error( (data, status, headers, config) =>
      console.log('ERROR: Descriptor not received.')
    );

    @descriptors.push descriptorPromise;
    console.log(@hasPendingPromises());

  @registerDescriptor = (data) ->
    class Item extends csResource
      @endpoint = data.endpoint
      @base_url = data.base_url
      @descriptor = _.omit data, ['endpoint', 'base_url']

    ResourceService.register Item.descriptor.type, Item

  # For debug purposes
  window.csDescriptors = this
]
