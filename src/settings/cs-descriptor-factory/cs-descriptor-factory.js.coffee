"use strict"

app = angular.module('cloudStorm.descriptorFactory', [])

####################################################################################################
app.factory 'csDescriptorFactory', [ 'csLayoutSettings', 'csDescriptorPropagationSettings', 'csHashService', (csLayoutSettings, csDescriptorPropagationSettings, csHashService) ->
####################################################################################################

  init = (scope, name) ->
    if !scope.descriptor
      scope.descriptor = {}
    scope.descriptor.name = name
    processData(scope)

  processData = (scope) ->

    ## At first check the csDescriptorPropagationSettings
    if scope.descriptor.name of csDescriptorPropagationSettings.components
      propagate(scope)

    if scope.descriptor.name of csLayoutSettings.style
      setStyle(scope, csLayoutSettings.style[scope.descriptor.name])

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

  setStyle = (scope, style) ->

    csHashService.map(style, scope.descriptor.layout, "CS-DS001 : No template defined for this layout!")
    scope.descriptor.style = style[scope.descriptor.layout]

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
    init: init
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
