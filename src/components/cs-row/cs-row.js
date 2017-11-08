"use strict"

var app = angular.module('cloudStorm.row', [])

app.component('csRow', {

  templateUrl : 'components/cs-row/cs-row-template.html',
  bindings : {
    onEvent : "&"
  },
  controller :function(){

    this.clickHandler = function(){
      console.log('onEvent')
      this.onEvent({ test : 'testValue'})
    }

  }
})
