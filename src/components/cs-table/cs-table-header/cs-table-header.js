"use strict"

var app = angular.module('cloudStorm.tableHeader', [])

app.component('csTableHeader', {

  templateUrl : 'components/cs-table/cs-table-header/cs-table-header-template.html',

  controller : function(csSettings, $filter, $element){

    this.$onInit = function() {
      $element.addClass('cs-table-header')
      this.sortReverse = true
    };

    this.changeSorting_ = function(column){
      this.sortReverse = ! this.sortReverse
      return this.changeSorting({column : column, reverse : this.sortReverse })
    }

    this.columnVisible_ = function(column, index){
      return this.columnVisible({column : column, index : index})
    }
  },

  bindings : {
    csIndexOptions : "=",
    columns : "<",
    columnVisible : "&",
    changeSorting : "&",
  },
})
