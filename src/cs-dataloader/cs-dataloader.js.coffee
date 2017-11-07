"use strict"

app = angular.module('cloudStorm.csDataLoaderFactory', [])

app.factory 'csDataLoader', ['csDataStore', 'csDescriptorService', (csDataStore, csDescriptorService) ->

  getCallFcn = () ->

    a =
      type: 'direct'
      func: csDescriptorService.getPromises.bind(csDescriptorService)
      params: []
    return a

  class DataLoader

    constructor: (scope, name, descriptor) ->

      @.scope = scope
      @.name = name
      @.descriptor = descriptor
      # Setting the variables
      if descriptor == undefined
        console.error "Descriptor is not defined"

    #Initiating functions
    nextLoader: (nextLoader) ->
      @nextLoader = nextLoader

    call: () ->

      @.setCallFcn()
      @.setParams()
      @.scope.testValue = "Somevalue"
      getCallFcn().func().then(
        ((data) ->
          console.log data
          @.scope.data = data
        ).bind(this)
      )
      #DataLoader.execute()
      ###
      switch @params.length
        when 0
          @callFcn().then(
            (data) ->
              console.log(@scope)
              @success(@scope, data)
              console.log(@scope)
            )
        when 1
          @callFcn(@params[0]).then(
            @success(data)
          )
        when 2
          @callFcn(@params[0],@params[1]).then(
            @success(data)
          )
      ###

    success: (data) ->
      @.scope[@.name] = data
      @.descriptor.success(@.scope)
      if @.nextLoader
        @.nextLoader.call()
      else
        #Finish
        @scope.loading = false

    @$new: (scope, name, descriptor) ->

      return new @(scope, name, descriptor)

    @execute: () ->
      console.log "execute"

    setCallFcn: () ->
      if @descriptor.call.type == "direct"
        @.callFcn = @descriptor.call.function
      else if @descriptor.call.type == "scopeField"
        object = @.scope
        @.descriptor.call.keys.forEach (key) ->
          object = object[key]
        @.callFcn = object

    setParams: () ->
        @params = []
        for param in @descriptor.call.params.length
          if param.type == "constant"
            @params.push(param.value)
          else if param.type == "scopeField"
            object = @.scope
            for key in param.keys
              object = object[key]
            @params.push(object)

  return DataLoader
]
