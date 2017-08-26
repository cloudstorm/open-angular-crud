var app = angular.module('cloudStormSample', [
  'cloudStorm',
])

app.component("index", {
    bindings : {
      resType : '<',
    },
    template : "" +
    		"<div> " +
    		"  <cs-index item-id='$ctrl.itemId' resource-type='$ctrl.resType' cs-index-options='options'></cs-index> " +
    		"</div> ",
    controller : function(){
        this.itemId = 1
    }
})

app.component("showResource", {
  
    bindings : {
      id : "<",
      resourceType : "<"
    },
    template : "" +
        "<div> " +
        "  <cs-index item-id='$ctrl.id' resource-type='$ctrl.resourceType' cs-index-options='options'></cs-index> " +
        "</div> ",
    controller : function(){
        console.log("Loaded the show component")
    }
})

app.component("showHide", {
  
    bindings : {
      showHide : "<"
    },
    template : "" +
        "<div> " +
           "ShowHideTemplate" +
        "</div> ",
    controller : function(){
        console.log("Loaded the show hide component")
    }
})

app.component("edit", {
    bindings : {
      item : "<",
      resourceType : "<",
    },
    template : "<div> " +
    		"         <cs-index-sidepanel " +
    		"           ng-if='true' " +
    		"           resource-type='{{$ctrl.resourceType}}'" +
    		"           item='{{$ctrl.item}}'" +
    		"           ng-class='{'col-lg-4' : 'true'}'> " +
    		"         </cs-index-sidepanel>" +
    		"        </div> ",
    controller : function(){
      
    }
})

//app.config(function() {

var type = {
  name: 'type',
  //url : '/about',
  url: '/{resourceType}',
  component : "index", 
  resolve : {
    resType : function($transition$){
      console.log("Type resolve")
      console.log($transition$.params())
      return $transition$.params().resourceType
    }
  }
}

var id = {
    name : "id",
    url : "/{resourceType}/{id}",
    component : "showResource",
     resolve : {
       id : function($transition$){
         return $transition$.params().id
       },
       resourceType : function($transition$){
         return $transition$.params().resourceType
       }
    }
}

var showHide = {
    name : "type.id.show",
    url : "/{showHide}",
    component : "showHide",
    resolve : {
       showHide : function($transition$){
         console.log("ShowHide resolve")
         console.log($transition$.params())
         return "showHide"
       }
    }
}

app.controller('MainCtrl', function($scope, csAlertService, csDescriptorService, csRoute, $state) {
  csDescriptorService.registerDescriptorUrl('resourceDescriptors/itemResourceDescriptor.json');
  csDescriptorService.registerDescriptorUrl('resourceDescriptors/categoryResourceDescriptor.json');
  csDescriptorService.registerDescriptorUrl('resourceDescriptors/userResourceDescriptor.json');

  csRoute.setState($state)
  csRoute.addState(type)
  csRoute.addState(id)
  csRoute.addState(showHide)
    
  csAlertService.addAlert('Welcome to CloudStorm', 'info');
  $scope.resourceType = 'categories';
  

});
