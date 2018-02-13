"use strict"

var app = angular.module('cloudStorm.tableContainer', [])

app.component('csTableContainer', {

  templateUrl : 'components/cs-table/cs-table-container/cs-table-container-template.html',

  controller : ['$scope','csSettings','$element','csResourceFilter', function($scope, csSettings, $element, csResourceFilter) {

    this.$onInit = function() {
      this.initialCollection = this.collection
      $element.addClass('cs-table-container')
      this.sortAndFilter();
    };

    this.filterValue = "";
    this.sortDirection = "";
    this.sortColumn = null;
    this.i18n = csSettings.settings['i18n-engine'];

    this.$onChanges = function(changesObj) {
      if (changesObj.collection && changesObj.collection.currentValue && changesObj.collection.previousValue != changesObj.collection.currentValue) {
        this.initialCollection = this.collection
        this.sortAndFilter();
      }
    }

    $scope.$on('filterValue', (function(event, args) {
      this.filter(args.filterValue)
    }).bind(this))

    this.sortAndFilter = function() {
      this.name = this.sortColumn ? this.sortColumn.attribute : '';
      this.csIndexOptions.sortAttribute = this.name
      var sortFieldComp = _.find(this.resource.descriptor.fields, {
        attribute: this.csIndexOptions.sortAttribute
      });

      if (this.filterValue == "" || this.filterValue == undefined) {
        this.collection = this.initialCollection;
      } else {
        this.collection = csResourceFilter.filter(this.initialCollection, this.columns, this.filterValue);
      }
      if (sortFieldComp) {
        this.collection = csResourceFilter.sort(this.collection, sortFieldComp)
        if(this.sortDirection == "desc") {
            this.collection = this.collection.slice().reverse()
        }
      }
    }

    this.showItem = function(item) {
      this.showItem_( { item : item } );
    }

    this.selectItem = function(item) {
      this.selectItem_( { item : item } );
    }

    this.destroyItem = function(event, item) {
      this.destroyItem_( { event : event, item : item } );
    }

    this.columnVisible = function(column, index) {
      return this.columnVisible_( { column : column, index : index } );
    }

    this.sort = function(column, direction) {
      this.sortDirection = direction;
      this.sortColumn = column;
      this.sortAndFilter();
    }

    this.filter = function(filterValue) {
      this.filterValue = filterValue;
      this.sortAndFilter();
    }

    this.clickRow = function(item) {
      //It works only in edit mode
      if (this.csIndexOptions.selectedItem != null) {
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
