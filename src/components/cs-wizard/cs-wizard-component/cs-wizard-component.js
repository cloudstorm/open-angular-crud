var app

app = angular.module("cloudStorm.wizardComponent", [])

app.component("csWizardComponent", {

    bindings : {
        csWizardOptions: '=?',
        panelNumberCallback: '=',
        pageType: "=",
        itemId: "=",
        resourceType: "=",
    },
    templateUrl : "components/cs-wizard/cs-wizard-component/cs-wizard-component-template.html",
    controller : ['$scope', '$rootScope', 'ResourceService', '$document', 'csDescriptorService', 'csLog', 'csAlertService', 'csRoute', function($scope, $rootScope, ResourceService, $document, csDescriptorService, csLog, csAlertService, csRoute){

      csLog.set(this, 'csWizardComponent', true)

      var _this_ = this
      var resource_type, wizardMaxDepth;

      this.loading = true
      this.errors = []

      this.setOptions = function(resource, item, formMode, wizardMaxDepth, parent, directive){

        this.log("setOptions");
        var panelDescriptor = {
          resource: resource,
          item: item,
          formMode: formMode,
          wizardMaxDepth: wizardMaxDepth,
          parent: parent,
          directive: directive
        };
        this.panelStack = [panelDescriptor];
      }

      this.finish = function(error) {

        this.log("finished: " + error);
        this.loading = false;
        if (error) {
          this.errors = [error];
          throw new Error(error);
        }
      };

      //Runs on the development
      var override = null;

      this.$onInit = function() {


        if (this.csWizardOptions) {
          this.singlePage = false
          this.log("wizardOptions branch");
          resource_type = this.csWizardOptions['resource-type'];
          var resource = angular.copy(ResourceService.get(resource_type));
          var item = this.csWizardOptions['form-item'];
          var formMode = this.formMode || this.csWizardOptions['form-mode'];
          var parent = null;
          wizardMaxDepth = this.csWizardOptions['max-depth'] || 5;
          if(this.csWizardOptions['resource-overrides']){
            override = this.csWizardOptions['resource-overrides'][resource_type]
            if (override && override.directive != null) {
              override = override.directive;
            }
          }

          this.setOptions(resource, item, formMode, wizardMaxDepth, null, override);
          this.finish();
        } else {

          var formMode, wizardMaxDepth;

          this.singlePage = true
          this.log("singlePage branch");
          this.csWizardOptions = {};

          var formMode = this.pageType;
          resource_type = this.resourceType;

          if (formMode !== 'show' && formMode !== 'edit') {
            //It throws an error
            this.finish("'" + formMode + "' is not a valid page type!");
          }

          wizardMaxDepth = 5;
          this.csWizardOptions['form-mode'] = formMode

          var _resource_;
          csDescriptorService.getPromises()
          .then(function(){
            var error;
            try {
              _resource_ = ResourceService.get(resource_type);
            } catch (error) {
              var errorMsg = "'" + resource_type + "' is not a registered resource.";
              _this_.finish(errorMsg);
            }

            var resource = angular.copy(_resource_)

            resource.$get(_this_.itemId, {include: '*'})
            .then(function(_item_) {

              var item = _item_;
              var wizardCanceled = (function() {
                return csRoute.go("index", {
                  resourceType: resource.descriptor.type
                });
              }).bind(resource);

              var wizardSubmitted = (function() {
                switch (formMode) {
                  case "create":
                    csAlertService.success('new_resource_created');
                    break;
                  case "edit":
                    csAlertService.success("changes_saved");
                }
                return csRoute.go("index", {
                  resourceType: resource.descriptor.type
                });
              }).bind(formMode, resource);

              _this_.csWizardOptions.events = {
                'wizard-canceled': wizardCanceled,
                'wizard-submited': wizardSubmitted
              };

              _this_.setOptions(resource, item, formMode, wizardMaxDepth);
              return _this_.finish();

            }).catch(function(error) {
              // Process the reason
              var errorMsg = "There is no " + resource.descriptor.name + " with the id: " + _this_.itemId;
              _this_.finish(errorMsg);
            })
          });
        }
      }

      //================= Lifecycle events =====================

      $scope.$on('create-resource', (function(event, resource, attribute, parent) {
        return this.pushPanel(resource, attribute, parent);
      }).bind(this));

      $scope.$on('form-cancel', (function(event, resource, attribute) {
        this.popPanel();
        if (this.panelStack.length === 0) {
          return this.notify_listeners($scope, 'wizard-canceled', resource);
        }
      }).bind(this));

      $scope.$on('wizard-cancel', (function(event, resource, attribute) {
        this.popAllPanels();
        if (this.panelStack.length === 0) {
          return this.notify_listeners($scope, 'wizard-canceled', resource);
        }
      }).bind(this));

      $scope.$on('form-submit', (function(event, resource, attribute) {
        if (this.panelStack.length === 1) {
          this.notify_listeners($scope, 'wizard-submited', resource);
          if (!this.csWizardOptions['keep-first']) {
            return this.popPanel();
          }
        } else {
          return this.popPanel();
        }
      }).bind(this));

      $scope.$on('form-error', (function(event, resource, attribute) {
        if (resource.status !== 422) {
          $scope.$emit('wizard-error', resource.data);
          if (this.csWizardOptions.events['wizard-error'] && this.panelStack.length === 1) {
            return this.csWizardOptions.events['wizard-error'](resource);
          }
        }
      }).bind(this));

      $scope.$on('transitioned', (function(event, child, parent) {
        var i, len, results, transition, transitions;
        if (child && parent) {
          if (this.csWizardOptions.transitions) {
            if (transitions = this.csWizardOptions.transitions[parent.type] && this.csWizardOptions.transitions[parent.type][child.type]) {
              results = [];
              for (i = 0, len = transitions.length; i < len; i++) {
                transition = transitions[i];
                results.push(transition(child, parent));
              }
              return results;
            }
          }
        }
      }).bind(this));

      //$document.on('keydown', keyPressed);

      $scope.$on('$destroy', function() {
        return $document.off('keydown', keyPressed);
      });

      this.shouldShowNewButton = function() {
        if (this.panelStack.length >= wizardMaxDepth) {
          return false;
        }
        return true;
      };

      this.panelHover = function(hoveredIndex) {
        return _.forEach(this.panelStack, function(panel, panelIndex) {
          if (panelIndex < hoveredIndex) {
            return panel.hoverOrder = -1;
          } else if (panelIndex > hoveredIndex) {
            return panel.hoverOrder = 1;
          } else {
            return panel.hoverOrder = 0;
          }
        });
      };

      this.pushPanel = function(resource_type, attribute, parent) {

        var override, panelIndex;
        panelIndex = this.panelStack.length - 1;
        _.forEach(this.panelStack[panelIndex].resource.descriptor.fields, function(value) {
          return value.inactive = true;
        });
        var activeField = _.find(this.panelStack[panelIndex].resource.descriptor.fields, function(o) {
          return o.attribute === attribute;
        });
        if (activeField) {
          activeField.inactive = false;
        }
        var panelDescriptor = {
          resource: angular.copy(ResourceService.get(resource_type)),
          parent: parent,
          formMode: 'create',
          attribute: attribute
        };
        if (this.csWizardOptions['resource-overrides'] && (override = this.csWizardOptions['resource-overrides'][resource_type])) {
          if (override.directive != null) {
            panelDescriptor.directive = override.directive;
          }
        }
        this.panelStack.push(panelDescriptor);
        this.panelHover(panelIndex + 1);
        if (this.panelNumberCallback) {
          this.panelNumberCallback(this.panelStack.length);
        }
      };

      var overriden_resource_descriptors = {};

      this.resource_descriptor = function(panel) {
        var descriptor, field, field_name, field_override, field_overrides, overrides;
        if (overriden_resource_descriptors[panel.resource.descriptor.type]) {
          return overriden_resource_descriptors[panel.resource.descriptor.type];
        } else {
          descriptor = angular.copy(panel.resource.descriptor);
          overriden_resource_descriptors[panel.resource.descriptor.type] = descriptor;
          if (this.csWizardOptions['resource-overrides']) {
            if (overrides = this.csWizardOptions['resource-overrides'][panel.resource.descriptor.type]) {
              if (field_overrides = overrides['fields']) {
                for (field_name in field_overrides) {
                  field_override = field_overrides[field_name];
                  field = _.find(descriptor.fields, function(f) {
                    return f.attribute === field_name;
                  });
                  angular.merge(field, field_override);
                }
              }
            }
          }
          return descriptor;
        }
      };

      this.popPanel = function() {

        var panelIndex;
        this.panelStack.pop();
        panelIndex = this.panelStack.length - 1;
        if (this.panelStack[panelIndex]) {
          _.forEach(this.panelStack[panelIndex].resource.descriptor.fields, function(value) {
            return value.inactive = false;
          });
        }
        this.panelHover(panelIndex + 1);
        if (this.panelNumberCallback) {
          return this.panelNumberCallback(this.panelStack.length);
        }
      };

      this.popAllPanels = function($scope) {
        this.panelStack = [];
        if (this.panelNumberCallback) {
          return this.panelNumberCallback(this.panelStack.length);
        }
      };

      this.notify_listeners = function($scope, event, resource) {

        $scope.$emit(event);
        if (this.csWizardOptions && this.csWizardOptions.events) {
          if (this.csWizardOptions.events[event]) {
            this.csWizardOptions.events[event](resource);
          }
        }
        if (this.panelStack.length === 0) {
          $scope.$emit('wizard-finished');
          if (this.csWizardOptions && this.csWizardOptions.events) {
            if (this.csWizardOptions.events['wizard-finished']) {
              return this.csWizardOptions.events['wizard-finished'](resource);
            }
          }
        }
      };

    }]
})
