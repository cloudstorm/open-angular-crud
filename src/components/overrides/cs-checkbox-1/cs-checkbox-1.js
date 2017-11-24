'use strict'

var app = angular.module('cloudStorm.checkBox1', [])

app.component('csCheckbox1', {

  bindings : {
    field: '=',
    formItem: '=',
    formMode: '=',
    options: '=',
  },
  templateUrl : "components/overrides/cs-checkbox-1/cs-checkbox-1-template.html",
  controller : function($element, csSettings, csAlertService){

      //Modal wait
      this.$onInit = function(){
        $element.addClass('cs-checkbox-1')
        this.editMode = false
        this.i18n = csSettings.settings['i18n-engine']
      }

      this.edit = function(){
        this.editMode = true;
      }

      this.save = function(){
        this.editMode = false;
        this.formItem.$save().then(function(){
          csAlertService.success('changes_saved')
        }, function(){
          csAlertService.warning('error_happened')
        })
      }
  }

})
