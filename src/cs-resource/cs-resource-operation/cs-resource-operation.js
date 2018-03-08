'use strict'

var app;

app = angular.module('cloudStorm.resourceOperation', [])

app.factory('csResourceOperation', [ function() {


  this.select = function(object, keys){

    var object = angular.copy(object)
    if(angular.isArray(object)){
      object.forEach((function(element){
        this.selectObject(element, keys)
      }).bind(this))
    } else {
      this.selectObject(object, keys)
    }
    return object
  }

  this.selectObject = function(object, keys){

    for(var key in object){
      if(keys.indexOf(key) == -1){
        delete object[key]
      }
    }
  }

  this.where = function(arr, params){

    var array = angular.copy(arr)
    //Where works right now only with one field
    console.log(array)
    for(var i in array){

      var object = array[i]
      console.log(object)
      object[params.field] = _.where(object[params.field], params.query)

      // for(var arr in object[params.field]){
      //   for(object in array){
      //     for(var key in object){
      //       if(!params.select.indexOf(key)){
      //         delete object[key]
      //       }
      //     }
      //   }
      // }
    }
    return array
  }

  this.compactObject = function(object, constantKey){

    // { key : { constantKey : {}}} -> { key : {}}
    for(var key in object){
      object[key] = object[key][constantKey]
    }
    return object
  }

  this.deepWhere = function(innerKey, object, condition){
    for(var key in object){
      object[key][innerKey] = _.where(object[key][innerKey], condition)
    }
    return object
  }

  this.objectFromArray = function(object, newKey){

    var arr = []
    for(key in object){
      object[key][newKey] = key
      arr.push(object[key])
    }
    return arr
  }

  var renameKey = function(array, newKey, oldKey){

    array.forEach(function(object){
        object[newKey] = object[oldKey]
        delete object[oldKey]
    })
    return array
  }

  console.log(this)
  return this
}])
