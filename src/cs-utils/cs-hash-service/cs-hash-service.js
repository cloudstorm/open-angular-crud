
var app = angular.module('cloudStorm.csHashService', [])


app.service("csHashService", function(){

  this.map = function(object, key, errorMsg){

    if(!(key in object)){
      throw new Error("Key : '" + key + "' not found'\n" + errorMsg);
    } else {
      return object[key]
    }
  }
})
