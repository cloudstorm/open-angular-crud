"use strict"

app = angular.module("cloudStorm.settings", [])

###############################################################################

app.provider 'csSettings', ['csLocalizationProvider', (csLocalizationProvider) ->

  defaultSettings = {
    'i18n-engine': csLocalizationProvider.$get()
    'date-format': 'yyyy-MM-dd'
    'datetime-format': 'yyyy-MM-ddThh:mm:ss.sss'
    'time-zone-offset': 'utc'
  }

  @overrides = {}

  ###
  @getOverride = (object) ->

    object.pageType
    object.fieldType
    object.resourceType

    if object.pageType && object.resourceType
      if @overrides[object.pageType]
        if @overrides[object.pageType][object.resourceType]
          return @overrides[object.pageType][object.resourceType]

  @addOverride = (address, definition)

    if address.pageType && address.resourceTyoe
      if !@overrides[address.pageType]
        @overrides[address.pageType] = {}
      @overrides[address.pageType][address.resourceType] = definition
  ###

  @addOverride = (override) ->

    if !@overrides[override.conditions.component]
      @overrides[override.conditions.component] = []

    @overrides[override.conditions.component].push(override)
    console.log @overrides

  # The settings are
  @setOverrides = (scope) ->

    if @overrides[scope.componentName]
      flag = true
      for key,value in override.conditions
        if scope[key] != value
          flag = false
          break
      if flag
        scope.childOptions[override.componentToOverride] = override.definition

  ###
  if @overrides['index']
    overrides = []
    for override in @overrides[index]
      if @overrides['index'][resourceType]
        return @overrides['index'][resourceType]
  ###


  @states = [
      {
        name: 'index'
        url: '/{resourceType}'
        component: 'csPageRouter'
        resolve:
          resourceType: ($transition$) ->
            $transition$.params().resourceType
          pageType: ($transition$) ->
            'index'
      },{
        name: 'show'
        url: '/{resourceType}/{id}'
        component: 'csPageRouter'
        resolve:
          resourceType: ($transition$) ->
            $transition$.params().resourceType
          id: ($transition$) ->
            $transition$.params().id
          pageType: ($transition$) ->
            'show'
      },{
        name: 'cmd'
        url: '/{resourceType}/{id}/{cmd}'
        component: 'csPageRouter'
        resolve:
          resourceType: ($transition$) ->
            $transition$.params().resourceType
          id: ($transition$) ->
            $transition$.params().id
          cmd: ($transition$) ->
            $transition$.params().cmd
          pageType: ($transition$) ->
            'cmd'
      }]

  @settings = defaultSettings

  @set = (option, value) ->
    @settings[option] = value
    return

  @$get = ->
    @

  return

]
