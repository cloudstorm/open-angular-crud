app = angular.module('cloudStorm.routeProvider', [])

app.provider 'csRoute', [ '$stateProvider', ($stateProvider) ->
   
  @state 
   
  @go = (type, params) ->
    @state.go(type,params)
  
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
