app = angular.module('cloudStorm.routeProvider', [])

app.provider 'csRoute', ['$stateProvider', ($stateProvider) ->

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

  return

]

app.service 'csRouteService', ['$state', ($state) ->

  @go = (type, params) ->
    $state.go(type,params)

  @
]

app.controller 'csRouteController', ['$location', ($location) ->

]
