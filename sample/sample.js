var app = angular.module('cloudStormSample', [
  'cloudStorm',
])

app.controller('MainCtrl', function($scope, csAlertService, csDescriptorService, csSettings, csRoute, $state) {

  csDescriptorService.registerDescriptorUrl('resourceDescriptors/itemResourceDescriptor.json');
  csDescriptorService.registerDescriptorUrl('resourceDescriptors/categoryResourceDescriptor.json');
  csDescriptorService.registerDescriptorUrl('resourceDescriptors/userResourceDescriptor.json');
  csRoute.setState($state)

  var override = {
    baseComponent: "cs-index",
    componentToOverride : 'cs-item',
    conditions : {
      resourceType: "categories",
    },
    definition : {
      //This is a special case because index
      type : "list",
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
