var app = angular.module('cloudStormSample', ['cloudStorm']);

app.controller('MainCtrl', function($scope, CSAlertService) {
  $scope.name = 'World';
  CSAlertService.addAlert('heyy', 'info');
});
