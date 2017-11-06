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
        name: 'edit'
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
            'edit'
      }]

  @settings = defaultSettings

  @set = (option, value) ->
    @settings[option] = value
    return

  @$get = ->
    @

  return

]
