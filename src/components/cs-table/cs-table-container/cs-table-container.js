"use strict"

var app = angular.module('cloudStorm.tableContainer', [])

app.component('csTableContainer', {

  templateUrl : 'components/cs-table/cs-table-container/cs-table-container-template.html',

  controller : ['$scope','csSettings','$filter','$element','csResourceFilter', function($scope, csSettings, $filter, $element, csResourceFilter){

    this.$onInit = function() {
      this.initialCollection = this.collection
      $element.addClass('cs-table-container')
    };

    this.i18n = csSettings.settings['i18n-engine'];

    this.$onChanges = function(changesObj) {
      this.initialCollection = this.collection
    }

    $scope.$on('filterValue', (function(event, args){
      this.filter(args.filterValue)
    }).bind(this))

    var sortFieldComp;

    this.showItem = function(item) {
      this.showItem_({item : item})
    }

    this.selectItem = function(item) {
      this.selectItem_({item : item})
    }

    this.destroyItem = function(event, item) {
      this.destroyItem_({event : event, item : item})
    }

    this.columnVisible = function(column, index){
      return this.columnVisible_({column : column, index : index})
    }

    this.sort = function(column, direction) {
      this.name = column.attribute
      this.csIndexOptions.sortAttribute = column.attribute
      sortFieldComp = _.find(this.resource.descriptor.fields, {
        attribute: this.csIndexOptions.sortAttribute
      });

      this.collection = csResourceFilter.sort(this.initialCollection, sortFieldComp)
      if(direction == "desc"){
          this.collection = this.collection.slice().reverse()
      }
    }

    this.filter = function(filterValue) {
      if(filterValue == "") {
        this.collection = this.initialCollection;
      } else {
        this.collection = csResourceFilter.filter(this.initialCollection, this.columns, filterValue);
      }
    }

    this.clickRow = function(item) {
      //It works only in edit mode
      if(this.csIndexOptions.selectedItem != null){
        this.selectItem(item)
      }
    }

  } ],
  bindings : {
    resource : "<",
    collection : "<",
    csIndexOptions : "=",
    columns : "<",
    columnVisible_ : "&",
    showItem_ : "&",
    selectItem_ : "&",
    destroyItem_ : "&",
  },
})
