var app = angular.module('cloudStormSample', [
  'cloudStorm',
])

app.controller('MainCtrl', function($scope, csAlertService, csDescriptorService, csRoute, $state) {

  csDescriptorService.registerDescriptorUrl('https://daas.cloudstorm.io/api/v1/meta/descriptors/resources');
  csDescriptorService.registerDescriptorUrl('https://daas.cloudstorm.io/api/v1/meta/descriptors');

  csDescriptorService.registerDescriptorUrl('resourceDescriptors/itemResourceDescriptor.json');
  csDescriptorService.registerDescriptorUrl('resourceDescriptors/categoryResourceDescriptor.json');
  csDescriptorService.registerDescriptorUrl('resourceDescriptors/userResourceDescriptor.json');

  csRoute.init();

});



app.factory( 'HttpHeaderInterceptor', [ '$q', '$injector', '$window', function($q, $injector, $window) {
  return {
    request: function(request) {
       if (request.url.match(/https:\/\/daas.cloudstorm.io/)) {
        request.headers['x-api-key'] = 'TPD4k3QZcO3A1hmCWg3rp8loNH7vIqjV7kTBRpWw';
      }
      return request;
    }
  };
}])

app.config( [ '$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('HttpHeaderInterceptor');
}]);
