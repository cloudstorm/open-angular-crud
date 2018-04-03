var app = angular.module('cloudStormSample', [
  'cloudStorm',
])

// app.controller('MainCtrl', function($scope, csAlertService, csDescriptorService, csRoute, $state) {
//   csDescriptorService.registerDescriptorUrl('resourceDescriptors/userResourceDescriptor.json');
//   csDescriptorService.registerDescriptorUrl('resourceDescriptors/categoryResourceDescriptor.json');
//   csDescriptorService.registerDescriptorUrl('resourceDescriptors/itemResourceDescriptor.json');
//
//   // // item resource is loaded with a delay, the cs-menu should reflect the newly loaded resource in 5 secs
//   // setTimeout(function(){ csDescriptorService.registerDescriptorUrl('resourceDescriptors/itemResourceDescriptor.json'); }, 5000);
//
//   csRoute.init();
// });


app.controller('MainCtrl', function($scope, csAlertService, csSettings, csDescriptorService, csRoute) {
  csDescriptorService.registerDescriptorUrl('http://web.csnodeapptemplate.docker/api/v1/descriptors');

  csAlertService.addAlert('Welcome to CloudStorm', 'info');
  csSettings.set('app-title', 'cs-node-app-template');
  csRoute.init();
});


// app.controller('MainCtrl', function($scope, csAlertService, csSettings, csDescriptorService, csRoute) {
//   csDescriptorService.registerDescriptorUrl('http://web.csnodeapptemplate.docker/api/v1/descriptors');

//   csAlertService.addAlert('Welcome to CloudStorm', 'info');
//   csSettings.set('app-title', 'cs-node-app-template');
//   csRoute.init();
// });
