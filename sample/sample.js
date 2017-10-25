
var app = angular.module('cloudStormSample', [
  'cloudStorm',
])

app.controller('MainCtrl', function($scope, csAlertService, csDescriptorService, csRoute, $state) {

  csDescriptorService.registerDescriptorUrl('resourceDescriptors/itemResourceDescriptor.json');
  csDescriptorService.registerDescriptorUrl('resourceDescriptors/categoryResourceDescriptor.json');
  csDescriptorService.registerDescriptorUrl('resourceDescriptors/userResourceDescriptor.json');
  csRoute.setState($state)
});

angular.element(document).ready(function() {
      angular.bootstrap(document.body, ['cloudStormSample']);
});
