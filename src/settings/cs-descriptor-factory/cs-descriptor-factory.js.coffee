"use strict"

app = angular.module('cloudStorm.descriptorFactory', [])

####################################################################################################
app.factory 'csDescriptorFactory', [ 'csErrorFactory', 'csLayoutSettings', 'csDescriptorPropagationSettings', 'csHashService', (csErrorFactory, csLayoutSettings, csDescriptorPropagationSettings, csHashService) ->
####################################################################################################


  init = (scope, name) ->
    if !scope.descriptor
      scope.descriptor = {}
    scope.descriptor.name = name
    processData(scope)

  processData = (scope) ->

    ## At first check the csDescriptorPropagationSettings
    if scope.descriptor.name of csDescriptorPropagationSettings.components
      defs = csDescriptorPropagationSettings.components[scope.descriptor.name]
      for def in defs
        propagate(scope, def)

    #if scope.descriptor.name of csLayoutSettings.style
    #setStyle(scope, csLayoutSettings.style[scope.descriptor.name])

    #It loads the style descriptors too.

  process = (variable, def) ->

    base = getBase(def, value)
    value = getValue(base, def)
    objectInstance = getObject(def, value)
    variable = objectInstance.get(variable)

  getObject = (def) ->

    lastKey = def.target.pop()
    keys = def.target.reverse()
    object = new _Value_(lastKey, value)
    for key in keys
      object = new _Object_(key, object)
    object

  setValue = (variable, objectInstance) ->


  propagate = (scope, descriptor) ->

    base = getBase(scope, descriptor.base)
    value = null
    switch descriptor.type
      when "switch" then value = descriptor.rule[base]
      when "copy" then value = base
      else throw new Error("Type '" + descriptor.type + "' is not a valid propagation type.")

    def = prepareTarget(scope, descriptor.target)
    setTarget(def[0], def[1], value)

  getBase = (scope, keys) ->

    object = scope
    for key in keys
      if (typeof object) == 'object'
        if key of object
          object = object[key]
        else
          csErrorFactory.throw 'csDescriptorFactory', 'baseNotDefined', [keys]
      else
        csErrorFactory.throw 'csDescriptorFactory', 'intermediate', [keys, lastKey]
      lastKey = key

    return object

  prepareTarget = (scope, _keys_) ->

    object = scope
    num = 0
    keys = null
    for key in _keys_
      if key of object
        if (typeof object[key]) == 'object'
          object = object[key]
        else
          csErrorFactory.throw "csDescriptorFactory", "overlap", [_keys_]
      else
        keys = _keys_.slice(num)
      num++

    [object, keys]

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

  setStyle = (scope, styleDef) ->

    #csHashService.map(style, scope.descriptor.layout, "CS-DS001 : No template defined for this layout!")
    # Iterate on the keys
    styleObject = {}
    for varName, def in styleDef
      for className, value in def[scope[varName]]
        stylObject[className] = value

    scope.descriptor.style = styleObject

  getObject = (key, value) ->
    if (value instanceof Object)
      if(key of value)
        value[key]
      else
        newObject(key, value)
    else
      newObject(key, value)

  newObject = (key, value) ->
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
    getBase: getBase
    propagate: propagate
    processData: processData
    setStyle: setStyle
    setTarget: setTarget
    getObject: getObject
    prepareTarget: prepareTarget
  }

  ##################################################################################################
]

  # ##################################################################################################

  #   to_json: () ->
  #     object = {}
  #     object[Resource.descriptor.type] = _.pick(@, _.map(Resource.descriptor.fields, ((field) -> field.attribute)))
  #     return object

  # ##################################################################################################
