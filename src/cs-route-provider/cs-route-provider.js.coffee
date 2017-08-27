app = angular.module('cloudStorm.routeProvider', [])

app.provider 'csRoute', [ '$stateProvider', ($stateProvider) ->
   
  @state 
   
  @go = (type, params, options) ->
    @state.go(type, params, options)
 
  @transitionTo = (params) ->
    url  = ""
    for i in params
       url += "/" + i
    history.pushState(null, null, + window.location.pathname + '#' + url);
    
    ### Other solution
    @state.transitionTo(type, params, {
      location: true,
      inherit: true,
      relative: @state.$current,
      notify: false})
    ###
   
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
