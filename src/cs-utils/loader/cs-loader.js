var app;

app = angular.module('cloudStorm.csLoader', [])

app.component("csLoader", {
  bindings : {
      color : '<',
      radius : '<',
    },
    templateUrl : 'cs-utils/loader/cs-loader-template.html',
})