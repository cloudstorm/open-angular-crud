"use strict"

var app = angular.module('cloudStorm.tableContainer', [])

app.component('csTableContainer', {

  templateUrl : 'components/cs-table/cs-table-container/cs-table-container-template.html',

  controller : function($scope, csSettings, $filter, $element, csResourceFilter){

    this.$onChanges = function(changesObj){
      //It is not called unfortunately
    }

    $scope.$on('filterValue', (function(event, args){
      this.filter(args.filterValue)
    }).bind(this))

    var sortFieldComp;

    this.$onInit = function() {
      this.initialCollection = this.collection
      $element.addClass('cs-table-container')
    };

    this.showItem = function(item){
      this.showItem_({item : item})
    }

    this.selectItem = function(item){
      this.selectItem_({item : item})
    }

    this.destroyItem = function(event, item){
      this.destroyItem_({event : event, item : item})
    }

    this.columnVisible = function(column, index){
      return this.columnVisible_({column : column, index : index})
    }

    this.changeSorting = function(column, reverse){
      this.name = column.attribute
      this.csIndexOptions.sortAttribute = column.attribute
      this.csIndexOptions.sortReverse = !this.csIndexOptions.sortReverse
      sortFieldComp = _.find(this.resource.descriptor.fields, {
        attribute: this.csIndexOptions.sortAttribute
      });
      this.collection = csResourceFilter.sort(this.collection, sortFieldComp, reverse)
    }

    this.filter = function(filterValue) {
      if(filterValue == ""){
        this.collection = this.initialCollection
      } else {
        this.collection = csResourceFilter.filter(this.collection, this.columns, filterValue)
      }
    }

  },
  bindings : {
    //input
    resource : "<",
    collection : "<",
    //tableHeader
    csIndexOptions : "<",
    columns : "<",
    //tableRow
    columns : "<",
    columnVisible_ : "&",
    showItem_ : "&",
    selectItem_ : "&",
    destroyItem_ : "&",
  },
})
