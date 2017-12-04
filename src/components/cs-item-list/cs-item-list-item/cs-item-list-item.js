'use strict'

var app = angular.module('cloudStorm.itemListItem', [])

app.component('csItemListItem', {

  bindings : {
    text : "",
    process : "&"
  },
  templateUrl : 'components/cs-item-list/cs-item-list-item/cs-item-list-item.html',
  controller : function(){

    this.$onInit = function(){
        angular.extend(this, this.process({ text : this.text }))
    }
  }

})
