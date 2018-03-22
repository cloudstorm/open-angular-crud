
var app = angular.module('cloudStorm.log', [])

app.factory('csLog', [

  function(){

    var csLog = {

      //Initially the log is disabled
      set : function(scope, componentName, enabled){

          scope.logEnabled = false || enable
          scope.log = function(msg){
            if(scope.logEnabled){
              console.log(componentName, msg)
            }
          }
      },

      enable : function(scope){
        scope.logEnabled = true
      }

      disable : function(scope){
        scope.logEnabled = false
      }

    }
    return csLog
  }
])
