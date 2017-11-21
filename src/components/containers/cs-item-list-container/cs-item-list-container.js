'use strict'

var app = angular.module('cloudStorm.itemListContainer', [])

app.component('csItemListContainer', {

  bindings : {
    field : "<",
    itemList : "<",
    key : "<",
    many : "<",
    uiConfig : "<",
    formMode : "<",
    modalMode : "<",
    modalInstance : "<",
    fieldName : "<",
  },
  templateUrl : "components/containers/cs-item-list-container/cs-item-list-container-template.html",
  controller : function(csSettings){

    this.i18n = csSettings.settings['i18n-engine'];

    this.close = function(){
      this.modalInstance.close()
    }
  }

})
