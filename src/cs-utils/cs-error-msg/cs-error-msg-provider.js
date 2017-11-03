'use strict'

app = angular.module('cloudStorm.errorMsgProvider', [])

app.provider('csErrorMessages', [function() {

  this.errorPrefix = "\ncsErrorMsgs ERROR: "

  this.cases = {

    'csDescriptorFactory': {
      'overlap': 'Overlapping data propagation definition in target: {{0|array}}'
    },
    'test' : {
      "1" : "ABCDEF : {{0|array}}"
    },
  }

  this.$get = function() {
    return this;
  };

}]);
