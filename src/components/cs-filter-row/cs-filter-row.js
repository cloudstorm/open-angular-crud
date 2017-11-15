'use string'

var app = angular.module('cloudStorm.filterRow', [])

app.component('csFilterRow', {

    bindings : {
      resource : "<",
      filterValue : "<",
      filter : "&",
      openNewResourcePanel : "&",
      refreshIndex : "&",
    },

    templateUrl : "components/cs-filter-row/cs-filter-row-template.html",

    controller : function($element, csSettings){

      this.$onInit = function(){
        $element.addClass('cs-filter-row')
        this.filterVal = ""
        this.header  = this.resource.descriptor.name
        this.subHeader  = this.resource.descriptor.hint
        this.createDisabled = this.resource.descriptor.create_disabled
      }

      this.i18n = csSettings.settings['i18n-engine']

      this.changeInFilter = function(){
        this.filter({ filterValue : this.filterValue })
      }

      this.openNewResourcePanel_ = function(){
        this.openNewResourcePanel();
      }

      this.refreshIndex_ = function(){
        this.refreshIndex();
      }

    }
})