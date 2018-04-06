var app

app = angular.module("cloudStorm.error", [])

app.component("csError", {

  bindings : {
    errors : "<",
  },
  templateUrl : "cs-utils/cs-error-template/cs-error-template.html",
  controller : ['$element', function($element){
    $element.addClass('cs-error');
  }]
})
