var app = angular.module('cloudStormSample', [
  'cloudStorm',
])


var index = {
  name: 'type',
  url: '/{resourceType}',
  component : "csUIRouteIndex", 
  resolve : {
    resourceType : function($transition$){
      return $transition$.params().resourceType
    }
  }
}

var edit = {
    name : "id",
    url : "/{resourceType}/{id}/{cmd}",
    component : "csUIRouteEdit",
     resolve : {
       id : function($transition$){
         return $transition$.params().id
       },
       resourceType : function($transition$){
         return $transition$.params().resourceType
       },  
       cmd : function($transition$){
         return $transition$.params().cmd
       }
    }
}

var show_new = {
  name : "show",
  url : "/{resourceType}/{id}",
  component : "csUIRouteShowNew",
  resolve : {
      id : function($transition$){
        return $transition$.params().id
      },
      resourceType : function($transition$){
        return $transition$.params().resourceType
      },
   }
}

app.controller('MainCtrl', function($scope, csAlertService, csDescriptorService, csRoute, $state) {
  
  csDescriptorService.registerDescriptorUrl('resourceDescriptors/itemResourceDescriptor.json');
  csDescriptorService.registerDescriptorUrl('resourceDescriptors/categoryResourceDescriptor.json');
  csDescriptorService.registerDescriptorUrl('resourceDescriptors/userResourceDescriptor.json');
  
  csRoute.setState($state)
  csRoute.addState(index)
  csRoute.addState(edit)
  csRoute.addState(show_new)
});
