var app = angular.module('cloudStorm.resourceList', [])

app.component('csResourceList', {

  bindings : {
    resource : "<",
    collection : "<",
    options : "<",
    rsEvent : "<"
  },
  templateUrl : "components/resource-list/resource-list-template.html",
  controller : function($scope, $element, $compile, csResourceListProvider){

    this.assembleTemplate = function(descriptor){

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

    this.rsEvent = function(object){

    }

    this.isSelected = function(item){

    }
  }
})
