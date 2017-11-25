var app = angular.module('cloudStormSample', [
  'cloudStorm',
])

app.controller('MainCtrl', function($scope, csAlertService, csDescriptorService, csSettings, csRoute, $state) {

  csDescriptorService.registerDescriptorUrl('resourceDescriptors/itemResourceDescriptor.json');
  csDescriptorService.registerDescriptorUrl('resourceDescriptors/categoryResourceDescriptor.json');
  csDescriptorService.registerDescriptorUrl('resourceDescriptors/userResourceDescriptor.json');
  csRoute.setState($state)

  var override = {
    //It is an array because there can be multiple overrides in one component
    conditions : {
      component: "cs-index",
      resourceType: "categories",
    },
    componetToOverride : 'cs-item',
    definition : {
      //This is a special case because index
      name : 'cs-card',
      layout : "horizontal",
      childOverride : {
        //This definition is passed to the options in the cs-card controller
        //and therefore each child component gets it.
        'template-override' : [{
          component : "cs-field",
          template : "components/overrides/cs-card/cs-field-card-template.html",
        }],
        'directive-overrides' : [],
      }
    }
  }
  csSettings.addOverride(override)

});
