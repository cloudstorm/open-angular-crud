"use strict"

app = angular.module("cloudStorm.settings", [])

###############################################################################


#app.provider 'csSettings', ['csLocalizationProvider', 'csDataOpsProvider', (csLocalizationProvider, csDataOpsProvider) ->
app.provider 'csSettings', ['csLocalizationProvider', (csLocalizationProvider) ->

  defaultSettings = {
    'i18n-engine': csLocalizationProvider.$get()
    'date-format': 'yyyy-MM-dd'
    'datetime-format': 'yyyy-MM-ddThh:mm:ss.sss'
    'time-zone-offset': 'utc'
  }

  @overrides = {}

  @addOverride = (override) ->

    if !@overrides[override.baseComponent]
      @overrides[override.baseComponent] = []

    @overrides[override.baseComponent].push(override)
    console.log @overrides

  @setOverride = (scope) ->

    if @overrides[scope.componentName]
      for override in @overrides[scope.componentName]
        flag = true
        for key,value of override.conditions
          if scope[key] != value
            flag = false
            break
        if flag
          #csDataOpsProvider.object(scope, 'childOptions')
          #csDataOpsProvider.object(scope.childOptions, override.componentToOverride)
          #csDataOpsProvider.object(scope.childOptions[override.componentToOverride], 'override')
          scope.childOptions[override.componentToOverride].override = override.definition
          return true
        else
          return false


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
