'use strict'

var app;

app = angular.module('cloudStorm.resourceFilter', [])

app.factory('csResourceFilter', function(){

  this.filter = function(array){
    return array.reverse()
  }
  
  return this
})
