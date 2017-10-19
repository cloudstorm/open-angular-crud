var app

app = angular.module("cloudStorm.csError", [])


app.component("csError", {

  bindings : {
    errors : "<",
  },
  templateUrl : "cs-utils/error/cs-error-template.html",
})
