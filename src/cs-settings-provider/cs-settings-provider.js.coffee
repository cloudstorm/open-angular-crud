"use strict"

app = angular.module("cloudStorm.settings", [])

###############################################################################

app.provider 'csSettings', ['csLocalizationProvider', (csLocalizationProvider) ->

  states = () =>
    return [{
      name: @settings['router-path-prefix'] + 'index'
      url: '/{resourceType}'
      component: 'csIndex'
      resolve:
        resourceType: ['$transition$', ($transition$) ->
          $transition$.params().resourceType
        ]
    },{
      name: @settings['router-path-prefix'] + 'show'
      url: '/{resourceType}/{id}'
      component: 'csPageRouter'
      resolve:
        resourceType: ['$transition$', ($transition$) ->
          $transition$.params().resourceType
        ]
        id: ['$transition$', ($transition$) ->
          $transition$.params().id
        ]
        pageType: ['$transition$', ($transition$) ->
          'show'
        ]
    },{
      name: @settings['router-path-prefix'] + 'cmd'
      url: '/{resourceType}/{id}/{cmd}'
      component: 'csPageRouter'
      resolve:
        resourceType: ['$transition$', ($transition$) ->
          $transition$.params().resourceType
        ]
        id: ['$transition$', ($transition$) ->
          $transition$.params().id
        ]
        cmd: ['$transition$', ($transition$) ->
          $transition$.params().cmd
        ]
        pageType: ['$transition$', ($transition$) ->
          'cmd'
        ]
    }]

  defaultSettings = {
    'i18n-engine': csLocalizationProvider.$get()
    'date-format': 'yyyy-MM-dd'
    'datetime-format': 'yyyy-MM-ddThh:mm:ss.sss'
    'time-zone-offset': 'utc',
    'router-path-prefix': '',
    'router-states': states,
    'app-title': 'CloudStorm Sample App'
  }

  @settings = defaultSettings

  @set = (option, value) ->
    @settings[option] = value
    return

  @$get = ->
    @

  return

]
