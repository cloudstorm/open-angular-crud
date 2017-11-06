"use strict"

app = angular.module("cloudStorm.descriptorPropagationSettings", [])

###############################################################################

app.provider 'csDescriptorPropagationSettings', [() ->

  @components = {

    'csForm' : [{
      type : "switch",
      base : ["formMode"],
      target : ["childDescriptors", "csField", "layout"],
      rule : {
        create : "vertical",
        edit : "horizontal",
        show : "horizontal",
      }
    },{
      type : "copy",
      base : ["formMode"],
      target : ["childDescriptors", "csField", "fieldMode"],
    }]
  }

  @addCase = (key, object) ->
    if !(key of @components)
      @components[key] = []
    @components[key].push(object)

  @$get = ->
    @

  return

]
