'use strict'

var app = angular.module('cloudStorm.itemListContainer', [])

app.component('csItemListContainer', {

  bindings : {
    field : "<",
    itemList : "<",
    key : "<",
    many : "<",
    uiConfig : "<",
    cMode : "<",
    modalMode : "<",
    modalInstance : "<",
  },
  templateUrl : "components/containers/cs-item-list-container/cs-item-list-container-template.html",
  controller : function(csSettings) {
    this.$onInit = function() {
      this.i18n = csSettings.settings['i18n-engine'];

      this.UI = {};
      this.UI.fieldName = this.field.attribute;

      this.close = function() {
        this.modalInstance.close();
      };
    };
  }
});
