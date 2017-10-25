var app

app = angular.module("cloudStorm.uiPageRouter", [])

app.component("csPageRouter", {

    bindings : {
        resourceType : "<",
        id : "<",
        cmd : "<",
        pageType : "<",
    },
    templateUrl : "cs-route-provider/router-component/cs-page-router-template.html",
    controller : function($scope, $timeout, csRoute, ResourceService, csDescriptorService){

        this.testValue = "InitialValue"
        this.loading = true
        this.errors = []
        //getDataLoaderObject(this, descriptor)["index"].call()
        this.init = function (){
            switch (this.pageType) {
              case "index": this.resource_index(); break;
              case "edit":
                if(this.cmd != "edit"){
                  this.errors.push("\"" + this.cmd + "\" is not a valid command");
                }
                this.resource_id();
                break;
              case "profile":
                if(this.id == "new"){
                  this.pageType = "new"
                  this.resource();
                } else {
                  this.resource_id();
                }
                break;
              default:
                this.errors.push("This is not a valid URL");
                this.finished()
                break;
            }
        }

        this.resource = function(){

          csDescriptorService.getPromises().then(
            (function(){
              return ResourceService.get(this.resourceType)
            }).bind(this)).then(
              (function(resource){
                console.log(resource.descriptor)
                this.resource = resource
                this.finished()
              }).bind(this), (function(){
                this.errors.push("\"" + this.resourceType + "\" is not a resource")
                this.finished()
              }).bind(this)
            )
        }

        this.resource_id = function(){

          csDescriptorService.getPromises().then(
            (function(){
              return ResourceService.get(this.resourceType)
            }).bind(this)).then(
              (function(resource){
                console.log(resource.descriptor)
                this.resource = resource
                return resource.$get(this.id, {include: '*'})
              }).bind(this), (function(){
                this.errors.push("\"" + this.resourceType + "\" is not a resource")
              }).bind(this)
            ).then((function(item){
                this.item = item
                this.finished()
            }).bind(this), (function(){
              this.errors.push("There is no " + this.resource.descriptor.name + " with the id: " + this.id)
              this.finished()
            }).bind(this))
        }

        this.resource_index = function(){

          csDescriptorService.getPromises()
            .then((function(){
              return ResourceService.get(this.resourceType)
            }).bind(this))
            .then(
              (function(resource){
                console.log(resource.descriptor)
                this.resource = resource
                return resource.$index({include: '*'})
                this.finished()
              }).bind(this), (function(){
                this.errors.push("\"" + this.resourceType + "\" is not a resource")
              }).bind(this))
            .then((function(items){
                  this.items = items
                  this.finished()
              }).bind(this)
            )
        }

        this.finished = function(){
          //Prepare data for
          if(this.pageType == "edit" || this.pageType == "new"){
            var item = (this.pageType == "edit") ? this.item : {}
            var mode = (this.pageType == "edit") ? "edit" : "create"
            this.wizardOptions = {
              "resource-type" : this.resourceType,
              "form-item": item,
              "form-mode": mode,
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
          }
          this.loading = false
          $scope.$apply()
        }
        this.init()
      }
})

/*
//For later
var functionStack = {

    descriptor : {
      call : {
        type : "direct",
        fcn : (csDescriptorService.getPromises).bind(csDescriptorService),
      }, params : [],
      success : function(){},
      fail : function(){},
    },
    resource : {
      call :  {
        type : "direct",
        fcn : (ResourceService.get).bind(ResourceService)
      },
      params : [{
        type : "scopeField",
        key : "resourceType"
      }],
      success : function(data){
        this.resource = data
      },
      fail : function(){
        this.errors.push("\"" + this.resourceType + "\" is not a resource")
      }
    },
    item : {
      call : {
        type : "scopeField",
        keys : ["resource", "get"],
      },  //data.$get(this.id, {include: '*'})
      params : [{
        type : "scopeField", key : "id",
      }, {
        type : "constant", value :  {include: '*'},
      }],
      success : function(data){
          this.item = data
      },
      fail : function(){
        this.errors.push("There is no " + this.resource.descriptor.name + "with the id: " + this.id)
      }
    }
}

var cases = {
  index : ["descriptor", "resource"],
  new : ["descriptor", "resource"],
  profile : ["descriptor", "resource", "item"],
  edit : ["descriptor", "resource", "item"],
}

this.execute = function(patternType){

  var calls = []
  cases[patternType].forEach(function(call){
    calls.push(functionStack[call])
  })
  var promises = []
  calls.forEach((function(call){
    var params = getParams(this, call.params)
    var func = getFunction(this, call.call)
    promises.push(this.call(params, func).then((call.success).bind(this), (call.fail).bind(this)))
  }).bind(this))
  Promise.all(promises)()
}

var getParams = function(scope, desc){
  var params = []
  desc.forEach(function(param){
    switch(param.type){
      case "scopeField" : params.push(scope[param.key]); break;
      case "constant" : params.push(param.value); break;
    }
  })
  return params
}

var getFunction = function(scope, desc){
    switch(desc.type){
        case "scopeField" :
          var object = scope
          desc.keys.forEach(function(key){
            object = object[key]
          });
          return object
        case "direct" : return desc.fcn;
    }
}

this.call = function(params, func){
  switch(params.length){
    case 0 : return func();
    case 1 : return func(params[0]);
    case 2 : return func(params[0], params[1]);
    case 3 : return func(params[0], params[1], params[2]);
  }
}
*/

//this.execute("profile").bind(this)
