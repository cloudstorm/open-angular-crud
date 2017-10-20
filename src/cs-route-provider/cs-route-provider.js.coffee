"use strict"

app = angular.module('cloudStorm.routeProvider', [])

app.provider 'csRoute', ['$stateProvider', 'csSettingsProvider', ($stateProvider, csSettingsProvider) ->

  @state

  @go = (type, params, options) ->
    @state.go(type, params, options)

  @transitionTo = (type, params) ->

    @state.go(type, params, {
      location: true,
      reload : false,
      inherit: true,
      relative: @state.$current,
      notify: false})

  @setState = (state) ->
    @state = state

  @addState = (config) ->
     $stateProvider.state(config)

  @$get = ->
    @

  for state in csSettingsProvider.states
    @addState state

  return

]
