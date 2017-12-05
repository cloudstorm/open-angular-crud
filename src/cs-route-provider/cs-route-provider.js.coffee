"use strict"

app = angular.module('cloudStorm.routeProvider', [])

app.provider 'csRoute', ['$stateProvider', 'csSettingsProvider', ($stateProvider, csSettingsProvider) ->

  @state

  @go = (type, params, options) ->
    @state.go(csSettingsProvider.settings['router-path-prefix'] + type, params, options)

  @setState = (state) ->
    @state = state

  @addState = (config) ->
     $stateProvider.state(config)

  @$get = ->
    @

  @init = ->
    for state in csSettingsProvider.settings['router-states']()
      @setState (@addState state).$get()

  return

]
