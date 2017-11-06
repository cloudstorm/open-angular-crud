var app;

declare var angular: any;

app = angular.module('cloudStorm.loader', [])

app.component("csLoader", {
  bindings : {
      color : '<',
      radius : '<',
    },
    templateUrl : 'cs-utils/loader/cs-loader-template.html',
})
