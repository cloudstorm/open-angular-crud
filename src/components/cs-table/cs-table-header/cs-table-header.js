"use strict"

var app = angular.module('cloudStorm.tableHeader', [])

app.component('csTableHeader', {

  templateUrl : 'components/cs-table/cs-table-header/cs-table-header-template.html',
  controller : function(csSettings, $filter, $element){

    this.$onInit = function() {
      this.selectedColumn = null
      this.direction = "asc"
      $element.addClass('cs-table-header')

    };

    this.changeSorting = function(column){

      if(this.selectedColumn == column) {
        this.flipDirection()
      } else {
        this.selectedColumn = column
        this.direction = "asc"
      }
      return this.sort_({column : column, direction : this.direction })
    }

    this.flipDirection = function(){
      this.direction = this.direction == "asc" ? "desc" : "asc"
    }

    this.columnVisible = function(column, index){
      return this.columnVisible_({column : column, index : index})
    }

    this.asc = function(column){
      return (this.csIndexOptions.sortAttribute == column.attribute
        && this.direction == 'asc')
    }

    this.desc = function(column){
      return (this.csIndexOptions.sortAttribute == column.attribute
        && this.direction == 'desc')
    }

  },
  bindings : {
    csIndexOptions : "=",
    columns : "<",
    columnVisible_ : "&",
    sort_ : "&",
  },
})
