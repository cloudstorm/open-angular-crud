var app

app = angular.module("cloudStrom.uiRouterPageController", [])

app.component("csRoutePage", {

    bindings : {
        pageType : "<",
        resourceType : "<",
        id : "<",
    },
    templateUrl : "cs-route-provider/templates/router-page-template.html",
    controller : function($scope, $timeout, csRoute, ResourceService, csDataLoader, csDescriptorService){

        this.testValue = "InitialValue"
        this.loading = true
        this.errors = []

        //getDataLoaderObject(this, descriptor)["index"].call()

        var call = function(scope){

          csDescriptorService.getPromises().then(
            (function(){
              return ResourceService.get(this.resourceType)
            }).bind(scope)).then(
              (function(resource){
                console.log(resource.descriptor)
                this.resource = resource
                return resource.$get(this.id, {include: '*'})
              }).bind(scope), (function(){
                this.errors.push("\"" + this.resourceType + "\" is not a resource")
              }).bind(scope)
            ).then((function(item){
                this.item = item
                this.finished()
            }).bind(scope), (function(){
              this.errors.push("There is no " + this.resource.descriptor.name + "with the id: " + this.id)
              this.finished()
            }).bind(scope))
        }

        this.finished = function(){

          this.patternType = "edit"
          this.wizardOptions = {
            "resource-type" : this.resourceType,
            "form-item": this.item,
            "form-mode": "edit",
            "reset-on-submit": true,
            "events": {
              'wizard-canceled': (function(resource){
                  csRoute.go("type", {resourceType : this.resourceType})
                }).bind(this),
              'wizard-submited': (function(resource){
                  csRoute.go("type", {resourceType : this.resourceType})
              }).bind(this),
            }
          }
          this.loading = false
          $scope.$apply()
        }
        call(this)

      }
})


/*
var descriptor = {

    states : {
      index : ["resource"],
      new : ["resource"],
      profile : ["resource", "item"],
      edit : ["resource", "item"],
    },
    calls : {
      resource : {
        call : {
          type : "direct",
          function : csDescriptorService.getPromises.bind(csDescriptorService),
          params : [],
        }, success : function(scope){
            //How can I access here the injected service - complicated
            scope.resource = ResourceService.get(scope.resourceType)
          }
      },
      item : {
        call : {
          type : "scopeField",
          keys : ["resourceType", "$get"],
          params : [{
            type : "scopeField",
            keys : ["itemId"],
          }, {
            type : "constant",
            vale : { include : "*"}
          }]
        },
        success : {
          type : "function",
        }
      },
    }
} */

/*
var getDataLoaderObject = function(scope, desc){

    var calls = []
    var arr = desc

    var stateLoaders = new Object()
    var loader1
    var loader2
    var callName
    var callName1
    var callName2
    for(var state in desc.states){
      if(desc.states[state].length == 1){
        callName = desc.states[state][0]
        stateLoaders[state] = csDataLoader.$new(scope, callName, desc.calls[callName])
      } else {
        for(var i = desc.states[state].length - 1; i > 0; i--){
          callName1 = desc.states[state][i]
          callName2 = desc.states[state][i - 1]
          loader1 = csDataLoader.$new(scope, callName1, desc.calls[callName1])
          loader2 = csDataLoader.$new(scope, callName2, desc.calls[callName2])
          loader2.nextLoader(loader1)
        }
        stateLoaders[state] = loader2
      }
    }
    return stateLoaders
}
*/
