'use strict'

var app = angular.module('cloudStorm.fullCode', [])

app.component('csFullCode', {

  bindings : {
    title : "<",
    content : "<",
    modalInstance : "<",
  },
  templateUrl : "components/cs-fields/cs-code/cs-full-code/cs-full-code-template.html",
  controller : [ 'csSettings', function(csSettings) {
    this.$onInit = function() {
      this.i18n = csSettings.settings['i18n-engine'];

      this.UI = {};
      this.UI.title = this.title;
      this.UI.content = this.content

      this.close = function() {
        this.modalInstance.close();
      };
    };
  }]
});
