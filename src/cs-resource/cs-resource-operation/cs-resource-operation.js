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
    array.forEach((function(object){
      var list = object[params.field]
      list = _.where(list, params.query)
      object[params.field] = this.select(list, params.select)
    }).bind(this))

    return array
  }

  this.putKeyInside = function(arr, params){

    var array = angular.copy(arr)
    array.forEach((function(element){
      element[params.field].forEach((function(innerElement){
        innerElement[params.newKey] = element[params.keyToPutIn]
      }).bind(this))
    }).bind(this))
    return array
  }

  this.mergeArrays = function(array, key){

    var arr = []
    array.forEach(function(object){
      arr = object[key].concat(arr)
    })
    return arr
  }

  this.renameKey = function(arr, newKey, oldKey){

    var array = angular.copy(arr)
    array.forEach(function(object){
        object[newKey] = object[oldKey]
        delete object[oldKey]
    })
    return array
  }

  this.objectFromArrayObject = function(array, params){

    var object = {}
    array.forEach((function(element){
      object[params.newKey] = element[params.baseKey]
    }).bind(this))
    return object
  }

  this.objectFromArray = function(object, keyName){

    var arr = []
    for(key in object){
      object[key][newKey] = key
      arr.push(object[key])
    }
    return arr
  }

  this.getIndex = function(array, keys, value){

    var index = -1
    array.forEach((function(element, i){
      if(this.getValue(element, keys) == value){
        index = i
        return
      }
    }).bind(this))
    return index
  }

  this.getValue = function(object, keys){
    var value = object
    keys.forEach(function(key){
      value = value[key]
    })
    return value
  }

  this.remove = function(array, key, value){

    var index = -1;
    array.forEach(function(element, i){
      if(element[key] == value){
        index = i;
        break
      }
    })
    if(index > -1)
      array.slice(index, 1)
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

  return this
}])
