'use strict'

var app = angular.module('cloudStorm.dataOpsProvider', [])

app.provider('csDataOps', [ function(){

    this.objectKeys = function(base, array){
      //LATER
    }

    this.object = function(base, key){
      if(base[key] == undefined){
          base[key] = {}
      }
    }

    this.$get = function() {
       return this;
    };
  }
])
