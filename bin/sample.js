var app = angular.module('cloudStormSample', [
  'cloudStorm'
]);

app.controller('MainCtrl', function($scope, csAlertService, csDescriptorService) {
  csDescriptorService.registerDescriptorUrl('resourceDescriptors/itemResourceDescriptor.json');
  csDescriptorService.registerDescriptorUrl('resourceDescriptors/categoryResourceDescriptor.json');
  csDescriptorService.registerDescriptorUrl('resourceDescriptors/userResourceDescriptor.json');

  csAlertService.addAlert('Welcome to CloudStorm', 'info');
  $scope.resourceType = 'items';
});
