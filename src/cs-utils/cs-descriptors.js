'use strict'

var app = angular.module('cloudStorm.descriptors', [])

app.provider('csDescriptors', [ function(){

    this.defaultList = {

      type : "listDescriptor",
      list : {
        type : "template-override",
        url : "components/overrides/cs-row-default/cs-row-default-template.html",
      },
      footer : {

      }
    }

    this.csDefaultIndexTable = {
      listDescriptor : {
        type : "table",
        list : {
          type : "template-override",
          url : "cs-table-row",
        }
      }
    }

    this.customTable = {

      baseComponent : "cs-index",
      componentToOverride : "cs-item",
      conditions : {
        resourceType : "categories",
      },
      definitions : {
        type : "table",
        element : {
          type : "template-override",
          componentName : "cs-row-override",
        }
      }
    }

    this.$get = function() {
       return this;
    };
  }
])
