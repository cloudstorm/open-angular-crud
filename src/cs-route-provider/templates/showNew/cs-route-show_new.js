// CloudStorm Route-Show
var app;

app = angular.module('cloudStorm.uiRouterShowNew', [])

app.component("csUIRouteShowNew", {
  bindings : {
      id : '<',
      resourceType : '<',
    },
    templateUrl : 'cs-route-provider/templates/showNew/cs-route-showNew-template.html'
 })




