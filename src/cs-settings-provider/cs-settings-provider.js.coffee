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

  @getOverride = (object) ->

    object.pageType
    object.fieldType
    object.resourceType

    if object.pageType && object.resourceType
      if @overrides[object.pageType]
        if @overrides[object.pageType][object.resourceType]
          return @overrides[object.pageType][object.resourceType]


  # The settings are

  @getIndexOptions = (pageType, resourceType) ->

    if @overrides['index']
      overrides = []
      for override in @overrides[index]
        if @overrides['index'][resourceType]
          return @overrides['index'][resourceType]
    return null

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
