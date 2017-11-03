'use strict'

app = angular.module('cloudStorm.errorFactory', [])

app.factory('csErrorFactory', ['csErrorMessages', function(csErrorMessages){


  var thrw = function(componentName, type, params){
      throw this.error(componentName, type, params)
  }

  var error = function(componentName, type, params){
    return new Error(this.get('csDescriptorFactory', type, params))
  }
  var get = function(componentName, type, params){

    if(componentName in csErrorMessages.cases){
      if(type in csErrorMessages.cases[componentName]){
        var msg = csErrorMessages.cases[componentName][type].slice(0)
        var reg = new RegExp("{{.*}}")
        reg.exec(msg).forEach((function(inputDef){
            msg = msg.replace(inputDef, this.getParam(inputDef, params))
        }).bind(this))
        return msg
      } else {
        return csErrorMessages.errorPrefix + type + ', there is no such case.';
      }
    } else {
      return csErrorMessages.errorPrefix + componentName + ', there is no such component.';
    }
  }

  var getParam = function(paramDef, params) {

    if(params == null){
      return csErrorMessages.errorPrefix + "'params' parameter is null!";
    }
    if((typeof params) != 'object'){
      params = [params]
    }
    var def = paramDef.substring(2, paramDef.length - 2).split("|");
    var num = parseInt(def[0]);
    if(isNaN(num)) {
      return csErrorMessages.errorPrefix + "'" + def[0] + "' is not an integer. Please revise the error msg definition";
    }
    var type = def[1];
    var value = params[num];
    switch(type){
      case 'array' :
        if(Array.isArray(value)){
          var msg = '';
          value.forEach(function(element){
            msg += element + ', '
          })
          msg = "[" + msg.substring(0, msg.length - 2) + "]"
          return msg
        } else {
          return csErrorMessages.errorPrefix + 'Input param ' + num + ' is not an array';
        }
      case 'object':
        //Comes later
        return null
      case undefined :
        return value
    }
  }

  return {
    throw: thrw,
    error: error,
    get: get,
    getParam: getParam,
  }

}])
