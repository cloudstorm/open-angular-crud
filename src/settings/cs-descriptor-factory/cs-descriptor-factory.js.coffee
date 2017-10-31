"use strict"

app = angular.module('cloudStorm.descriptorFactory', [])

####################################################################################################
app.factory 'csDescriptorFactory', [ 'csLayoutSettings', 'csDescriptorPropagationSettings', (csLayoutSettings, csDescriptorPropagationSettings) ->
####################################################################################################

  processData = (scope) ->

    ## At first check the csDescriptorPropagationSettings
    if csDescriptorPropagationSettings.components[scope.descriptor.name]
      propagate(scope)

    if csLayoutSettings.components[scope.descriptor.name]
      setStyle(scope)

    #It loads the style descriptors too.

  propagate = (scope) ->

    descriptor =  csDescriptorPropagationSettings.components[scope.descriptor.name]
    base = getBase(scope, descriptor.base)
    value = null
    switch descriptor.type
      when "switch" then value = descriptor.rule[base]
      when "copy" then value = base
      else break
    setTarget(scope, descriptor.target, value)

  getBase = (scope, keys) ->

    object = scope
    for key in keys
      if key of object
        object = object[key]
      else
        throw new Error("CS-101: Key: '" + key + "' is not defined\n" +
              "Templatename : " + scope.descriptor.name);

    return object

  setTarget = (scope, keys, val) ->

    firstKey = keys.shift()
    if(keys.length > 0)
      lastKey = keys.pop()
      object = getObject(lastKey, val)
      lastKeys = keys.reverse()
      for key in lastKeys
        object = getObject(key, object)
    else
      object = val
    scope[firstKey] = object

  setStyle = (scope) ->
    null

  getObject = (key, value) ->
    object = {}
    object[key] = value
    object

  get = ->
    @

##################################################################################################

  ##################################################################################################

  return {
    get: get
    processData: processData
    setStyle: setStyle
    setTarget: setTarget
  }

  ##################################################################################################
]

  # ##################################################################################################

  #   to_json: () ->
  #     object = {}
  #     object[Resource.descriptor.type] = _.pick(@, _.map(Resource.descriptor.fields, ((field) -> field.attribute)))
  #     return object

  # ##################################################################################################
