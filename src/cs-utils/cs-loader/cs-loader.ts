var app;

declare var angular: any;

app = angular.module('cloudStorm.loader', [])

app.component("csLoader", {
  bindings : {
      color : '<',
      radius : '<',
    },
    templateUrl : 'cs-utils/cs-loader/cs-loader-template.html',
    controller : [ 'csInputBase', function(csInputBase){

      console.log("-------------- CS LOADER --------------")
      this.x = "kutya"
      csInputBase(this)
      this.testFunction = function(){
        this.x = "mutya"
      }
      this.testFunction()
    }]
})
