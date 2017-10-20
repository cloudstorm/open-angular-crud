var app = angular.module('cloudStormSample', [
  'cloudStorm',
])

var index = {
  name: 'type',
  url: '/{resourceType}',
  component : "csPageRouter",
  resolve : {
    resourceType : function($transition$){
      return $transition$.params().resourceType
    },
    pageType : function($transition$){
      return "index"
    },
  }
}

var show_new = {
  name : "show",
  url : "/{resourceType}/{id}",
  component : "csPageRouter",
  resolve : {
      resourceType : function($transition$){
        return $transition$.params().resourceType
      },
      id : function($transition$){
        return $transition$.params().id
      },
      pageType : function($transition$){
        return "profile"
      },
   }
 }

var edit = {
    name : "id",
    url : "/{resourceType}/{id}/{cmd}",
    component : "csPageRouter",
     resolve : {
       resourceType : function($transition$){
         return $transition$.params().resourceType
       },
       id : function($transition$){
         return $transition$.params().id
       },
       cmd : function($transition$){
         return $transition$.params().cmd
       },
       pageType : function($transition$){
         return "edit"
       },
    }
}

app.controller('MainCtrl', function($scope, csAlertService, csDescriptorService, csRoute, $state) {

  csDescriptorService.registerDescriptorUrl('resourceDescriptors/itemResourceDescriptor.json');
  csDescriptorService.registerDescriptorUrl('resourceDescriptors/categoryResourceDescriptor.json');
  csDescriptorService.registerDescriptorUrl('resourceDescriptors/userResourceDescriptor.json');

  csRoute.setState($state)
  csRoute.addState(index)
  csRoute.addState(show_new)
  csRoute.addState(edit)
});
