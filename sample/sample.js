var app = angular.module('cloudStormSample', ['cloudStorm']);

app.controller('MainCtrl', function($scope, csAlertService) {
  csAlertService.addAlert('Welcome to CloudStorm', 'info');
  
  // Dummy
  $scope.world = 'Worlds';
});
