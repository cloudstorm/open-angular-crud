'use strict'

app = angular.module('cloudStorm.errorMsgProvider', [])

app.provider('csErrorMessages', [function() {

  this.errorPrefix = "\ncsErrorMsgs ERROR: "

  this.cases = {

    'csDescriptorFactory': {
      'baseNotDefined' : 'Base variable is not defined for definition : \n {{0|array}}',
      'intermediate' : 'From the array : \n {{0|array}} \n the key {{1}} does not refer to an object',
      'overlap': 'Overlapping data propagation definition in target: {{0|array}}',
    },
    'general' : {

    },
    'test' : {
      "1" : "ABCDEF : {{0|array}}"
    },
  }

  this.$get = function() {
    return this;
  };

}]);
