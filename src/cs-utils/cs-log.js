
var app = angular.module('cloudStorm.log', [])

app.factory('csLog', [

  function(){
    var csLog = {
      log : function(){
          console.log('Factory')
        }
    }
    return csLog
  }
])
