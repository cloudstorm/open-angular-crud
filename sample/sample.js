var app = angular.module('cloudStormSample', [
  'cloudStorm',
])

app.component("initial", {
    template : "<div class='welcomeMessage'> Welcome to the sample app!</div>",
})

app.component("show", {
    bindings : {
      id : '<',
      resource : '<',
    },
    template : "" +
        "<div> " +
        "  <cs-profile item-id='$ctrl.id' resource-type='$ctrl.resource'></cs-profile>  "  +
        "</div> ",
})

app.component("index", {
    bindings : {
      resType : '<',
    },
    template : "" +
    		"<div> " +
    		"  <cs-index item-id='$ctrl.itemId' resource-type='$ctrl.resType' cs-index-options='options'></cs-index> " +
    		"</div> ",
    controller : function(){
        console.log("Here we are")
        this.itemId = null
    }
})

app.component("editResource", {
  
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
    component : "editResource",
     resolve : {
       id : function($transition$){
         return $transition$.params().id
       },
       resourceType : function($transition$){
         return $transition$.params().resourceType
       }
    }
}

var showResource = {
  name : "show",
  url : "/{resource}/{id}/show",
  component : "show",
  resolve : {
      id : function($transition$){
        return $transition$.params().id
      },
      resource : function($transition$){
        return $transition$.params().resource
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
  csRoute.addState(showResource)

});
