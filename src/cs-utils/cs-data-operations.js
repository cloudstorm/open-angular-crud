'use strict'

var app = angular.module('cloudStorm.dataOpsProvider', [])

app.provider('csDataOps', [ function(){

    this.object = function(base, key){
      if(base[key] == undefined){
          base[key] = {}
      }
    }

    this.objectKeys = function(base, array){
      //LATER
    }

    this.init = function(variable, value){
      if(!variable){
        variable = value
      }
    }

    this.$get = function() {
       return this;
    };
  }
])
