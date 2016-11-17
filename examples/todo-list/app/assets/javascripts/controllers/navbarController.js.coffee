"use strict"

angular.module("todoList", []).controller "navbarController", ["$scope", "$location",
  ($scope, $location ) ->
    $scope.isActive = (currentLocation) ->
      currentLocation == $location.path()
    return
]
