'use strict'

app = angular.module('cloudStorm.errorMsgProvider', [])

app.provider('csErrorMsgs', [function() {

  this.errorPrefix = "csErrorMsgs ERROR: "

  this.cases = {
    'csDescriptorFactory': {
      'overlap': 'Overlapping data propagation definition in target: {{0|array}}'
    }
  }

  this.get = function(type, number, params){

  }

  this.getParam = function(paramDef, params) {

    if(params == null){
      return this.errorPrefix + "'params' parameter is null!";
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
        break;
      case undefined :
        return value
    }
  }

  this.$get = function() {
    return this;
  };
}]);
