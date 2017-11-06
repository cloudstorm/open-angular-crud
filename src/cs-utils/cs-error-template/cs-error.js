var app

app = angular.module("cloudStorm.csError", [])


app.component("csError", {

  bindings : {
    errors : "<",
  },
  templateUrl : "cs-utils/cs-error-template/cs-error-template.html",
})
