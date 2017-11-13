"use strict"

var app = angular.module('cloudStorm.tableContainer', [])

app.component('csTableContainer', {

  templateUrl : 'components/cs-table/cs-table-container/cs-table-container-template.html',

  controller : function($scope, csSettings, $filter, $element, csResourceFilter){

    var sortFieldComp = void 0;
    this.i18n = csSettings.settings['i18n-engine']

    this.$onInit = function() {
      $element.addClass('cs-table-container')
    };

    this.showItem_ = function(item){
      this.showItem({item : item})
    }

    this.selectItem = function(item){
      this.selectItem({item : item})
    }

    this.destroyItem_ = function(event, item){
      this.destroyItem({event : event, item : item})
    }

    this.columnVisible_ = function(column, index){
      return this.columnVisible({column : column, index : index})
    }

    this.changeSorting = function(column, reverse){
      this.csIndexOptions.sortAttribute = column.attribute
      this.csIndexOptions.sortReverse = !this.csIndexOptions.sortReverse
      sortFieldComp = _.find(this.resource.descriptor.fields, {
        attribute: this.csIndexOptions.sortAttribute
      });
      this.collection = csResourceFilter.sort(this.collection, sortFieldComp, reverse)
    }

    this.showItem_ = function(item){
      return this.showItem({ item : item })
    }

  },
  bindings : {
    //input
    resource : "<",
    collection : "<",
    //tableHeader
    csIndexOptions : "<",
    columns : "<",
    columnVisible : "&",
    //tableRow
    columns : "<",
    columnVisible : "&",
    showItem : "&",
    selectItem : "&",
    destroyItem : "&",
  },
})
