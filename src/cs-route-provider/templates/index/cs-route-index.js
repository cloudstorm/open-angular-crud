var app;

app = angular.module("cloudStorm.uiRouterIndex",  [])

app.component("csUIRouteIndex", {
    bindings : {
      resourceType : '<',
    },
    template : "" +
        "<div> " +
        "  <cs-index item-id='$ctrl.itemId' resource-type='$ctrl.resourceType' cs-index-options='options'></cs-index> " +
        "</div> ",
    controller : function(){
        this.itemId = null
    }
})
