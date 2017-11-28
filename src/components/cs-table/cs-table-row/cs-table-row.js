"use strict"

var app = angular.module('cloudStorm.tableRow', [])

app.component('csTableRow', {

  templateUrl : 'components/cs-table/cs-table-row/cs-table-row-template.html',

  controller : function(csSettings, $filter, $element){

    this.i18n = csSettings.settings['i18n-engine']

    this.$onInit = function() {
      $element.addClass('cs-table-row')
      //TODO - Later the different field directive must be prepared if the
      //options input is not defined. i.e. the cs-date would throw and error.
      this.fieldOptions = {}
    };

    this.showItem = function(){
      this.showItem_({item : this.item})
    }

    this.selectItem = function(){
      this.selectItem_({item : this.item})
    }

    this.destroyItem = function(event){
      this.destroyItem_({event : event, item : this.item})
    }

  },
  bindings : {
    item : "<",
    csIndexOptions : "=",
    columns : "<",
    columnVisible_ : "&",
    showItem_ : "&",
    selectItem_ : "&",
    destroyItem_ : "&",
  },
})
