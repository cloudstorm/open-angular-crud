// CloudStorm Route-Show
var app;

app = angular.module('cloudStorm.uiRouterShowNew', [])

app.component("csUIRouteShowNew", {
  bindings : {
      id : '<',
      resourceType : '<',
    },
    templateUrl : 'cs-route-provider/templates/showNew/cs-route-showNew-template.html',
    controller : function($scope, csRoute, csDescriptorService){
      
      this.ready = false
      csDescriptorService.getPromises().then((function(){
        //The form config object
        this.ready = true
        console.log("1")
        this.wizardOptions = {
          "resource-type" : "items",
          "form-item": {},
          "form-mode": "create",
          "reset-on-submit": true,
          "events": {
            'wizard-canceled': function(resource){
                csRoute.go()
              },
            'wizard-submited': function(resource){
              pushNewItem($scope.collection, resource)
              csRoute.go()
            }
          }
        }
        $scope.$apply()
      }).bind(this))
    }
 })

