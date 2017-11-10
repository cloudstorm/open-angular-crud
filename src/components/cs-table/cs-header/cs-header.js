"use strict"

var app = angular.module('cloudStorm.header', [])

app.component('csHeader', {

  templateUrl : 'components/cs-table/cs-header/cs-header-template.html',

  controller : function(csSettings, $filter, $element){

    this.$onInit = function() {
      $element.addClass('cs-header')
    };

    this.changeSort_ = function(column){
      this.changeSorting({column : column})
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
