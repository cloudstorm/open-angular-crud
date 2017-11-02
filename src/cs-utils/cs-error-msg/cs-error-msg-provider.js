'use strict'

app = angular.module('cloudStorm.errorMsgProvider', [])

app.provider('csErrorMsgs', [function() {

  this.errorPrefix = "\ncsErrorMsgs ERROR: "

  this.cases = {
    'csDescriptorFactory': {
      'overlap': 'Overlapping data propagation definition in target: {{0|array}}'
    }
  }

  this.get = function(componentName, type, params){

    if(componentName in this.cases){
      if(type in this.cases[componentName]){
        var msg = this.cases[componentName][type].slice(0)
        var reg = new RegExp("{{.*}}")
        reg.exec(msg).forEach((function(inputDef){
            msg = msg.replace(inputDef, this.getParam(inputDef, params))
        }).bind(this))
        return msg
      } else {
        return this.errorPrefix + type + ', there is no such case.';
      }
    } else {
      return this.errorPrefix + componentName + ', there is no such component.';
    }
  }

  this.getParam = function(paramDef, params) {

    if(params == null){
      return this.errorPrefix + "'params' parameter is null!";
    }
    if((typeof params) != 'object'){
      params = [params]
    }
    var def = paramDef.substring(2, paramDef.length - 2).split("|");
    var num = parseInt(def[0]);
    if(isNaN(num)) {
      return this.errorPrefix + "'" + def[0] + "' is not an integer. Please revise the error msg definition";
    }
    var type = def[1];
    var value = params[num];
    switch(type){
      case 'array' :
        if(Array.isArray(value)){
          var msg = '';
          value.forEach(function(element){
            msg += element + '\t'
          })
          return msg
        } else {
          return this.errorPrefix + 'Input param ' + num + ' is not an array';
        }
      case 'object':
        //Comes later
        return null
      case undefined :
        return value
    }
  }

  this.$get = function() {
    return this;
  };
}]);
