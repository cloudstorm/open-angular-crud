"use strict"

var app = angular.module('cloudStorm.tableHeader', [])

app.component('csTableHeader', {

  templateUrl : 'components/cs-table/cs-table-header/cs-table-header-template.html',
  controller : function(csSettings, $filter, $element){

    this.$onInit = function() {
      this.selectedColumn = null
      this.direction = "asc"
      $element.addClass('cs-table-header')
      this.sortReverse = true
    };

    this.changeSorting = function(column){

      if(this.selectedColumn == column) {
        this.flipDirection()
      } else {
        this.selectedColumn = column
        this.direction = "desc"
      }
      return this.sort_({column : column, direction : this.direction })
    }

    this.flipDirection = function(){
      this.direction = this.direction == "asc" ? "desc" : "asc"
    }

    this.columnVisible = function(column, index){
      return this.columnVisible_({column : column, index : index})
    }
  },
  bindings : {
    csIndexOptions : "=",
    columns : "<",
    columnVisible_ : "&",
    sort_ : "&",
  },
})
