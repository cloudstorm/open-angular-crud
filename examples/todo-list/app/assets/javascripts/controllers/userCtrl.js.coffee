"use strict"

angular.module("todoList", []).controller "UserCtrl", [ "$scope", ($scope) ->
  $scope.resourceType = "users"
  $scope.options = { 'hide-actions' : true };
]
