
var app = angular.module('cloudStorm.log', [])

app.factory('csLog', [

  function(){

    var diff, now;
    var csLog = {

      diff : function(){
        //Returns the difference in second to the last log in the following format
        var now = new Date().getTime()
        if(csLog.last){
          diff = (now - csLog.last)/1000
        } else {
          diff = 0
        }
        csLog.last = now
        return diff + " (sec)"
      },

      set : function(scope, componentName, enabled){
          //Initially the log is disabled
          scope.logEnabled = false || enabled
          scope.log = function(msg){
            if(scope.logEnabled){
              //Format i.e.:
              //0,342 (sec) | cs-form - Started
              console.log(csLog.diff()+ " | " + componentName + " - " , msg)
            }
          }
      },

      enable : function(scope){
        scope.logEnabled = true
      },

      disable : function(scope){
        scope.logEnabled = false
      }

    }
    return csLog
  }
])
