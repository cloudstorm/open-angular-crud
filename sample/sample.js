var app = angular.module('cloudStormSample', [
  'cloudStorm', 
  'ngAnimate',
  'ui.bootstrap'
  ]);

app.controller('MainCtrl', function($scope, CSAlertService) {
  $scope.world = 'World';
  CSAlertService.addAlert('heyy', 'info');
});
