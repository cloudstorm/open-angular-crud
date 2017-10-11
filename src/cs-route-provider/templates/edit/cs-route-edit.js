// CloudStorm Route-Show
var app;

app = angular.module('cloudStorm.uiRouterEdit', [])

app.component("csUIRouteEdit", {
  bindings : {
      id : '<',
      resourceType : '<',
    },
    templateUrl : 'cs-route-provider/templates/edit/cs-route-edit-template.html'
 })
