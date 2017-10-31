"use strict"

app = angular.module("cloudStorm.descriptorPropagationSettings", [])

###############################################################################

app.provider 'csDescriptorPropagationSettings', [() ->

  @components = {

    'csForm' : {
      type : "switch",
      base : ["formMode"],
      target : ["childDescriptors", "csField", "layout"],
      rule : {
        create : "vertical",
        edit : "vertical",
        view : "horizontal",
      }
    }
  }

  @addCase = (key, object) ->
    @components[key] = object

  @$get = ->
    @

  return

]
