/**
 * cloudstorm - v0.0.21 - 2018-02-14
 * https://github.com/cloudstorm/cloudstorm#readme
 *
 * Copyright (c) 2018 Virtual Solutions Ltd <info@cloudstorm.io>
 * Licensed MIT 
 */
"use strict";
var app;

app = angular.module('cloudStorm.alert', []);

app.directive("csAlert", [
  'csAlertService', function(csAlertService) {
    var compile, link;
    compile = function($templateElement, $templateAttributes) {
      $templateElement.addClass("cs-alert");
      return {
        pre: function(scope, element, attrs, controller) {},
        post: link
      };
    };
    link = function(scope, element, attrs, controller) {
      scope.csAlertService = csAlertService;
    };
    return {
      restrict: 'E',
      templateUrl: 'components/cs-alert/cs-alert-template.html',
      compile: compile
    };
  }
]);

"use strict";
var app;

app = angular.module('cloudStorm.field', []);

app.directive("csField", [
  '$compile', '$templateRequest', 'csInputBase', function($compile, $templateRequest, csInputBase) {
    var compile, getDirectiveOverride, link;
    compile = function($templateElement, $templateAttributes, $scope) {
      $templateElement.addClass("cs-field");
      return {
        pre: function($scope, element, attrs, controller) {},
        post: link
      };
    };
    link = function($scope, element, attrs, controller) {
      var directiveName, innerElement, inputTemplate, override, styleMap, type, wrapperName;
      csInputBase($scope);
      if (($scope.field == null) && ($scope.fieldName != null)) {
        $scope.field = _.find($scope.formItem.constructor.descriptor.fields, {
          attribute: $scope.fieldName
        });
      }
      if (override = getDirectiveOverride($scope)) {
        directiveName = override;
      } else {
        type = $scope.field.type;
        directiveName = (function() {
          switch (false) {
            case type !== 'boolean':
              return 'cs-checkbox';
            case type !== 'date':
              return 'cs-date';
            case type !== 'datetime':
              return 'cs-datetime';
            case type !== 'enum':
              return 'cs-enum';
            case type !== 'integer':
              return 'cs-number';
            case type !== 'float':
              return 'cs-number';
            case type !== 'resource':
              return 'cs-resource-input';
            case type !== 'string':
              return 'cs-textfield';
            case type !== 'time':
              return 'cs-time';
            case type !== 'code':
              return 'cs-code';
          }
        })();
      }
      wrapperName = ".cs-input-wrapper";
      inputTemplate = "<" + directiveName + " form-item='formItem' field-name='fieldName' field='field' form-mode='formMode' create-resources='createResources()' options='csFieldOptions'> </" + directiveName + ">";
      innerElement = angular.element(element[0].querySelector(wrapperName));
      innerElement.append($compile(inputTemplate)($scope));
      $scope.$watch('field.inactive', function(newValue, oldValue) {
        if (newValue !== oldValue) {
          element.removeClass('inactive');
          if ($scope.field.inactive) {
            return element.addClass('inactive');
          }
        }
      });
      $scope.$watch('field.errors', function(newValue, oldValue) {
        if (newValue !== oldValue) {
          element.removeClass('has-error');
          if ($scope.getError($scope.field)) {
            return element.addClass('has-error');
          }
        }
      });
      switch ($scope.formMode) {
        case "edit":
          styleMap = {
            required: "show",
            container: "container-vertical",
            label: "field-vertical",
            value: "value-vertical"
          };
          break;
        case "create":
          styleMap = {
            required: "show",
            container: "container-vertical",
            label: "field-vertical",
            value: "value-vertical"
          };
          break;
        case "show":
          styleMap = {
            required: "hidden",
            container: "container-horizontal",
            label: "label-horizontal",
            value: "value-horizontal"
          };
          break;
        case "tableView":
          styleMap = {
            required: "hidden",
            container: "container-horizontal",
            label: "hidden",
            value: "value-horizontal"
          };
      }
      $scope.CL = styleMap;
      $scope.CL.containerStyle = $scope.formMode === 'tableView' ? 'cs-field-inner-table' : 'cs-field-inner-form';
      $scope.$on('field-error', function(event, reason) {
        var errors;
        errors = reason.data.errors;
        $scope.field.errors = _.filter(errors, function(error) {
          var err;
          err = error.source.pointer.split('/').pop();
          return err === $scope.field.attribute || err === $scope.field.relationship;
        });
        return _.each($scope.field.errors, function(error, index) {
          return $scope.field.errors[index] = error.detail;
        });
      });
      $scope.$on('field-cancel', function(event) {
        return $scope.field.errors = null;
      });
      $scope.$on('field-submit', function(event) {
        return $scope.field.errors = null;
      });
      $scope.getError = function(field) {
        if (field.errors) {
          return field.errors.toString();
        }
      };
      $scope.getHint = function(field) {
        return field.hint || null;
      };
    };
    getDirectiveOverride = function($scope) {
      var overrideName, overrides;
      overrideName = null;
      if ((overrides = $scope.csFieldOptions['directive-overrides'])) {
        _(overrides).forEach(function(override) {
          if ((override.type === $scope.field.type) && override.directive) {
            return overrideName = override.directive;
          }
        });
        _(overrides).forEach(function(override) {
          if ((override.attribute === $scope.field.attribute) && override.directive) {
            return overrideName = override.directive;
          }
        });
      }
      return overrideName;
    };
    return {
      restrict: 'E',
      templateUrl: 'components/cs-field/cs-field-template.html',
      scope: {
        field: '=?',
        fieldName: '@',
        formItem: '=',
        formMode: '=',
        csFieldOptions: '=',
        createResources: '&',
        descriptor: "="
      },
      compile: compile
    };
  }
]);

"use strict";
var app;

app = angular.module('cloudStorm.checkbox', []);

app.directive("csCheckbox", [
  '$rootScope', 'csInputBase', 'csSettings', function($rootScope, csInputBase, csSettings) {
    var compile, link;
    compile = function($templateElement, $templateAttributes) {
      $templateElement.addClass("cs-checkbox");
      return {
        pre: function(scope, element, attrs, controller) {},
        post: link
      };
    };
    link = function($scope, element, attrs, controller) {
      csInputBase($scope);
      $scope.i18n = csSettings.settings['i18n-engine'];
      if ($scope.formMode === 'create') {
        if ($scope.field["default"] != null) {
          $scope.formItem.attributes[$scope.field.attribute] = $scope.field["default"];
        }
      }
      $scope.formItem.attributes[$scope.field.attribute] = !!$scope.formItem.attributes[$scope.field.attribute];
      $scope.$watch('formItem.attributes[field.attribute]', function(newValue, oldValue) {
        if (newValue !== oldValue) {
          return $scope.$emit('input-value-changed', $scope.field);
        }
      });
      $scope.$on('form-reset', function() {
        return $scope.formItem.attributes[$scope.field.attribute] = false;
      });
    };
    return {
      restrict: 'E',
      templateUrl: 'components/cs-fields/cs-checkbox/cs-checkbox-template.html',
      scope: {
        field: '=',
        formItem: '=',
        formMode: '=',
        options: '='
      },
      compile: compile
    };
  }
]);

"use strict";
var app;

app = angular.module('cloudStorm.code', ['ui.select']);

app.directive("csCode", [
  '$rootScope', 'csTemplateService', 'csInputBase', '$uibModal', function($rootScope, csTemplateService, csInputBase, $uibModal) {
    var compile, format_code, link;
    compile = function($templateElement, $templateAttributes) {
      $templateElement.addClass("cs-code");
      return {
        pre: function(scope, element, attrs, controller) {},
        post: link
      };
    };
    format_code = function($scope) {
      var codeString, e, error;
      codeString = $scope.formItem.attributes[$scope.field.attribute] || 'null';
      try {
        if (typeof codeString === 'string') {
          codeString = JSON.stringify(JSON.parse($scope.formItem.attributes[$scope.field.attribute]), null, '  ');
        } else {
          codeString = JSON.stringify($scope.formItem.attributes[$scope.field.attribute], null, ' ');
        }
      } catch (error) {
        e = error;
        codeString = $scope.formItem.attributes[$scope.field.attribute] || 'null';
      }
      $scope.formatted_code = codeString;
      if (codeString.length > 10) {
        $scope.formatted_code_short = codeString.substring(0, 10) + '\n...';
        return $scope.trimmed = true;
      } else {
        $scope.formatted_code_short = codeString;
        return $scope.trimmed = false;
      }
    };
    link = function($scope, element, attrs, controller) {
      csInputBase($scope);
      $scope.csTemplateService = csTemplateService;
      $scope.defaultTemplate = 'components/cs-fields/cs-code/cs-code-template.html';
      format_code($scope);
      $scope.$watch('formItem.attributes[field.attribute]', function(newValue, oldValue) {
        if (newValue !== oldValue) {
          return $scope.$emit('input-value-changed', $scope.field);
        }
      });
      $scope.keyPressed = function($event) {
        if ($event.keyCode === 13) {
          return $scope.$emit('submit-form-on-enter', $scope.field);
        }
      };
      $scope.showFullCode = function($event) {
        var modalTemplate;
        modalTemplate = "" + "<cs-full-code " + "modal-instance=\"modalInstance\", " + "content=\"formatted_code\", " + "title=\"field.attribute\" " + " </cs-full-code>";
        $scope.modalInstance = $uibModal.open({
          scope: $scope,
          keyboard: true,
          backdrop: 'static',
          template: modalTemplate
        });
        return $scope.modalInstance.result["finally"](angular.noop).then(angular.noop, angular.noop);
      };
    };
    return {
      restrict: 'E',
      template: '<ng-include src="csTemplateService.getTemplateUrl(field,options,defaultTemplate)"/>',
      scope: {
        field: '=',
        formItem: '=',
        formMode: '=',
        options: '='
      },
      compile: compile,
      controller: [
        '$scope', function($scope) {
          $scope.$watch('formItem.id', function(newValue, oldValue) {
            if (newValue !== oldValue) {
              return format_code($scope);
            }
          });
          return $scope.$watch('formItem.attributes[field.attribute]', function(newValue, oldValue) {
            if (newValue !== oldValue) {
              return format_code($scope);
            }
          });
        }
      ]
    };
  }
]);

"use strict";
var app;

app = angular.module('cloudStorm.date', []);

app.directive("csDate", [
  'uibDateParser', 'csSettings', 'csInputBase', '$filter', function(uibDateParser, csSettings, csInputBase, $filter) {
    var compile, format_date, link;
    compile = function($templateElement, $templateAttributes) {
      $templateElement.addClass("cs-date");
      return {
        pre: function(scope, element, attrs, controller) {},
        post: link
      };
    };
    format_date = function($scope) {
      var date, format, input_date;
      format = $scope.options['date-format'] || csSettings.settings['date-format'];
      $scope.input_date = $scope.formItem.attributes[$scope.field.attribute];
      if (format) {
        input_date = $scope.formItem.attributes[$scope.field.attribute];
        date = uibDateParser.parse(input_date, format);
        if (date) {
          date.setHours(14);
        }
        $scope.formItem.attributes[$scope.field.attribute] = date;
        return $scope.input_date = $filter('date')(date, format);
      }
    };
    link = function($scope, element, attrs, controller) {
      $scope.i18n = csSettings.settings['i18n-engine'];
      $scope.getType = function() {
        return typeof $scope.formItem.attributes[$scope.field.attribute];
      };
      csInputBase($scope);
      format_date($scope);
      $scope.$on('field-submit', function(e, data) {
        return console.log("field submit event " + data);
      });
      return $scope.$watch('formItem.attributes[field.attribute]', function(newValue, oldValue) {
        if (newValue !== oldValue) {
          $scope.$emit('input-value-changed', $scope.field);
          return format_date($scope);
        }
      });
    };
    return {
      restrict: 'E',
      templateUrl: 'components/cs-fields/cs-date/cs-date-template.html',
      priority: 1000,
      scope: {
        field: '=',
        formItem: '=',
        formMode: '=',
        options: '='
      },
      compile: compile,
      controller: [
        '$scope', function($scope) {
          $scope.getModelOptions = function() {
            var offset, options;
            offset = $scope.options['time-zone-offset'] || csSettings.settings['time-zone-offset'];
            return options = {
              'timezone': offset
            };
          };
          return $scope.$watch('formItem.id', function(newValue, oldValue) {
            if (newValue !== oldValue) {
              return format_date($scope);
            }
          });
        }
      ]
    };
  }
]);

"use strict";
var app;

app = angular.module('cloudStorm.datetime', ['ui.bootstrap']);

app.directive("csDatetime", [
  'uibDateParser', 'csSettings', 'csInputBase', '$filter', function(uibDateParser, csSettings, csInputBase, $filter) {
    var compile, format_date, link;
    compile = function($templateElement, $templateAttributes) {
      $templateElement.addClass("cs-datetime");
      return {
        pre: function(scope, element, attrs, controller) {},
        post: link
      };
    };
    format_date = function($scope) {
      var date, date_format, input_date;
      date_format = $scope.options['datetime-format'] || csSettings.settings['datetime-format'];
      if (date_format) {
        input_date = $scope.formItem.attributes[$scope.field.attribute];
        if (input_date) {
          if (!angular.isDate(input_date)) {
            input_date = input_date.substring(0, input_date.length - 1);
          }
          date = uibDateParser.parse(new Date(input_date), date_format);
          $scope.formItem.attributes[$scope.field.attribute] = date;
          return $scope.input_date = $filter('date')(date, 'EEEE, MMMM d, y HH:mm');
        }
      }
    };
    link = function($scope, element, attrs, controller) {
      $scope.i18n = csSettings.settings['i18n-engine'];
      csInputBase($scope);
      format_date($scope);
      return $scope.$watch('formItem.attributes[field.attribute]', function(newValue, oldValue) {
        if (newValue !== oldValue) {
          return $scope.$emit('input-value-changed', $scope.field);
        }
      });
    };
    return {
      restrict: 'E',
      templateUrl: 'components/cs-fields/cs-datetime/cs-datetime-template.html',
      priority: 1000,
      scope: {
        field: '=',
        formItem: '=',
        formMode: '=',
        options: '='
      },
      compile: compile,
      controller: [
        '$scope', function($scope) {
          $scope.getModelOptions = function() {
            var offset, options;
            offset = $scope.options['time-zone-offset'] || csSettings.settings['time-zone-offset'] || 'utc';
            return options = {
              'timezone': offset
            };
          };
          return $scope.$watch('formItem.id', function(newValue, oldValue) {
            if (newValue !== oldValue) {
              return format_date($scope);
            }
          });
        }
      ]
    };
  }
]);

"use strict";
var app;

app = angular.module('cloudStorm.enum', ['ui.select']);

app.directive("csEnum", [
  '$rootScope', 'csInputBase', function($rootScope, csInputBase) {
    var compile, link;
    compile = function($templateElement, $templateAttributes) {
      $templateElement.addClass("cs-enum");
      return {
        pre: function(scope, element, attrs, controller) {},
        post: link
      };
    };
    link = function($scope, element, attrs, controller) {
      csInputBase($scope);
      $scope.$watch('formItem.attributes[field.attribute]', function(newValue, oldValue) {
        if (newValue !== oldValue) {
          return $scope.$emit('input-value-changed', $scope.field);
        }
      });
    };
    return {
      restrict: 'E',
      templateUrl: 'components/cs-fields/cs-enum/cs-enum-template.html',
      scope: {
        field: '=',
        formItem: '=',
        formMode: '=',
        options: '='
      },
      compile: compile
    };
  }
]);

"use strict";
var app;

app = angular.module('cloudStorm.number', []);

app.directive("csNumber", [
  '$rootScope', 'csInputBase', function($rootScope, csInputBase) {
    var compile, link;
    compile = function($templateElement, $templateAttributes) {
      $templateElement.addClass("cs-number");
      return {
        pre: function(scope, element, attrs, controller) {},
        post: link
      };
    };
    link = function($scope, element, attrs, controller) {
      csInputBase($scope);
      if ($scope.formMode === 'create') {
        if ($scope.field["default"] != null) {
          $scope.formItem.attributes[$scope.field.attribute] = $scope.field["default"];
        }
      }
      $scope.$watch('formItem.attributes[field.attribute]', function(newValue, oldValue) {
        if (newValue !== oldValue) {
          return $scope.$emit('input-value-changed', $scope.field);
        }
      });
    };
    return {
      restrict: 'E',
      templateUrl: 'components/cs-fields/cs-number/cs-number-template.html',
      scope: {
        field: '=',
        formItem: '=',
        formMode: '=',
        options: '='
      },
      compile: compile
    };
  }
]);

"use strict";
var app;

app = angular.module('cloudStorm.resourceInput', ['ui.select']);

app.directive("csResourceInput", [
  '$rootScope', 'ResourceService', 'csTemplateService', 'csInputBase', 'csSettings', function($rootScope, ResourceService, csTemplateService, csInputBase, csSettings) {
    var compile, link, setup_associations;
    compile = function($templateElement, $templateAttributes) {
      $templateElement.addClass("cs-resource-input");
      return {
        pre: function(scope, element, attrs, controller) {},
        post: link
      };
    };
    link = function($scope, element, attrs, controller) {
      var refreshAndSelect;
      $scope.i18n = csSettings.settings['i18n-engine'];
      csInputBase($scope);
      $scope.csTemplateService = csTemplateService;
      $scope.defaultTemplate = 'components/cs-fields/cs-resource-input/cs-resource-input-template.html';
      setup_associations($scope);
      if ($scope.field.cardinality === 'one') {
        $scope.$watch('{id: model.object.id, type: model.object.type}', function(newValue, oldValue) {
          if ((newValue.id !== oldValue.id) || (newValue.type !== oldValue.type)) {
            $scope.formItem.$assign_association($scope.field, $scope.model.object);
            return $scope.$emit('input-value-changed', $scope.field);
          }
        });
      }
      if ($scope.field.cardinality === 'many') {
        $scope.$watchCollection('model.object', function(newItems, oldItems) {
          $scope.formItem.$assign_association($scope.field, newItems);
          return $scope.$emit('input-value-changed', $scope.field);
        });
      }
      $scope.$watch('formItem.id', function(newValue, oldValue) {
        if (newValue !== oldValue) {
          setup_associations($scope);
          return $scope.$emit('input-value-changed', $scope.field);
        }
      });
      $scope.$watch('formItem.relationships[field.relationship].data.id', function(newValue, oldValue) {
        if (newValue !== oldValue) {
          return $scope.model.object = $scope.formItem.$association($scope.field);
        }
      });
      $scope.selectItem = function() {};
      $scope.$on('form-reset', function() {
        return $scope.model = {
          object: $scope.formItem.$association($scope.field)
        };
      });
      $rootScope.$on('form-submit', function(event, formItem) {
        var itemID;
        if ($scope.formMode === "tableView") {
          $scope.resource = ResourceService.get($scope.field.resource);
          $scope.model = {
            object: $scope.formItem.$association($scope.field)
          };
        }
        if (formItem.type === $scope.field.resource) {
          if (event.stopPropagation) {
            event.stopPropagation();
          }
          itemID = formItem.id.slice();
          if (itemID !== $scope.formItem.id) {
            return refreshAndSelect(itemID);
          }
        }
      });
      $scope.refresh = function(value) {
        var search_options;
        search_options = angular.merge({
          datastore: $scope.formItem.$datastore
        }, $scope.field.resource_endpoint);
        return $scope.resource.$search(value, search_options).then(function(items) {
          var ref, relationships;
          $scope.associates = items;
          if (relationships = (ref = $scope.formItem.relationships) != null ? ref[$scope.field.relationship] : void 0) {
            return $scope.model.object = $scope.formItem.$association($scope.field);
          }
        }, function(reason) {
          return console.log(reason);
        }, function() {});
      };
      $scope.pushPanel = function() {
        return $scope.$emit('create-resource', $scope.field.resource, $scope.field.attribute, $scope.formItem);
      };
      $scope.canCreateResources = function() {
        var ref, ref1, ref2;
        return $scope.createResources() && !((ref = $scope.formItem.relationships) != null ? (ref1 = ref[$scope.field.relationship]) != null ? (ref2 = ref1.data) != null ? ref2.id : void 0 : void 0 : void 0);
      };
      refreshAndSelect = function(itemID) {
        var search_options;
        search_options = angular.merge({}, $scope.field.resource_endpoint);
        return $scope.resource.$search(null, search_options).then(function(items) {
          var base;
          $scope.associates = items;
          if ($scope.field.cardinality === 'one') {
            return $scope.model.object = _.find(items, {
              id: itemID
            });
          } else {
            (base = $scope.model).object || (base.object = []);
            return $scope.model.object.push(_.find(items, {
              id: itemID
            }));
          }
        }, function(reason) {
          return console.log(reason);
        }, function() {});
      };
    };
    setup_associations = function($scope) {
      $scope.resource = ResourceService.get($scope.field.resource);
      $scope.model = {
        object: $scope.formItem.$association($scope.field)
      };
      if ($scope.associates) {
        $scope.associates = [];
        return $scope.refresh();
      } else {
        return $scope.associates = [];
      }
    };
    return {
      restrict: 'E',
      template: '<ng-include src="csTemplateService.getTemplateUrl(field,options,defaultTemplate)"/>',
      scope: {
        field: '=',
        formItem: '=',
        formMode: '=',
        options: '=',
        createResources: '&'
      },
      compile: compile
    };
  }
]);

app.directive('uiSelectOverride', function() {
  return {
    require: 'uiSelect',
    link: function($scope, element, attrs, $select) {
      var handleScroll;
      handleScroll = $scope.$on('form-scroll', function(event, field) {
        if ($select.multiple) {
          $select.close();
        }
        return $scope.$apply();
      });
      return $scope.$on('$destroy', function() {
        return handleScroll();
      });
    }
  };
});

"use strict";
var app;

app = angular.module('cloudStorm.textfield', ['ui.select']);

app.directive("csTextfield", [
  '$rootScope', 'csTemplateService', 'csInputBase', function($rootScope, csTemplateService, csInputBase) {
    var compile, link;
    compile = function($templateElement, $templateAttributes) {
      $templateElement.addClass("cs-textfield");
      return {
        pre: function(scope, element, attrs, controller) {},
        post: link
      };
    };
    link = function($scope, element, attrs, controller) {
      csInputBase($scope);
      $scope.csTemplateService = csTemplateService;
      $scope.defaultTemplate = 'components/cs-fields/cs-textfield/cs-textfield-template.html';
      $scope.$watch('formItem.attributes[field.attribute]', function(newValue, oldValue) {
        if (newValue !== oldValue) {
          return $scope.$emit('input-value-changed', $scope.field);
        }
      });
      $scope.keyPressed = function($event) {
        if ($event.keyCode === 13) {
          return $scope.$emit('submit-form-on-enter', $scope.field);
        }
      };
    };
    return {
      restrict: 'E',
      template: '<ng-include src="csTemplateService.getTemplateUrl(field,options,defaultTemplate)"/>',
      scope: {
        field: '=',
        formItem: '=',
        formMode: '=',
        options: '='
      },
      compile: compile
    };
  }
]);

"use strict";
var app;

app = angular.module('cloudStorm.time', []);

app.directive("csTime", [
  'uibDateParser', 'csSettings', 'csInputBase', function(uibDateParser, csSettings, csInputBase) {
    var compile, link;
    compile = function($templateElement, $templateAttributes) {
      $templateElement.addClass("cs-time");
      return {
        pre: function(scope, element, attrs, controller) {},
        post: link
      };
    };
    link = function($scope, element, attrs, controller) {
      $scope.i18n = csSettings.settings['i18n-engine'];
      csInputBase($scope);
      return $scope.$watch('formItem.attributes[field.attribute]', function(newValue, oldValue) {
        if (newValue !== oldValue) {
          return $scope.$emit('input-value-changed', $scope.field);
        }
      });
    };
    return {
      restrict: 'E',
      templateUrl: 'components/cs-fields/cs-time/cs-time-template.html',
      priority: 1000,
      scope: {
        field: '=',
        formItem: '=',
        formMode: '=',
        options: '='
      },
      compile: compile,
      controller: [
        '$scope', function($scope) {
          return $scope.getModelOptions = function() {
            var offset, options;
            offset = $scope.options['time-zone-offset'] || csSettings.settings['time-zone-offset'] || 'utc';
            return options = {
              'timezone': offset
            };
          };
        }
      ]
    };
  }
]);

"use strict";
var app;

app = angular.module('cloudStorm.form', []);

app.directive("csForm", [
  'csSettings', function(csSettings) {
    var compile, link;
    compile = function($templateElement, $templateAttributes) {
      $templateElement.addClass("cs-form");
      return {
        pre: function($scope, element, attrs, controller) {},
        post: link
      };
    };
    link = function($scope, element, attrs, controller) {
      var attributeToHide, elem, scrollTrigger;
      $scope.i18n = csSettings.settings['i18n-engine'];
      $scope.fields = $scope.formResourceDescriptor.fields;
      if ($scope.formMode === 'create') {
        if ($scope.formItem) {
          $scope.formItem = $scope.formResource.$new({
            value: $scope.formItem
          });
        } else {
          $scope.formItem = $scope.formResource.$new();
        }
      }
      if ($scope.formMode === 'edit' || $scope.formMode === 'show') {
        $scope.editableItem = $scope.formResource.$new({
          value: $scope.formItem
        });
      } else {
        $scope.editableItem = $scope.formItem;
      }
      $scope.$emit('form-init', $scope);
      $scope.$emit('transitioned', $scope.editableItem, $scope.formParent);
      $scope.$watch('formItem.id', function(newValue, oldValue) {
        if (newValue !== oldValue) {
          if ($scope.formMode === 'edit') {
            $scope.editableItem.$clone($scope.formItem);
            return _($scope.fields).each(function(field) {
              return delete field.errors;
            });
          }
        }
      });
      scrollTrigger = _.throttle(function() {
        return $scope.$broadcast('form-scroll', 300);
      });
      elem = element[0].querySelector('form');
      angular.element(elem).on('scroll', scrollTrigger);
      $scope.$on('input-value-changed', function(event, field) {
        return $scope.$broadcast('field-value-changed', field);
      });
      $scope.$on('submit-form-on-enter', function(event, field) {
        if (!($scope.csFormOptions['skip-on-enter'] && $scope.wizardPanelIndex === 0)) {
          return $scope.submit();
        }
      });
      $scope.$on('form-init', function(event, formScope) {
        if ($scope.csFormOptions.events['form-init']) {
          return $scope.csFormOptions.events['form-init'](formScope);
        }
      });
      $scope.$on('field-value-changed', function(event, field) {
        if ($scope.csFormOptions.events['field-value-changed']) {
          return $scope.csFormOptions.events['field-value-changed'](field, $scope);
        }
      });
      $scope.isFieldVisible = function(field_attribute) {
        if (!attributeToHide(field_attribute)) {
          return true;
        }
      };
      $scope.cancel = function() {
        $scope.$emit('form-cancel', $scope.formItem);
        return $scope.$broadcast('field-cancel', $scope.formItem);
      };
      $scope.submit = function() {
        var api_action;
        api_action = null;
        if ($scope.formMode === 'edit') {
          api_action = $scope.editableItem.$save;
        } else if ($scope.formMode === 'create') {
          api_action = $scope.editableItem.$create;
        }
        return api_action.call($scope.editableItem).then(function(item) {
          if ($scope.editableItem !== $scope.formItem) {
            $scope.formItem.$assign($scope.editableItem);
          }
          $scope.$emit('form-submit', $scope.formItem);
          $scope.$broadcast('field-submit', $scope.formItem);
          if ($scope.csFormOptions['reset-on-submit']) {
            angular.copy($scope.formResource.$new(), $scope.formItem);
            return $scope.$broadcast('form-reset');
          }
        }, function(reason) {
          $scope.$emit('form-error', reason);
          return $scope.$broadcast('field-error', reason);
        }, function() {});
      };
      attributeToHide = function(field_attribute) {
        var attributes, shouldHide;
        shouldHide = false;
        attributes = $scope.editableItem.constructor.descriptor.attributes_to_hide;
        if (attributes && attributes[$scope.formMode]) {
          shouldHide = attributes[$scope.formMode].indexOf(field_attribute) > -1;
        }
        if ($scope.csFormOptions['attributes-to-hide'] && $scope.csFormOptions['attributes-to-hide'][$scope.formMode]) {
          shouldHide = $scope.csFormOptions['attributes-to-hide'][$scope.formMode].indexOf(field_attribute) > -1;
        }
        return shouldHide;
      };
      $scope.$on('$destroy', function() {});
    };
    return {
      restrict: 'A',
      templateUrl: 'components/cs-form/cs-form-template.html',
      transclude: {
        fields: '?formFields',
        actions: '?formActions'
      },
      scope: {
        csFormOptions: '=',
        formResource: '=',
        formResourceDescriptor: '=',
        formItem: '=?',
        formParent: '=?',
        formMode: '@',
        wizardPanelIndex: '=',
        createResources: '&',
        formUpdate: '=',
        formCreate: '='
      },
      compile: compile
    };
  }
]);

"use strict";
var app;

app = angular.module('cloudStorm.index.sidePanel', []);

app.directive("csIndexSidepanel", [
  '$rootScope', 'csAlertService', 'csSettings', 'csRoute', function($rootScope, csAlertService, csSettings, csRoute) {
    var compile;
    compile = function($templateElement, $templateAttributes) {
      var link;
      $templateElement.addClass("cs-index-sidepanel");
      ({
        pre: function($scope, element, attrs, controller) {},
        post: link
      });
      return link = function($scope, element, attrs) {
        $scope.i18n = csSettings.settings['i18n-engine'];
        $scope.editWizardOptions = {
          "resource-type": $scope.resourceType,
          "form-item": $scope.item,
          "form-mode": "edit",
          "keep-first": true,
          "events": {
            'wizard-canceled': function(resource) {
              var ref;
              $scope.unselectItem();
              return csAlertService.addAlert(((ref = $scope.i18n) != null ? ref.t('alert.nothing_changed') : void 0) || 'translation missing', 'info');
            },
            'wizard-submited': function(resource) {
              var ref;
              $scope.unselectItem();
              return csAlertService.addAlert(((ref = $scope.i18n) != null ? ref.t('alert.changes_saved') : void 0) || 'translation missing', 'success');
            },
            'wizard-error': function(resource) {
              var ref;
              return csAlertService.addAlert(((ref = $scope.i18n) != null ? ref.t('alert.error_happened') : void 0) || 'translation missing', 'danger');
            }
          }
        };
        angular.merge($scope.editWizardOptions, _.omit($scope.csIndexSidepanelOptions, "selectedItem"));
        $scope.$watch('item', function(newItem, oldItem) {
          var options;
          if (newItem !== oldItem) {
            if (options = $scope.editWizardOptions) {
              return options['form-item'] = newItem;
            }
          }
        });
        $scope.closePanel = function() {
          return $scope.$broadcast('wizard-cancel');
        };
      };
    };
    return {
      restrict: 'E',
      compile: compile,
      templateUrl: 'components/cs-index/cs-index-sidepanel/cs-index-sidepanel-template.html',
      scope: {
        resourceType: '=',
        item: '=',
        itemId: '=',
        unselectItem: '&unselectItem',
        csIndexSidepanelOptions: '=',
        panelNumberCallback: '='
      }
    };
  }
]);

"use strict";
var app;

app = angular.module('cloudStorm.inputBase', []);

app.factory("csInputBase", [
  function() {
    var build;
    build = function($scope) {
      $scope.fieldDisabled = function() {
        return $scope.field.read_only && $scope.formMode !== 'create';
      };
      $scope.fieldRequired = function() {
        return $scope.field.required;
      };
      $scope.createDisabled = function() {
        return $scope.field.create_disabled;
      };
      $scope.mode = function(mode) {
        return $scope.formMode === mode;
      };
      return $scope.style = function(name) {
        return $scope.styleMap[name];
      };
    };
    return build;
  }
]);

"use strict";
var app;

app = angular.module('cloudStorm.menu', []);

app.directive("csMenu", [
  'ResourceService', 'csDescriptorService', 'csRoute', 'csSettings', function(ResourceService, csDescriptorService, csRoute, csSettings) {
    var compile;
    compile = function($templateElement, $templateAttributes) {
      var link;
      $templateElement.addClass("cs-menu");
      ({
        pre: function($scope, element, attrs, controller) {
          return returns;
        },
        post: link
      });
      return link = function($scope, element, attrs, ctrl) {
        csDescriptorService.getPromises().then(function() {
          $scope.resources = ResourceService.getResources();
          return $scope.$apply();
        });
        $scope.title = csSettings.settings['app-title'];
        $scope.selected = null;
        $scope.$watch((function() {
          return ResourceService.getResources();
        }), function(newVal) {
          return csDescriptorService.getPromises().then(function() {
            return $scope.resources = ResourceService.getResources();
          });
        });
        $scope.isSelected = function(type) {
          return type === $scope.selected;
        };
        return $scope.select = function(type) {
          $scope.selected = type;
          return csRoute.go("index", {
            resourceType: type
          });
        };
      };
    };
    return {
      restrict: 'E',
      compile: compile,
      templateUrl: 'components/cs-menu/cs-menu-template.html'
    };
  }
]);

"use strict";
var app;

app = angular.module('cloudStorm.wizard', []);

app.directive("csWizard", [
  '$rootScope', 'ResourceService', '$document', function($rootScope, ResourceService, $document) {
    var compile, link, notify_listeners, popAllPanels, popPanel;
    compile = function($templateElement, $templateAttributes) {
      $templateElement.addClass("cs-wizard");
      return {
        pre: function(scope, element, attrs, controller) {},
        post: link
      };
    };
    link = function($scope, element, attrs, controller) {
      var keyPressed, override, overriden_resource_descriptors, panelDescriptor, resource_type, wizardMaxDepth;
      wizardMaxDepth = $scope.csWizardOptions['max-depth'] || 5;
      resource_type = $scope.csWizardOptions['resource-type'];
      panelDescriptor = {
        resource: angular.copy(ResourceService.get(resource_type)),
        item: $scope.csWizardOptions['form-item'],
        formMode: $scope.csWizardOptions['form-mode'],
        parent: null
      };
      if ($scope.csWizardOptions['resource-overrides'] && (override = $scope.csWizardOptions['resource-overrides'][resource_type])) {
        if (override.directive != null) {
          panelDescriptor.directive = override.directive;
        }
      }
      $scope.panelStack = [panelDescriptor];
      if ($scope.panelNumberCallback) {
        $scope.panelNumberCallback($scope.panelStack.length);
      }
      $scope.$watch("csWizardOptions['form-item']", function(newValue, oldValue) {
        if ((newValue !== oldValue) && ($scope.panelStack.length > 0)) {
          return $scope.panelStack[0].item = $scope.csWizardOptions['form-item'];
        }
      });
      $scope.$watchCollection('panelStack', function(newPanelStack, oldPanelStack) {
        attrs.$set('numberOfPanels', newPanelStack.length);
        return $scope.numberOfPanels = newPanelStack.length;
      });
      $scope.$on('create-resource', function(event, resource, attribute, parent) {
        return $scope.pushPanel(resource, attribute, parent);
      });
      $scope.$on('form-cancel', function(event, resource, attribute) {
        popPanel($scope);
        if ($scope.panelStack.length === 0) {
          return notify_listeners($scope, 'wizard-canceled', resource);
        }
      });
      $scope.$on('wizard-cancel', function(event, resource, attribute) {
        popAllPanels($scope);
        if ($scope.panelStack.length === 0) {
          return notify_listeners($scope, 'wizard-canceled', resource);
        }
      });
      $scope.$on('form-submit', function(event, resource, attribute) {
        if ($scope.panelStack.length === 1) {
          notify_listeners($scope, 'wizard-submited', resource);
          if (!$scope.csWizardOptions['keep-first']) {
            return popPanel($scope);
          }
        } else {
          return popPanel($scope);
        }
      });
      $scope.$on('form-error', function(event, resource, attribute) {
        if (resource.status !== 422) {
          $scope.$emit('wizard-error', resource.data);
          if ($scope.csWizardOptions.events['wizard-error'] && $scope.panelStack.length === 1) {
            return $scope.csWizardOptions.events['wizard-error'](resource);
          }
        }
      });
      $scope.$on('transitioned', function(event, child, parent) {
        var i, len, results, transition, transitions;
        if (child && parent) {
          if ($scope.csWizardOptions.transitions) {
            if (transitions = $scope.csWizardOptions.transitions[parent.type] && $scope.csWizardOptions.transitions[parent.type][child.type]) {
              results = [];
              for (i = 0, len = transitions.length; i < len; i++) {
                transition = transitions[i];
                results.push(transition(child, parent));
              }
              return results;
            }
          }
        }
      });
      keyPressed = function(keyEvent) {
        if (keyEvent.keyCode === 27) {
          popPanel($scope);
          if ($scope.panelStack.length === 0) {
            notify_listeners($scope, 'wizard-canceled', null);
          }
          return $scope.$apply();
        }
      };
      $document.on('keydown', keyPressed);
      $scope.$on('$destroy', function() {
        return $document.off('keydown', keyPressed);
      });
      $scope.shouldShowNewButton = function() {
        if ($scope.panelStack.length >= wizardMaxDepth) {
          return false;
        }
        return true;
      };
      $scope.panelHover = function(hoveredIndex) {
        return _.forEach($scope.panelStack, function(panel, panelIndex) {
          if (panelIndex < hoveredIndex) {
            return panel.hoverOrder = -1;
          } else if (panelIndex > hoveredIndex) {
            return panel.hoverOrder = 1;
          } else {
            return panel.hoverOrder = 0;
          }
        });
      };
      $scope.pushPanel = function(resource_type, attribute, parent) {
        var activeField, panelIndex;
        panelIndex = $scope.panelStack.length - 1;
        _.forEach($scope.panelStack[panelIndex].resource.descriptor.fields, function(value) {
          return value.inactive = true;
        });
        activeField = _.find($scope.panelStack[panelIndex].resource.descriptor.fields, function(o) {
          return o.attribute === attribute;
        });
        if (activeField) {
          activeField.inactive = false;
        }
        panelDescriptor = {
          resource: angular.copy(ResourceService.get(resource_type)),
          parent: parent,
          formMode: 'create'
        };
        if ($scope.csWizardOptions['resource-overrides'] && (override = $scope.csWizardOptions['resource-overrides'][resource_type])) {
          if (override.directive != null) {
            panelDescriptor.directive = override.directive;
          }
        }
        $scope.panelStack.push(panelDescriptor);
        $scope.panelHover(panelIndex + 1);
        if ($scope.panelNumberCallback) {
          $scope.panelNumberCallback($scope.panelStack.length);
        }
      };
      overriden_resource_descriptors = {};
      return $scope.resource_descriptor = function(panel) {
        var descriptor, field, field_name, field_override, field_overrides, overrides;
        if (overriden_resource_descriptors[panel.resource.descriptor.type]) {
          return overriden_resource_descriptors[panel.resource.descriptor.type];
        } else {
          descriptor = angular.copy(panel.resource.descriptor);
          overriden_resource_descriptors[panel.resource.descriptor.type] = descriptor;
          if ($scope.csWizardOptions['resource-overrides']) {
            if (overrides = $scope.csWizardOptions['resource-overrides'][panel.resource.descriptor.type]) {
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
    };
    popPanel = function($scope) {
      var panelIndex;
      $scope.panelStack.pop();
      panelIndex = $scope.panelStack.length - 1;
      if ($scope.panelStack[panelIndex]) {
        _.forEach($scope.panelStack[panelIndex].resource.descriptor.fields, function(value) {
          return value.inactive = false;
        });
      }
      $scope.panelHover(panelIndex + 1);
      if ($scope.panelNumberCallback) {
        return $scope.panelNumberCallback($scope.panelStack.length);
      }
    };
    popAllPanels = function($scope) {
      $scope.panelStack = [];
      if ($scope.panelNumberCallback) {
        return $scope.panelNumberCallback($scope.panelStack.length);
      }
    };
    notify_listeners = function($scope, event, resource) {
      $scope.$emit(event);
      if ($scope.csWizardOptions && $scope.csWizardOptions.events) {
        if ($scope.csWizardOptions.events[event]) {
          $scope.csWizardOptions.events[event](resource);
        }
      }
      if ($scope.panelStack.length === 0) {
        $scope.$emit('wizard-finished');
        if ($scope.csWizardOptions && $scope.csWizardOptions.events) {
          if ($scope.csWizardOptions.events['wizard-finished']) {
            return $scope.csWizardOptions.events['wizard-finished'](resource);
          }
        }
      }
    };
    return {
      restrict: 'A',
      templateUrl: 'components/cs-wizard/cs-wizard-template.html',
      scope: {
        csWizardOptions: '=',
        panelNumberCallback: '='
      },
      compile: compile
    };
  }
]);

app.directive("csWizardPanel", [
  '$rootScope', 'ResourceService', '$compile', function($rootScope, ResourceService, $compile) {
    var link;
    link = function($scope, element, attrs, controller) {
      var innerElement, inputTemplate;
      $scope.formClass = function() {
        return $scope.csWizardOptions['form-class'];
      };
      if ($scope.panel.directive) {
        innerElement = angular.element(element[0]);
        inputTemplate = "<" + $scope.panel.directive + "\n  autocomplete=\"off\"\n  create-resources=\"shouldShowNewButton()\"\n  cs-form-options=\"csWizardOptions\"\n  form-item=\"panel.item\"\n  form-parent=\"panel.parent\"\n  form-mode=\"{{csWizardOptions['form-mode']}}\"\n  form-resource=\"panel.resource\"\n  form-resource-descriptor=\"resource_descriptor(panel)\"\n  role=\"form\"\n  ng-class='formClass()' \n>";
        return innerElement.html($compile(inputTemplate)($scope));
      }
    };
    return {
      restrict: 'E',
      templateUrl: 'components/cs-wizard/cs-wizard-panel-template.html',
      link: link
    };
  }
]);

"use strict";
var app;

app = angular.module('cloudStorm.dataStore', []);

app.factory('csDataStore', [
  function() {
    var DataStore, global;
    DataStore = (function() {
      function DataStore(opts) {
        var parent, parent_repository;
        if (!opts) {
          parent = global;
        } else if (opts.repository) {
          parent = opts.repository;
        } else if (opts === {}) {
          parent = {};
        } else {
          parent = opts.parent || global;
        }
        parent_repository = parent.repository || parent;
        this.repository = Object.create(parent_repository);
      }

      DataStore.prototype.fork = function() {
        return new DataStore(this);
      };

      DataStore.global = function() {
        return global;
      };

      DataStore.prototype.global = function() {
        return global;
      };

      DataStore.prototype.put = function(type, id, object) {
        var base;
        (base = this.repository)[type] || (base[type] = {});
        return this.repository[type][id] = object;
      };

      DataStore.prototype.get = function(type, id, object) {
        if (!this.repository[type]) {
          return null;
        }
        return this.repository[type][id];
      };

      return DataStore;

    })();
    global = new DataStore({
      parent: {}
    });
    return DataStore;
  }
]);

"use strict";
var app;

app = angular.module('cloudStorm.csDataLoaderFactory', []);

app.factory('csDataLoader', [
  'csDataStore', 'csDescriptorService', function(csDataStore, csDescriptorService) {
    var DataLoader, getCallFcn;
    getCallFcn = function() {
      var a;
      a = {
        type: 'direct',
        func: csDescriptorService.getPromises.bind(csDescriptorService),
        params: []
      };
      return a;
    };
    DataLoader = (function() {
      function DataLoader(scope, name, descriptor) {
        this.scope = scope;
        this.name = name;
        this.descriptor = descriptor;
        if (descriptor === void 0) {
          console.error("Descriptor is not defined");
        }
      }

      DataLoader.prototype.nextLoader = function(nextLoader) {
        return this.nextLoader = nextLoader;
      };

      DataLoader.prototype.call = function() {
        this.setCallFcn();
        this.setParams();
        this.scope.testValue = "Somevalue";
        return getCallFcn().func().then((function(data) {
          console.log(data);
          return this.scope.data = data;
        }).bind(this));

        /*
        switch @params.length
          when 0
            @callFcn().then(
              (data) ->
                console.log(@scope)
                @success(@scope, data)
                console.log(@scope)
              )
          when 1
            @callFcn(@params[0]).then(
              @success(data)
            )
          when 2
            @callFcn(@params[0],@params[1]).then(
              @success(data)
            )
         */
      };

      DataLoader.prototype.success = function(data) {
        this.scope[this.name] = data;
        this.descriptor.success(this.scope);
        if (this.nextLoader) {
          return this.nextLoader.call();
        } else {
          return this.scope.loading = false;
        }
      };

      DataLoader.$new = function(scope, name, descriptor) {
        return new this(scope, name, descriptor);
      };

      DataLoader.execute = function() {
        return console.log("execute");
      };

      DataLoader.prototype.setCallFcn = function() {
        var object;
        if (this.descriptor.call.type === "direct") {
          return this.callFcn = this.descriptor.call["function"];
        } else if (this.descriptor.call.type === "scopeField") {
          object = this.scope;
          this.descriptor.call.keys.forEach(function(key) {
            return object = object[key];
          });
          return this.callFcn = object;
        }
      };

      DataLoader.prototype.setParams = function() {
        var i, j, key, len, len1, object, param, ref, ref1, results;
        this.params = [];
        ref = this.descriptor.call.params.length;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          param = ref[i];
          if (param.type === "constant") {
            results.push(this.params.push(param.value));
          } else if (param.type === "scopeField") {
            object = this.scope;
            ref1 = param.keys;
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              key = ref1[j];
              object = object[key];
            }
            results.push(this.params.push(object));
          } else {
            results.push(void 0);
          }
        }
        return results;
      };

      return DataLoader;

    })();
    return DataLoader;
  }
]);

"use strict";
var app,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

app = angular.module('cloudStorm.descriptorService', []);

app.service('csDescriptorService', [
  '$q', '$http', 'ResourceService', 'csResource', function($q, $http, ResourceService, csResource) {
    this.descriptors = [];
    this.getDescriptors = function() {
      if (this.descriptors) {
        return this.descriptors;
      } else {
        return [];
      }
    };
    this.hasPendingPromises = function() {
      return this.descriptors.some(function(x) {
        return x.$$state.status === 0;
      });
    };
    this.getPromises = function() {
      return Promise.all(this.getDescriptors());
    };
    this.registerDescriptorUrl = function(descriptorUrl) {
      var descriptorPromise, request;
      if (!this.descriptors) {
        this.descriptors = [];
      }
      request = {
        method: 'GET',
        url: descriptorUrl,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      };
      descriptorPromise = $http(request).then((function(_this) {
        return function(response) {
          var typeIsArray;
          typeIsArray = Array.isArray || function(value) {
            return {}.toString.call(value) === '[object Array]';
          };
          if (typeIsArray(response.data)) {
            return response.data.forEach(function(descriptor) {
              return _this.registerDescriptor(descriptor);
            });
          } else {
            return _this.registerDescriptor(response.data);
          }
        };
      })(this))["catch"]((function(_this) {
        return function(response) {
          return console.log("CS-002: Error while receiving descriptor from '" + descriptorUrl + "'");
        };
      })(this));
      return this.descriptors.push(descriptorPromise);
    };
    this.registerDescriptor = function(data) {
      var Resource;
      Resource = (function(superClass) {
        extend(Resource, superClass);

        function Resource() {
          return Resource.__super__.constructor.apply(this, arguments);
        }

        Resource.endpoint = data.endpoint;

        Resource.base_url = data.base_url;

        Resource.descriptor = _.omit(data, ['endpoint', 'base_url']);

        Resource.loaded = false;

        Resource.data = null;

        return Resource;

      })(csResource);
      return ResourceService.register(Resource.descriptor.type, Resource);
    };
    return window.csDescriptors = this;
  }
]);

angular.module('cloudStorm.localizationProvider', []).provider('csLocalization', [
  function() {
    var Localization, defaultTranslations, translations;
    defaultTranslations = {
      'false': 'No',
      'true': 'Yes',
      'new': 'New',
      'today': 'Today',
      'create_another': 'Create another',
      'validation_text': 'Some required fields (marked *) are not yet set',
      'buttons.cancel': 'Cancel',
      'buttons.close': 'Close',
      'buttons.submit': 'Submit',
      'buttons.delete': 'Delete',
      'buttons.edit': 'Edit',
      'buttons.show': 'Show',
      'index.empty': ' list empty',
      'buttons.new': 'New',
      'buttons.clear': 'Clear',
      'alert.nothing_changed': 'Nothing changed',
      'alert.changes_saved': 'Changes saved',
      'alert.error_happened': 'An error happened',
      'alert.no_resource_created': 'Nothing created',
      'alert.new_resource_created': 'New resource successfully created',
      'alert.resource_not_found': 'There is no resource with the ID: ',
      'alert.no_linked_resource': 'There is no linked ',
      'alert.no_linked_resources': 'There are no linked ',
      'info.no_item': 'There is no item to show',
      'confirm.delete': "Are you sure you want to delete the item?",
      'filter_for_anything': 'Filter for anything',
      'checkbox.checked': '✓',
      'checkbox.unchecked': '✘'
    };
    translations = defaultTranslations;
    Localization = {
      add: function(string, translation) {
        return translations[string] = translation;
      },
      t: function(key) {
        return translations[key] || key;
      }
    };
    return {
      $get: function() {
        return Localization;
      }
    };
  }
]);

"use strict";
var app;

app = angular.module('cloudStorm.resourceService', []);

app.factory('ResourceService', [
  '$injector', function($injector) {
    var ResourceService, camelCase, lookup_table, resources;
    camelCase = (function() {
      var DEFAULT_REGEX, toUpper;
      DEFAULT_REGEX = /[-_]+(.)?/g;
      toUpper = function(match, group1) {
        if (group1) {
          return group1.toUpperCase();
        } else {
          return '';
        }
      };
      return function(str, delimiters) {
        return str.replace(DEFAULT_REGEX, toUpper);
      };
    })();
    resources = {};
    lookup_table = {};
    ResourceService = (function() {
      var register_dynamic_name;

      function ResourceService() {}

      ResourceService.prototype.getResources = function() {
        return resources;
      };

      ResourceService.prototype.register = function(name, resource) {
        return resources[name] = resource;
      };

      register_dynamic_name = function(name, service_name) {
        return lookup_table[name] = service_name;
      };

      ResourceService.prototype.get = function(name) {
        var e, error, moduleName, resource;
        resource = resources[name];
        if (!resource) {
          moduleName = lookup_table[name] || ((camelCase(name)) + "Resource");
          try {
            resource = $injector.get(moduleName);
          } catch (error) {
            e = error;
          }
          if (resource) {
            this.register(name, resource);
          } else {
            throw new Error(("CS-001: cannot auto-inject resource: '" + name + "'\n") + "Most likely causes for this error include:\n" + "\tOne of your resources reference another resource that you forgot to register.\n" + "\tYou manually set 'resourceType' to something that is not registered as a resource.");
          }
        }
        return resource;
      };

      return ResourceService;

    })();
    return new ResourceService;
  }
]);

"use strict";
var app;

app = angular.module('cloudStorm.resource', []);

app.factory('csResource', [
  'csRestApi', 'csDataStore', 'ResourceService', 'csSettings', '$q', function(csRestApi, csDataStore, ResourceService, csSettings, $q) {
    var Resource, baseUrl, memberEndpointUrl;
    memberEndpointUrl = function(resource, id) {
      return resource.endpoint + "/" + id;
    };
    baseUrl = function(resource) {
      return resource.base_url || csSettings['base_url'];
    };
    Resource = (function() {
      function Resource(value_object, opts) {
        if (opts == null) {
          opts = {};
        }
        if (opts.datastore) {
          this.$datastore = opts.datastore;
        } else if (opts.datastore_parent) {
          this.$datastore = new csDataStore(opts.datastore_parent);
        } else if (value_object && value_object.$datastore) {
          this.$datastore = new csDataStore(value_object.$datastore);
        } else {
          this.$datastore = new csDataStore({});
        }
        this.$assign(value_object);
        if (this.type && this.id) {
          this.$datastore.put(this.type, this.id, this);
        }
      }

      Resource.$new = function(opts) {
        var value_object;
        if (opts == null) {
          opts = {};
        }
        if (opts.value) {
          value_object = angular.copy(opts.value);
          value_object.relationships || (value_object.relationships = {});
          value_object.attributes || (value_object.attributes = {});
          value_object.type || (value_object.type = this.descriptor.type);
        } else {
          value_object = {
            relationships: {},
            attributes: {},
            type: this.descriptor.type
          };
        }
        return new this(value_object, opts);
      };

      Resource.$index = function(params, options) {
        var actual_endpoint, base_url, datastore, index_params, scoped_endpoint;
        if (options == null) {
          options = {};
        }
        index_params = angular.copy(params);
        actual_endpoint = options.endpoint || this.endpoint;
        base_url = baseUrl(this);
        if (base_url != null) {
          actual_endpoint = base_url + "/" + actual_endpoint;
        }
        if (options.scope) {
          scoped_endpoint = actual_endpoint + "/" + options.scope;
          actual_endpoint = scoped_endpoint;
        }
        if (options.query) {
          angular.merge(index_params, options.query);
        }
        datastore = {};
        if (options.datastore) {
          datastore = options.datastore;
        } else if (options.datastore_parent) {
          datastore = new csDataStore(options.datastore_parent);
        } else {
          datastore = new csDataStore({});
        }
        return csRestApi.index(actual_endpoint, index_params).then((function(_this) {
          return function(data) {
            var included, objects;
            objects = _.map(data.data, function(i) {
              var object, resource;
              object = datastore.get(i.type, i.id);
              if (object) {
                object.$assign(i);
                return object;
              } else {
                resource = ResourceService.get(i.type);
                return new resource(i, {
                  datastore: datastore
                });
              }
            });
            included = _.map(data.included, function(i) {
              var assoc, resource;
              assoc = datastore.get(i.type, i.id);
              if (assoc) {
                assoc.$merge(i);
                return assoc;
              } else {
                resource = ResourceService.get(i.type);
                return new resource(i, {
                  datastore: datastore
                });
              }
            });
            objects.meta = data.meta;
            return objects;
          };
        })(this), function(reason) {
          return $q.reject(reason);
        }, function(value) {});
      };

      Resource.$search = function(query, options) {
        var search_params;
        if (options == null) {
          options = {};
        }
        if (typeof query === "object") {
          return this.$index({
            q: {
              query: query
            }
          }, options);
        } else {
          search_params = {};
          search_params[this.descriptor.display.search] = query;
          return this.$index({
            q: search_params
          }, options);
        }
      };

      Resource.$get = function(id, params) {
        var actual_endpoint, base_url;
        actual_endpoint = memberEndpointUrl(this, id);
        base_url = baseUrl(this);
        if (base_url != null) {
          actual_endpoint = base_url + "/" + actual_endpoint;
        }
        return csRestApi.get(actual_endpoint, params).then((function(_this) {
          return function(data) {
            var included, object;
            object = new _this(data.data);
            included = _.map(data.included, function(i) {
              var resource;
              resource = ResourceService.get(i.type);
              return new resource(i, {
                datastore: object.$datastore
              });
            });
            return object;
          };
        })(this), function(reason) {
          return $q.reject(reason);
        }, function(value) {});
      };

      Resource.prototype.$reload = function(params) {
        var endpoint;
        endpoint = this.links.self.href || memberEndpointUrl(this.constructor, this.id);
        return csRestApi.get(endpoint, params).then((function(_this) {
          return function(data) {
            var included, object;
            object = _this.$assign(data.data);
            included = _.map(data.included, function(i) {
              var assoc, resource;
              assoc = object.$datastore.get(i.type, i.id);
              if (assoc) {
                assoc.$assign(i);
                return assoc;
              } else {
                resource = ResourceService.get(i.type);
                return new resource(i, {
                  datastore: object.$datastore
                });
              }
            });
            return object;
          };
        })(this), function(reason) {
          return $q.reject(reason);
        }, function(value) {});
      };

      Resource.prototype.$create = function(params, options) {
        var base_url, data, endpoint, entity, ref, rel;
        if (params == null) {
          params = {};
        }
        if (options == null) {
          options = {};
        }
        if (this.id) {
          throw new Error("The id of the object is provided, but PUT is not yet supported." + " (Did you mean to use $save?)");
        }
        endpoint = options.endpoint || this.constructor.endpoint;
        base_url = baseUrl(this.constructor);
        if (base_url != null) {
          endpoint = base_url + "/" + endpoint;
        }
        if (options.scope) {
          endpoint = endpoint + "/" + options.scope;
        }
        entity = _.pick(this, "type", "attributes", "relationships");
        ref = entity.relationships;
        for (rel in ref) {
          data = ref[rel];
          if (angular.isArray(data)) {
            delete entity.relationships[rel];
            entity.relationships[rel] = {
              data: _.map(data, function(o) {
                return o.data;
              })
            };
          }
        }
        return csRestApi.create(endpoint, entity).then((function(_this) {
          return function(data) {
            var included, object;
            object = _this.$assign(data.data);
            included = _.map(data.included, function(i) {
              var assoc, resource;
              assoc = object.$datastore.get(i.type, i.id);
              if (assoc) {
                assoc.$assign(i);
                return assoc;
              } else {
                resource = ResourceService.get(i.type);
                return new resource(i, {
                  datastore: object.$datastore
                });
              }
            });
            return object;
          };
        })(this), function(reason) {
          return $q.reject(reason);
        }, function(value) {});
      };

      Resource.prototype.$save = function(params, options) {
        var base_url, endpoint, entity;
        if (params == null) {
          params = {};
        }
        if (options == null) {
          options = {};
        }
        if (!this.id) {
          throw new Error("Object is not yet persisted into the DB, use $create. " + "(Did you forget to provide its id?)");
        }
        endpoint = options.endpoint || memberEndpointUrl(this.constructor, this.id) || this.links.self.href;
        base_url = baseUrl(this.constructor);
        if (base_url != null) {
          endpoint = base_url + "/" + endpoint;
        }
        if (options.scope) {
          endpoint = endpoint + "/" + options.scope;
        }
        entity = _.pick(this, "id", "type", "attributes", "relationships");
        return csRestApi.update(endpoint, entity, params).then((function(_this) {
          return function(data) {
            var included, object;
            object = _this.$assign(data.data);
            included = _.map(data.included, function(i) {
              var assoc, resource;
              assoc = object.$datastore.get(i.type, i.id);
              if (assoc) {
                assoc.$assign(i);
                return assoc;
              } else {
                resource = ResourceService.get(i.type);
                return new resource(i, {
                  datastore: object.$datastore
                });
              }
            });
            return object;
          };
        })(this), function(reason) {
          return $q.reject(reason);
        }, function(value) {});
      };

      Resource.prototype.$destroy = function(options) {
        var base_url, endpoint;
        if (options == null) {
          options = {};
        }
        endpoint = options.endpoint || memberEndpointUrl(this.constructor, this.id) || this.links.self.href;
        base_url = baseUrl(this.constructor);
        if (base_url) {
          endpoint = base_url + "/" + endpoint;
        }
        return csRestApi.destroy(endpoint).then((function(_this) {
          return function(data) {
            return _this.$assign(data.data);
          };
        })(this), function(reason) {
          return $q.reject(reason);
        }, function(value) {});
      };

      Resource.prototype.$assign = function(value_object) {
        var assoc, item, j, len, name, ref, ref1, rel;
        delete this.relationships;
        delete this.meta;
        angular.merge(this, _.pick(value_object, "id", "type", "attributes", "relationships", "links", "meta"));
        if (value_object.$datastore) {
          ref = this.relationships;
          for (name in ref) {
            rel = ref[name];
            if (angular.isArray(rel.data)) {
              ref1 = rel.data;
              for (j = 0, len = ref1.length; j < len; j++) {
                item = ref1[j];
                assoc = value_object.$relationship(item);
                if (assoc) {
                  this.$datastore.put(item.type, item.id, assoc);
                }
              }
            } else {
              assoc = value_object.$relationship(rel.data);
              if (assoc) {
                this.$datastore.put(rel.data.type, rel.data.id, assoc);
              }
            }
          }
        }
        return this;
      };

      Resource.prototype.$merge = function(value_object) {
        var assoc, item, j, len, name, ref, ref1, rel;
        console.log('merge -------');
        delete this.meta;
        angular.merge(this, _.pick(value_object, "id", "type", "attributes", "relationships", "links", "meta"));
        if (value_object.$datastore) {
          ref = this.relationships;
          for (name in ref) {
            rel = ref[name];
            if (angular.isArray(rel.data)) {
              ref1 = rel.data;
              for (j = 0, len = ref1.length; j < len; j++) {
                item = ref1[j];
                assoc = value_object.$relationship(item);
                if (assoc) {
                  this.$datastore.put(item.type, item.id, assoc);
                }
              }
            } else {
              assoc = value_object.$relationship(rel.data);
              if (assoc) {
                this.$datastore.put(rel.data.type, rel.data.id, assoc);
              }
            }
          }
        }
        return this;
      };

      Resource.prototype.$clone = function(value_object) {
        delete this.id;
        delete this.type;
        delete this.attributes;
        delete this.relationships;
        delete this.links;
        delete this.meta;
        angular.merge(this, _.pick(value_object, "id", "type", "attributes", "relationships", "links", "meta"));
        return this.$datastore = new csDataStore(value_object.$datastore);
      };

      Resource.prototype.$relationship = function(rel, opts) {
        if (opts == null) {
          opts = {};
        }
        if (!rel) {
          return null;
        }
        if (opts.datastore) {
          return opts.datastore.get(rel.type, rel.id);
        } else {
          return this.$datastore.get(rel.type, rel.id);
        }
      };

      Resource.prototype.$relationships = function(rel, opts) {
        var actual_datastore;
        if (opts == null) {
          opts = {};
        }
        if (!rel) {
          return null;
        }
        actual_datastore = opts.datastore || this.$datastore;
        return _.map(rel, function(item) {
          return actual_datastore.get(item.type, item.id);
        });
      };

      Resource.prototype.$association = function(field, opts) {
        var rel;
        if (opts == null) {
          opts = {};
        }
        rel = this.relationships && this.relationships[field.relationship];
        if (rel) {
          if (angular.isArray(rel.data)) {
            return _.map(rel.data, (function(_this) {
              return function(item) {
                return _this.$relationship(item, opts);
              };
            })(this));
          } else {
            return this.$relationship(rel.data, opts);
          }
        }
      };

      Resource.prototype.$association_by_name = function(relationship, opts) {
        var rel;
        if (opts == null) {
          opts = {};
        }
        rel = this.relationships && this.relationships[relationship];
        if (rel) {
          if (angular.isArray(rel.data)) {
            return _.map(rel.data, (function(_this) {
              return function(item) {
                return _this.$relationship(item, opts);
              };
            })(this));
          } else {
            return this.$relationship(rel.data, opts);
          }
        }
      };

      Resource.prototype.$assign_association = function(field, value, opts) {
        var filteredValue;
        if (opts == null) {
          opts = {};
        }
        this.relationships || (this.relationships = {});
        if (value) {
          if (angular.isArray(value)) {
            filteredValue = _.reject(value, (function(v) {
              return !v || !v.id;
            }));
            this.relationships[field.relationship] = {
              data: _.map(filteredValue, (function(o) {
                return _.pick(o, "id", "type");
              }))
            };
            return _.each(filteredValue, (function(_this) {
              return function(o) {
                return _this.$datastore.put(o.type, o.id, o);
              };
            })(this));
          } else {
            this.relationships[field.relationship] = {
              data: _.pick(value, "id", "type")
            };
            return this.$datastore.put(value.type, value.id, value);
          }
        } else {
          if (field.cardinality === 'one') {
            return this.relationships[field.relationship] = {
              data: null
            };
          } else {
            return this.relationships[field.relationship] = {
              data: []
            };
          }
        }
      };

      Resource.prototype.$assign_association_by_name = function(relationship, value, opts) {
        var field;
        if (opts == null) {
          opts = {};
        }
        if (value) {
          if (angular.isArray(value)) {
            this.relationships[relationship] = {
              data: _.map(value, (function(o) {
                return _.pick(o, "id", "type");
              }))
            };
            return _.each(value, (function(_this) {
              return function(o) {
                return _this.$datastore.put(o.type, o.id, o);
              };
            })(this));
          } else {
            this.relationships[relationship] = {
              data: _.pick(value, "id", "type")
            };
            return this.$datastore.put(value.type, value.id, value);
          }
        } else {
          field = _.find(this.constructor.descriptor.fields, {
            relationship: relationship
          });
          if (field.cardinality === 'one') {
            return this.relationships[field.relationship] = {
              data: null
            };
          } else {
            return this.relationships[field.relationship] = {
              data: []
            };
          }
        }
      };

      Resource.prototype.$display_name = function() {
        var instance_name;
        instance_name = this.constructor.descriptor.display && this.constructor.descriptor.display.name ? this.attributes[this.constructor.descriptor.display.name] : this.attributes['name'];
        return instance_name || this.constructor.descriptor.name;
      };

      return Resource;

    })();
    return Resource;
  }
]);

"use strict";
angular.module('cloudStorm.restApi', []).factory('csRestApi', [
  '$q', '$http', function($q, $http) {
    var create, destroy, get, index, transform_params, update;
    transform_params = function(params) {
      angular.forEach(params, function(value, key) {
        var params_object;
        if (value === null || angular.isUndefined(value)) {
          return;
        }
        if (angular.isObject(value)) {
          params_object = {};
          params_object[key] = value;
          delete params[key];
          return angular.extend(params, $.param(params_object));
        }
      });
      return params;
    };
    index = function(endpoint, query) {
      var deferred, request;
      deferred = $q.defer();
      request = {
        method: 'GET',
        url: endpoint,
        headers: {
          'Content-Type': 'application/vnd.api+json',
          'Accept': 'application/vnd.api+json'
        },
        params: query,
        paramSerializer: '$httpParamSerializerJQLike'
      };
      $http(request).then((function(_this) {
        return function(response) {
          return deferred.resolve(response.data);
        };
      })(this))["catch"]((function(_this) {
        return function(response) {
          return deferred.reject(response.data);
        };
      })(this));
      return deferred.promise;
    };
    get = function(endpoint, query) {
      var deferred, request;
      deferred = $q.defer();
      request = {
        method: 'GET',
        url: endpoint,
        headers: {
          'Content-Type': 'application/vnd.api+json',
          'Accept': 'application/vnd.api+json'
        },
        params: query,
        paramSerializer: '$httpParamSerializerJQLike'
      };
      $http(request).then((function(_this) {
        return function(response) {
          return deferred.resolve(response.data);
        };
      })(this))["catch"]((function(_this) {
        return function(response) {
          return deferred.reject(response.data);
        };
      })(this));
      return deferred.promise;
    };
    update = function(endpoint, object, query) {
      var deferred, request;
      deferred = $q.defer();
      request = {
        method: 'PATCH',
        url: endpoint,
        headers: {
          'Content-Type': 'application/vnd.api+json',
          'Accept': 'application/vnd.api+json'
        },
        data: object,
        params: query
      };
      $http(request).then((function(_this) {
        return function(response) {
          return deferred.resolve(response.data);
        };
      })(this))["catch"]((function(_this) {
        return function(response) {
          return deferred.reject({
            data: response.data,
            status: response.status
          });
        };
      })(this));
      return deferred.promise;
    };
    create = function(endpoint, object) {
      var deferred, request;
      deferred = $q.defer();
      request = {
        method: 'POST',
        url: endpoint,
        headers: {
          'Content-Type': 'application/vnd.api+json',
          'Accept': 'application/vnd.api+json'
        },
        data: object
      };
      $http(request).then((function(_this) {
        return function(response) {
          return deferred.resolve(response.data);
        };
      })(this))["catch"]((function(_this) {
        return function(response) {
          return deferred.reject({
            data: response.data,
            status: response.status
          });
        };
      })(this));
      return deferred.promise;
    };
    destroy = function(endpoint) {
      var deferred, request;
      deferred = $q.defer();
      request = {
        method: 'DELETE',
        url: endpoint,
        headers: {
          'Content-Type': 'application/vnd.api+json',
          'Accept': 'application/vnd.api+json'
        }
      };
      $http(request).then((function(_this) {
        return function(response) {
          return deferred.resolve(response.data);
        };
      })(this))["catch"]((function(_this) {
        return function(response) {
          return deferred.reject({
            data: response.data,
            status: response.status
          });
        };
      })(this));
      return deferred.promise;
    };
    return {
      index: index,
      get: get,
      update: update,
      create: create,
      destroy: destroy
    };
  }
]);

"use strict";
var app;

app = angular.module("cloudStorm.settings", []);

app.provider('csSettings', [
  'csLocalizationProvider', function(csLocalizationProvider) {
    var defaultSettings, states;
    states = (function(_this) {
      return function() {
        return [
          {
            name: _this.settings['router-path-prefix'] + 'index',
            url: '/{resourceType}',
            component: 'csPageRouter',
            resolve: {
              resourceType: [
                '$transition$', function($transition$) {
                  return $transition$.params().resourceType;
                }
              ],
              pageType: [
                '$transition$', function($transition$) {
                  return 'index';
                }
              ]
            }
          }, {
            name: _this.settings['router-path-prefix'] + 'show',
            url: '/{resourceType}/{id}',
            component: 'csPageRouter',
            resolve: {
              resourceType: [
                '$transition$', function($transition$) {
                  return $transition$.params().resourceType;
                }
              ],
              id: [
                '$transition$', function($transition$) {
                  return $transition$.params().id;
                }
              ],
              pageType: [
                '$transition$', function($transition$) {
                  return 'show';
                }
              ]
            }
          }, {
            name: _this.settings['router-path-prefix'] + 'cmd',
            url: '/{resourceType}/{id}/{cmd}',
            component: 'csPageRouter',
            resolve: {
              resourceType: [
                '$transition$', function($transition$) {
                  return $transition$.params().resourceType;
                }
              ],
              id: [
                '$transition$', function($transition$) {
                  return $transition$.params().id;
                }
              ],
              cmd: [
                '$transition$', function($transition$) {
                  return $transition$.params().cmd;
                }
              ],
              pageType: [
                '$transition$', function($transition$) {
                  return 'cmd';
                }
              ]
            }
          }
        ];
      };
    })(this);
    defaultSettings = {
      'i18n-engine': csLocalizationProvider.$get(),
      'date-format': 'yyyy-MM-dd',
      'datetime-format': 'yyyy-MM-ddThh:mm:ss.sss',
      'time-zone-offset': 'utc',
      'router-path-prefix': '',
      'router-states': states,
      'app-title': 'CloudStorm Sample App'
    };
    this.settings = defaultSettings;
    this.set = function(option, value) {
      this.settings[option] = value;
    };
    this.$get = function() {
      return this;
    };
  }
]);

"use strict";
var app;

app = angular.module("cloudStorm.templateService", []);

app.factory('csTemplateService', [
  function() {
    var csTemplateService;
    csTemplateService = (function() {
      function csTemplateService() {}

      csTemplateService.prototype.getTemplateUrl = function(field, options, defaultTemplate) {
        var overrides, template;
        template = defaultTemplate;
        if ((overrides = options['template-overrides'])) {
          _(overrides).forEach(function(override) {
            if ((override.type === field.type) && override.template) {
              return template = override.template;
            }
          });
          _(overrides).forEach(function(override) {
            if ((override.attribute === field.attribute) && override.template) {
              return template = override.template;
            }
          });
        }
        return template;
      };

      return csTemplateService;

    })();
    return new csTemplateService;
  }
]);

var app;
app = angular.module('cloudStorm.loader', []);
app.component("csLoader", {
    bindings: {
        color: '<',
        radius: '<',
    },
    templateUrl: 'cs-utils/cs-loader/cs-loader-template.html',
    controller: ['csInputBase', function (csInputBase) {
            csInputBase(this);
        }]
});
var app;

app = angular.module('cloudStorm', ['cloudStorm.alertService', 'cloudStorm.alert', 'cloudStorm.field', 'cloudStorm.form', 'cloudStorm.wizard', 'cloudStorm.itemListContainer', 'cloudStorm.checkbox', 'cloudStorm.menu', 'cloudStorm.date', 'cloudStorm.time', 'cloudStorm.datetime', 'cloudStorm.code', 'cloudStorm.fullCode', 'cloudStorm.enum', 'cloudStorm.field', 'cloudStorm.filterRow', 'cloudStorm.form', 'cloudStorm.index', 'cloudStorm.index.sidePanel', 'cloudStorm.itemList', 'cloudStorm.main', 'cloudStorm.menu', 'cloudStorm.number', 'cloudStorm.resourceInput', 'cloudStorm.textfield', 'cloudStorm.tableHeader', 'cloudStorm.tableRow', 'cloudStorm.tableContainer', 'cloudStorm.inputBase', 'cloudStorm.dataStore', 'cloudStorm.localizationProvider', 'cloudStorm.resource', 'cloudStorm.resourceService', 'cloudStorm.restApi', 'cloudStorm.resourceFilter', 'cloudStorm.settings', 'cloudStorm.templateService', 'cloudStorm.templates', 'cloudStorm.descriptorService', 'ui.router', 'cloudStorm.routeProvider', 'ui.bootstrap', 'cloudStorm.loader', 'cloudStorm.error', 'cloudStorm.uiPageRouter']);

'use strict'

var app = angular.module('cloudStorm.itemListContainer', [])

app.component('csItemListContainer', {

  bindings : {
    field : "<",
    itemList : "<",
    key : "<",
    many : "<",
    uiConfig : "<",
    cMode : "<",
    modalMode : "<",
    modalInstance : "<",
  },
  templateUrl : "components/containers/cs-item-list-container/cs-item-list-container-template.html",
  controller : function(csSettings) {
    this.$onInit = function() {
      this.i18n = csSettings.settings['i18n-engine'];

      this.UI = {};
      this.UI.fieldName = this.field.attribute;

      this.close = function() {
        this.modalInstance.close();
      };
    };
  }
});

"use strict"

app = angular.module('cloudStorm.alertService', [])

// ===== SERVICE ===============================================================

app.service('csAlertService', ['csSettings', function(csSettings){

  this.i18n = csSettings.settings['i18n-engine'];

  this.sequence = 0;

  this.alerts = [];

  this.getAlerts = function() {
    if (this.alerts) {
      return this.alerts;
    } else {
      return [];
    }
  };

  this.timeoutForAlert = function(alert) {
    switch (alert.type) {
      case 'success':
        return 3500;
      case 'info':
        return 3500;
      case 'warning':
        return 3500;
      case 'danger':
        return 3500;
    }
  };

  this.addAlert = function(message, type) {
    if (type == null) {
      type = 'warning';
    }
    if (!this.alerts) {
      this.alerts = [];
    }
    this.alerts.push({
      id: this.sequence,
      message: message,
      type: type
    });
    return this.sequence++;
  };

  this.success = function(msgType, customMessage) {
    return this.addAlert(customMessage || this.getText(msgType, customMessage), 'success');
  };

  this.info = function(msgType, customMessage) {
    return this.addAlert(customMessage || this.getText(msgType, customMessage), 'info');
  };

  this.warning = function(msgType, customMessage) {
    return this.addAlert(customMessage || this.getText(msgType, customMessage), 'warning');
  };

  this.danger = function(msgType, customMessage) {
    return this.addAlert(customMessage || this.getText(msgType), 'danger');
  };

  this.getText = function(type, customMessage) {
    return this.i18n.t('alert.' + type) || '\*translation missing';
  };

  this.dismissAlert = function(idToDismiss) {
    return this.alerts = _.without(this.alerts, _.find(this.alerts, {
      id: idToDismiss
    }));
  };

  window.csAlerts = this;

}])

'use strict'

var app = angular.module('cloudStorm.fullCode', [])

app.component('csFullCode', {

  bindings : {
    title : "<",
    content : "<",
    modalInstance : "<",
  },
  templateUrl : "components/cs-fields/cs-code/cs-full-code/cs-full-code-template.html",
  controller : [ 'csSettings', function(csSettings) {
    this.$onInit = function() {
      this.i18n = csSettings.settings['i18n-engine'];

      this.UI = {};
      this.UI.title = this.title;
      this.UI.content = this.content

      this.close = function() {
        this.modalInstance.close();
      };
    };
  }]
});

'use string'

var app = angular.module('cloudStorm.filterRow', [])

app.component('csFilterRow', {

  bindings : {
    resource : "<",
    filterValue : "<",
    filter : "&",
    openNewResourcePanel : "&",
    refreshIndex : "&",
  },

  templateUrl : "components/cs-filter-row/cs-filter-row-template.html",

  controller : [ '$element','csSettings', 'csDescriptorService', function($element, csSettings, csDescriptorService) {

    var vm = this;

    this.$onInit = function() {
      csDescriptorService.getPromises().then( function() {
        $element.addClass('cs-filter-row');
        vm.filterVal = "";
        if (vm.resource) {
          vm.header  = vm.resource.descriptor.name;
          vm.subHeader  = vm.resource.descriptor.hint;
          vm.createDisabled = vm.resource.descriptor.create_disabled;
        }
      });
    };

    this.i18n = csSettings.settings['i18n-engine'];

    this.changeInFilter = function() {
      this.filter({ filterValue : this.filterValue })
    };

    this.openNewResourcePanel_ = function() {
      this.openNewResourcePanel();
    };

    this.refreshIndex_ = function() {
      this.refreshIndex();
    };

    this.$onChanges = function (changesObj) {
      if (vm.resource) {
        vm.header  = vm.resource.descriptor.name;
        vm.subHeader  = vm.resource.descriptor.hint;
        vm.createDisabled = vm.resource.descriptor.create_disabled;
      }
    };
  }]
});

'use strict'

var app = angular.module('cloudStorm.index', [])

app.component('csIndex', {

  bindings : {
    csIndexOptions: '=',
    resourceType: '=',
    itemId : '=',
    items : "<",
    resource : "<",
  },

  templateUrl : 'components/cs-index/cs-index-template.html',
  controller : ['$scope','ResourceService','csSettings','$uibModal','csAlertService','csDescriptorService','csRoute', function($scope, ResourceService, csSettings, $uibModal, csAlertService, csDescriptorService, csRoute){
    var vm = this;

    // this.$onChanges = function(changesObj) {
    //   console.log('cs-index.onChanges', changesObj);
    // }

    this.$onInit = function() {
      this.csIndexOptions || (this.csIndexOptions = {});

      csDescriptorService.getPromises().then( function() {
        // Load resource and items when not bound (index-only mode)
        if (!vm.resource) {
          vm.resource = ResourceService.get(vm.resourceType);
        }
        if (!vm.items) {
          vm.resource.$index({ include: '*'}).then(function(data) { vm.items = data; });
        }
        vm.collection = vm.items;

        vm.filterValue = ""
        vm.i18n = csSettings.settings['i18n-engine'];

        vm.loadData = function() {
          csDescriptorService.getPromises().then(
            (function() {
              return vm.resource.$index({ include: '*'})
            }).bind(vm)).then( (function(items) {
                return vm.items = items
              }).bind(vm), (function(reason) {
                return vm.items = null
              }).bind(vm)
            )
        };
        vm.loadData();

        vm.header = vm.resource.descriptor.name
        var defaultOptions, indexOptions, sortField;
        sortField = void 0;
        defaultOptions = {
          'selectedItem': null,
          'sortAttribute': vm.resource.descriptor.fields[0].attribute,
          'filterValue': "",
          'sortReverse': false,
          'condensedView': false,
          'hide-actions': false,
          'hide-attributes': vm.resource.descriptor.attributes_to_hide || {}
        };

        vm.csIndexOptions || (vm.csIndexOptions = {});
        indexOptions = angular.copy(vm.csIndexOptions);
        angular.copy({}, vm.csIndexOptions);
        angular.merge(vm.csIndexOptions, defaultOptions, indexOptions);
        vm.columns = vm.resource.descriptor.fields;

      })
    }

   this.pushNewItem = function(item) {
      var newItem;
      newItem = item.constructor.$new();
      newItem.$clone(item);
      this.items.push(newItem);
      // force angular rebind
      this.items = this.items.slice();
    };

    this.listIsEmpty = function() {
      return !this.items || this.items.length == 0;
    };

    this.columnVisible = function(column, index) {
      var length;
      length = this.columns.length;
      if (this.attributeToHide(column.attribute)) {
        return false;
      }
      if (this.viewIsCompressed() && !_.contains([0, 1, 2], index)) {
        return false;
      }
      return true;
    };

    this.attributeToHide = function(attribute) {
      var hiddenAttrs;
      if (hiddenAttrs = this.csIndexOptions['hide-attributes'].index) {
        return hiddenAttrs.indexOf(attribute) > -1;
      }
      return false;
    };

    this.filter = function(filterValue) {
      $scope.$broadcast('filterValue', {filterValue : filterValue})
    };

    this.sidePanelIsVisible = function() {
      if (this.csIndexOptions.selectedItem) {
        return true;
      }
      return false;
    };

    this.viewIsCompressed = function() {
      return this.sidePanelIsVisible() && this.csIndexOptions.condensedView;
    };

    this.selectItem = function(item) {
      return this.csIndexOptions.selectedItem = item;
    };

    this.destroyItem = function($event, item) {
      $event.stopPropagation();
      if (confirm( item.$display_name() + '\n\n' + this.i18n.t('confirm.delete'))) {
        return item.$destroy().then((function(result) {
          this.csIndexOptions.selectedItem = null;
          var index = this.items.indexOf(result);
          if (index == -1) {
            console.log('Warning: Destroyed item not found in collection, retry search with type and id check.');
            index = this.items.findIndex(function(i) { return (i.id === result.id && i.type === result.type); } );
            console.log('Index:', index);
          }
          this.items.splice(index, 1);
          // force angular rebind
          this.items = this.items.slice();
          return this.items;
        }).bind(this), (function(reason) {
          var alert = null
          if(reason && reason.data && reason.data.errors && reason.data.errors[0])
            alert = reason.data.errors[0].detail
          return csAlertService.danger("error_happened", alert)
        }).bind(this));
      }
    };

    this.showItem = function(item) {
      if (this.csIndexOptions.selectedItem === null) {
        return csRoute.go("show", {
          resourceType: this.resourceType,
          id: item.attributes.id
        });
      } else {
        return this.selectItem(item);
      }
    };

    this.unselectItem = function() {
      return this.csIndexOptions.selectedItem = null;
    };

    // ===== WIZARD CALLBACKS ============================

    this.getPanelNumber = function(length) {
      if (length > 1) {
        return this.csIndexOptions.condensedView = true;
      } else {
        return this.csIndexOptions.condensedView = false;
      }
    };

    this.refreshIndex = function() {
      this.unselectItem();
      this.loadData();
    };

    this.openNewResourcePanel = function() {
      var modalInstance;
      this.unselectItem();
      this.wizardOptions = {
        "resource-type": this.resourceType,
        "form-item": {},
        "form-mode": "create",
        "reset-on-submit": true,
        "events": {
          'wizard-canceled': (function(resource) {
            modalInstance.close();
            return csAlertService.info('no_resource_created')
          }).bind(this),
          'wizard-submited': (function(resource) {
            this.pushNewItem(resource);
            if (!this.wizardOptions['keep-first']) {
              modalInstance.close();
            }
            return csAlertService.success('new_resource_created')
          }).bind(this)
        }
      };
      angular.merge(this.wizardOptions, this.csIndexOptions);

      var scp = $scope
      modalInstance = $uibModal.open({
        scope: $scope,
        keyboard: false,
        backdrop: 'static',
        windowTopClass: 'modal-wizard',
        template: "<div cs-wizard cs-wizard-options=$ctrl.wizardOptions></div>",
        resolve: {
          dummy: function() {
            return $scope.dummy;
          }
        }
      });
      return modalInstance.result.then((function(selectedItem) {
        return this.selected = selectedItem;
      }).bind(this), (function() {
        return console.info('Modal dismissed at: ' + new Date());
      }).bind(this));
    };

  }]
})

'use strict'

var app = angular.module('cloudStorm.itemListItem', [])

app.component('csItemListItem', {
  bindings : {
    text : "",
    process : "&"
  },
  templateUrl : 'components/cs-item-list/cs-item-list-item/cs-item-list-item.html',
  controller : function() {
    this.$onInit = function() {
      angular.extend(this, this.process({ text : this.text }));
    }
  }
})

var app = angular.module("cloudStorm.itemList", [])

app.component("csItemList", {

  bindings : {
    field : "<",
    itemList : "<",
    key : "<",
    many : "<",
    uiConfig : "<",
    cMode : "<",
    modalMode : "<",
  },

  templateUrl : "components/cs-item-list/cs-item-list-template.html",
  controller : [ '$scope','$element','$uibModal','csRoute','csSettings','csInputBase', function($scope, $element, $uibModal, csRoute, csSettings, csInputBase) {


    this.$onChanges = function(changesObj) {
      this.init();
    }

    this.init = function() {
      this.i18n = csSettings.settings['i18n-engine'];
      $element.addClass('cs-item-list');

      csInputBase(this);

      this.cMode = this.cMode || this.formMode;
      this.modalMode = this.modalMode || false;

      this.CL = {};

      switch(this.cMode) {
        case "show":
          this.CL.itemContainer = "show-mode";
          this.CL.item = "item-show";
          if (!this.many) {
            this.CL.itemContainer += " singe-item-container";
          }
          break;
        case "tableView":
          this.CL.itemContainer = "row-mode";
          this.CL.item = "item-table";
          break;
        case "modal":
          this.CL.itemContainer = "column-mode";
          this.CL.item = "item-table";
          break;
      }

      //Text on UI for the UI
      this.UI = {};
      this.UI.fieldName = this.field ? this.field.label : "";
      if (this.many) {
        this.UI.noItem = this.i18n.t('alert.no_linked_resources') + " " + this.UI.fieldName;
      } else {
        this.UI.noItem = this.i18n.t('alert.no_linked_resource') + " " + this.UI.fieldName;
      }
      this.UI.clickText = "...";

      //Display conditions
      this.condition = {};
      this.condition.noItem = !this.itemList || (this.itemList.length == 0 && this.cMode != 'tableView');
      this.condition.tableMode = this.cMode == 'tableView';

      // console.log(this.itemList);
      // console.log('noItem',this.condition.noItem);
    }

    this.$onInit = function() {
      this.init();
    };

    this.showItems = function() {
      var modalTemplate = "" +
        "<cs-item-list-container  " +
          "modal-instance=\"$ctrl.modalInstance\", " +
          "item=\"$ctrl.item\", " +
          "item-list=\"$ctrl.itemList\", " +
          "field=\"$ctrl.field\", " +
          "many=\"$ctrl.many\", " +
          "c-mode=\"'modal'\", " +
          "key=\"$ctrl.key\">  " +
        " </cs-item-list-container>";

      this.modalInstance = $uibModal.open( {
        scope: $scope,
        keyboard: true,
        backdrop: 'static',
        //windowTopClass: 'modal-wizard',
        template: modalTemplate,
        resolve: {
          dummy: function() {
            return $scope.dummy;
          }
        }
      });
      // Ignore 'Possibly unhandled rejection: escape key press' error
      this.modalInstance.result.finally(angular.noop).then(angular.noop, angular.noop);
    };

    this.hidden = function(num) {
      // console.log(this.hiddenFrom  + "   " + num)
      return this.hiddenFrom <= num;
    };

    this.selectSingle = function() {
        this.select(this.itemList);
    };

    this.select = function(item) {
      csRoute.go("show", { resourceType : item.type, id : item.attributes.id } );
    };

    this.process = function(text) {
      this.cnt++;
      var textLength = this.textLength(text)
      if(this.remainingSpace <= textLength){
        if(this.cnt == 1) {
          return {
            text : this.getShortenedText(text),
            state : 'shortened',
          }
        } else {
          return {
            text : text,
            state : 'hidden',
          }
        }
      } else {
        return {
          text : text,
          state : 'normal',
        }
      }
    };

    this.getLength = function(text) {
      //This is just an approximation
      return this.margin + 2 * this.paddding + text.length * 3;
    };

    this.getShortenedText = function(text) {
      var diff = text.length - this.remainingSpace.length;
      return text.substring(0, text.length - (diff + 2));
    };
  }]
})

"use strict"

var app = angular.module('cloudStorm.main', [])

app.component('csMain', {

  templateUrl : 'components/cs-main/cs-main-template.html',

})

"use strict"

var app = angular.module('cloudStorm.tableContainer', [])

app.component('csTableContainer', {

  templateUrl : 'components/cs-table/cs-table-container/cs-table-container-template.html',

  controller : ['$scope','csSettings','$element','csResourceFilter', function($scope, csSettings, $element, csResourceFilter) {

    this.$onInit = function() {
      this.initialCollection = this.collection
      $element.addClass('cs-table-container')
      this.sortAndFilter();
    };

    this.filterValue = "";
    this.sortDirection = "";
    this.sortColumn = null;
    this.i18n = csSettings.settings['i18n-engine'];

    this.$onChanges = function(changesObj) {
      if (changesObj.collection && changesObj.collection.currentValue && changesObj.collection.previousValue != changesObj.collection.currentValue) {
        this.initialCollection = this.collection
        this.sortAndFilter();
      }
    }

    $scope.$on('filterValue', (function(event, args) {
      this.filter(args.filterValue)
    }).bind(this))

    this.sortAndFilter = function() {
      this.name = this.sortColumn ? this.sortColumn.attribute : '';
      this.csIndexOptions.sortAttribute = this.name
      var sortFieldComp = _.find(this.resource.descriptor.fields, {
        attribute: this.csIndexOptions.sortAttribute
      });

      if (this.filterValue == "" || this.filterValue == undefined) {
        this.collection = this.initialCollection;
      } else {
        this.collection = csResourceFilter.filter(this.initialCollection, this.columns, this.filterValue);
      }
      if (sortFieldComp) {
        this.collection = csResourceFilter.sort(this.collection, sortFieldComp)
        if(this.sortDirection == "desc") {
            this.collection = this.collection.slice().reverse()
        }
      }
    }

    this.showItem = function(item) {
      this.showItem_( { item : item } );
    }

    this.selectItem = function(item) {
      this.selectItem_( { item : item } );
    }

    this.destroyItem = function(event, item) {
      this.destroyItem_( { event : event, item : item } );
    }

    this.columnVisible = function(column, index) {
      return this.columnVisible_( { column : column, index : index } );
    }

    this.sort = function(column, direction) {
      this.sortDirection = direction;
      this.sortColumn = column;
      this.sortAndFilter();
    }

    this.filter = function(filterValue) {
      this.filterValue = filterValue;
      this.sortAndFilter();
    }

    this.clickRow = function(item) {
      //It works only in edit mode
      if (this.csIndexOptions.selectedItem != null) {
        this.selectItem(item)
      }
    }

  } ],
  bindings : {
    resource : "<",
    collection : "<",
    csIndexOptions : "=",
    columns : "<",
    columnVisible_ : "&",
    showItem_ : "&",
    selectItem_ : "&",
    destroyItem_ : "&",
  },
})

"use strict"

var app = angular.module('cloudStorm.tableHeader', [])

app.component('csTableHeader', {

  templateUrl : 'components/cs-table/cs-table-header/cs-table-header-template.html',
  controller : [ 'csSettings','$filter','$element', function(csSettings, $filter, $element){

    this.$onInit = function() {
      this.selectedColumn = null
      this.direction = "asc"
      $element.addClass('cs-table-header')
    };

    // this.$onChanges = function(changesObj) {
    //   console.log(changesObj)
    //   if (changesObj.columns.currentValue) {
    //     //this.changeSorting(changesObj.columns.currentValue[0]);
    //   }
    // }

    this.changeSorting = function(column){

      if(this.selectedColumn == column) {
        this.flipDirection()
      } else {
        this.selectedColumn = column
        this.direction = "asc"
      }
      return this.sort_({column : column, direction : this.direction })
    }

    this.flipDirection = function() {
      this.direction = this.direction == "asc" ? "desc" : "asc"
    }

    this.columnVisible = function(column, index) {
      return this.columnVisible_({column : column, index : index})
    }

    this.asc = function(column){
      if (this.selectedColumn == null) {return false;}
      return (this.csIndexOptions.sortAttribute == column.attribute
        && this.direction == 'asc')
    }

    this.desc = function(column){
      if (this.selectedColumn == null) {return false;}
      return (this.csIndexOptions.sortAttribute == column.attribute
        && this.direction == 'desc')
    }

  }],
  bindings : {
    csIndexOptions : "=",
    columns : "<",
    columnVisible_ : "&",
    sort_ : "&",
  },
})

"use strict"

var app = angular.module('cloudStorm.tableRow', [])

app.component('csTableRow', {

  templateUrl : 'components/cs-table/cs-table-row/cs-table-row-template.html',

  controller : [ 'csSettings','$filter','$element', function(csSettings, $filter, $element){

    this.i18n = csSettings.settings['i18n-engine']

    this.$onInit = function() {
      $element.addClass('cs-table-row')
      //TODO - Later the different field directive must be prepared if the
      //options input is not defined. i.e. the cs-date would throw and error.
      this.fieldOptions = {}
    };

    this.showItem = function(){
      this.showItem_({item : this.item})
    }

    this.selectItem = function(){
      this.selectItem_({item : this.item})
    }

    this.destroyItem = function(event) {
      this.destroyItem_({event : event, item : this.item})
    }

    this.fieldValue = function(field) {
      var item = this.item
      var associations, display_date, display_time, enum_value, item_data, names, relationship;
      if (field.resource) {
        if (field.cardinality === 'many') {
          associations = item.$association(field);
          names = _.map(associations, function(assoc) {
            return assoc.$display_name();
          });
          return names.join(", ");
        } else {
          if (!(item.relationships && item.relationships[field.relationship])) {
            return item.attributes[field.attribute];
          }
          item_data = item.relationships[field.relationship].data;
          relationship = item.$relationship(item_data);
          if (!relationship) {
            return item.attributes[field.attribute];
          }
          return relationship.$display_name();
        }
      } else if (field["enum"]) {
        enum_value = _.find(field["enum"], {
          value: item.attributes[field.attribute]
        });
        if (enum_value) {
          return enum_value.name;
        }
        return item.attributes[field.attribute];
      } else if (field.type === 'boolean') {
        if (this.i18n) {
          return this.i18n.t(item.attributes[field.attribute]) || item.attributes[field.attribute];
        } else {
          return item.attributes[field.attribute];
        }
      } else if (field.type === 'time') {
        display_time = new Date(item.attributes[field.attribute]);
        return $filter('date')(display_time, 'HH:mm');
      } else if (field.type === 'datetime') {
        display_date = new Date(item.attributes[field.attribute]);
        return $filter('date')(display_date, 'EEEE, MMMM d, y HH:mm');
      } else {
        return item.attributes[field.attribute];
      }
    };
  }],
  bindings : {
    item : "<",
    csIndexOptions : "=",
    columns : "<",
    columnVisible_ : "&",
    showItem_ : "&",
    selectItem_ : "&",
    destroyItem_ : "&",
  },
})

'use strict'

var app;

app = angular.module('cloudStorm.resourceFilter', [])

app.factory('csResourceFilter', [ 'csSettings','$filter', function(csSettings, $filter) {

  this.i18n = csSettings.settings['i18n-engine']

  this.sort = function(array, column, direction){

    return _.sortBy(array, (function(item){
      var fieldValue = this.fieldValue(item, column)
      if (fieldValue &&  (typeof fieldValue === 'string' || fieldValue instanceof String))
        fieldValue = fieldValue.toString().toLowerCase()
      return fieldValue
    }).bind(this))
  }

  this.filter = function(array, columns, filterValue) {
    return _.filter(array, (function(item){
      var search = new RegExp(this.escapeRegExp(filterValue), "i");
      return _.any(columns, (function(field) {
        var field_value;
        if ((field_value = this.fieldValue(item, field))) {
          return field_value.toString().match(search);
        }
      }).bind(this));
    }).bind(this))
  }

  this.escapeRegExp = function(str){
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  }

  this.fieldValue = function(item, field) {
    if (!field) { return '';}
    var associations, display_date, display_time, enum_value, item_data, names, ref, relationship;
    if (field.resource) {
      if (field.cardinality === 'many') {
        associations = item.$association(field);
        names = _.map(associations, function(assoc) {
          return assoc.$display_name();
        });
        return names.join(", ");
      } else {
        if (!(item.relationships && item.relationships[field.relationship])) {
          return item.attributes[field.attribute];
        }
        item_data = item.relationships[field.relationship].data;
        relationship = item.$relationship(item_data);
        if (!relationship) {
          return item.attributes[field.attribute];
        }
        return relationship.$display_name();
      }
    } else if (field["enum"]) {
      enum_value = _.find(field["enum"], {
        value: item.attributes[field.attribute]
      });
      if (enum_value) {
        return enum_value.name;
      }
      return item.attributes[field.attribute];
    } else if (field.type === 'boolean') {
      if (this.i18n) {
        return this.i18n.t(item.attributes[field.attribute]) || item.attributes[field.attribute];
      } else {
        return item.attributes[field.attribute];
      }
    } else if (field.type === 'time') {
      display_time = new Date(item.attributes[field.attribute]);
      return $filter('date')(display_time, 'HH:mm');
    } else if (field.type === 'datetime') {
      display_date = new Date(item.attributes[field.attribute]);
      return $filter('date')(display_date, 'yyyy-MM-dd HH:mm');
    } else if (field.type === 'date') {
      display_date = new Date(item.attributes[field.attribute]);
      return $filter('date')(display_date, 'yyyy-MM-dd');
    } else if (field.type === 'integer') {
      return +item.attributes[field.attribute];
    } else if (field.type === 'float') {
      return +item.attributes[field.attribute];
    } else {
      return item.attributes[field.attribute];
    }
  };

  return this;
}])

"use strict";
var app;

app = angular.module('cloudStorm.routeProvider', []);

app.provider('csRoute', [
  '$stateProvider', 'csSettingsProvider', function($stateProvider, csSettingsProvider) {

    this.go = function(type, params, options) {
      if (this.state) {
        return this.state.go(csSettingsProvider.settings['router-path-prefix'] + type, params, options);
      } else {
        console.log('No current router state, cannot navite to', type, params, options)
      }
    };

    this.setState = function(state) {
      return this.state = state;
    };

    this.addState = function(config) {
      return $stateProvider.state(config);
    };

    this.$get = function() {
      return this;
    };

    this.init = function() {
      var i, len, ref, results, state;
      ref = csSettingsProvider.settings['router-states']();
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        state = ref[i];
        results.push(this.setState((this.addState(state)).$get()));
      }
      return results;
    };
  }
]);

var app

app = angular.module("cloudStorm.uiPageRouter", [])

app.component("csPageRouter", {

    bindings : {
        resourceType : "<",
        id : "<",
        cmd : "<",
        pageType : "<",
    },
    templateUrl : "cs-route-provider/router-component/cs-page-router-template.html",
    controller : [ '$scope','csRoute','ResourceService','csDescriptorService','csAlertService', function($scope, csRoute, ResourceService, csDescriptorService, csAlertService){
        this.loading = true
        this.errors = []
        this.validCommands = ["edit","show"]
        //getDataLoaderObject(this, descriptor)["index"].call()
        this.init = function () {
            switch (this.pageType) {
              case "index":
                this.resource_index();
                break;

              case "cmd":
                if(this.validCommands.indexOf(this.cmd) == -1){
                  this.errors.push("\"" + this.cmd + "\" is not a valid command");
                }
                this.pageType = this.cmd
                this.resource_id();
                break;

              case "show":
                if(this.id == "new"){
                  this.pageType = "create"
                  this.resource();
                } else {
                  this.resource_id();
                }
                break;

              default:
                this.errors.push("This is not a valid URL");
                this.finished()
                break;
            }
        }

        this.resource = function(){

          csDescriptorService.getPromises().then(
            (function(){
              return ResourceService.get(this.resourceType)
            }).bind(this)).then(
              (function(resource){
                this.resource = resource
                this.finished()
              }).bind(this), (function(){
                this.errors.push("\"" + this.resourceType + "\" is not a resource")
                this.finished()
              }).bind(this)
            )
        }

        this.resource_id = function(){

          csDescriptorService.getPromises().then(
            (function(){
              return ResourceService.get(this.resourceType)
            }).bind(this)).then(
              (function(resource){
                this.resource = resource
                return resource.$get(this.id, {include: '*'})
              }).bind(this), (function(){
                this.errors.push("\"" + this.resourceType + "\" is not a resource")
              }).bind(this)
            ).then((function(item){
                this.item = item
                this.finished()
            }).bind(this), (function(){
              this.errors.push("There is no " + this.resource.descriptor.name + " with the id: " + this.id)
              this.finished()
            }).bind(this))
        }

        this.resource_index = function(){

          csDescriptorService.getPromises()
            .then((function(){
              return ResourceService.get(this.resourceType)
            }).bind(this))
            .then(
              (function(resource){
                this.resource = resource
                return resource.$index({include: '*'})
                this.finished()
              }).bind(this), (function(){
                this.errors.push("\"" + this.resourceType +
                  "\" is not a resource")
              }).bind(this))
            .then((function(items){
                  this.items = items
                  this.finished()
              }).bind(this)
            )
        }

        this.finished = function(){

          this.wizardOptions = {
            "resource-type" : this.resourceType,
            "form-item": this.item || {},
            "form-mode": this.pageType,
            "reset-on-submit": true,
            "events": {
              'wizard-canceled': (function(resource){
                  csRoute.go("index", {resourceType : this.resourceType})
                }).bind(this),
              'wizard-submited': (function(resource){
                  //$scope.wizardOptions['keep-first']
                  switch(this.pageType){
                    case "create":
                      csAlertService.success('new_resource_created')
                      break;
                    case "edit":
                      csAlertService.success("changes_saved")
                      break;
                  }

                  if(this.wizardOptions['keep-first']){
                    csRoute.go("show", {resourceType : this.resourceType, id : "new"})
                  } else {
                    csRoute.go("index", {resourceType : this.resourceType})
                  }
              }).bind(this)
            }
          }
          this.loading = false
          // TODO: double-check wheter this could be avoided
          $scope.$apply()
        }

        var vm = this;
        this.$onInit = function () {
          vm.init();
        }
    }]
})

/*
//For later
var functionStack = {

    descriptor : {
      call : {
        type : "direct",
        fcn : (csDescriptorService.getPromises).bind(csDescriptorService),
      }, params : [],
      success : function(){},
      fail : function(){},
    },
    resource : {
      call :  {
        type : "direct",
        fcn : (ResourceService.get).bind(ResourceService)
      },
      params : [{
        type : "scopeField",
        key : "resourceType"
      }],
      success : function(data){
        this.resource = data
      },
      fail : function(){
        this.errors.push("\"" + this.resourceType + "\" is not a resource")
      }
    },
    item : {
      call : {
        type : "scopeField",
        keys : ["resource", "get"],
      },  //data.$get(this.id, {include: '*'})
      params : [{
        type : "scopeField", key : "id",
      }, {
        type : "constant", value :  {include: '*'},
      }],
      success : function(data){
          this.item = data
      },
      fail : function(){
        this.errors.push("There is no " + this.resource.descriptor.name + "with the id: " + this.id)
      }
    }
}

var cases = {
  index : ["descriptor", "resource"],
  new : ["descriptor", "resource"],
  profile : ["descriptor", "resource", "item"],
  edit : ["descriptor", "resource", "item"],
}

this.execute = function(patternType){

  var calls = []
  cases[patternType].forEach(function(call){
    calls.push(functionStack[call])
  })
  var promises = []
  calls.forEach((function(call){
    var params = getParams(this, call.params)
    var func = getFunction(this, call.call)
    promises.push(this.call(params, func).then((call.success).bind(this), (call.fail).bind(this)))
  }).bind(this))
  Promise.all(promises)()
}

var getParams = function(scope, desc){
  var params = []
  desc.forEach(function(param){
    switch(param.type){
      case "scopeField" : params.push(scope[param.key]); break;
      case "constant" : params.push(param.value); break;
    }
  })
  return params
}

var getFunction = function(scope, desc){
    switch(desc.type){
        case "scopeField" :
          var object = scope
          desc.keys.forEach(function(key){
            object = object[key]
          });
          return object
        case "direct" : return desc.fcn;
    }
}

this.call = function(params, func){
  switch(params.length){
    case 0 : return func();
    case 1 : return func(params[0]);
    case 2 : return func(params[0], params[1]);
    case 3 : return func(params[0], params[1], params[2]);
  }
}
*/

//this.execute("profile").bind(this)

var app

app = angular.module("cloudStorm.error", [])

app.component("csError", {

  bindings : {
    errors : "<",
  },
  templateUrl : "cs-utils/cs-error-template/cs-error-template.html",
})

angular.module('cloudStorm.templates', ['components/containers/cs-item-list-container/cs-item-list-container-template.html', 'components/cs-alert/cs-alert-template.html', 'components/cs-field/cs-field-template.html', 'components/cs-fields/cs-checkbox/cs-checkbox-template.html', 'components/cs-fields/cs-code/cs-code-template.html', 'components/cs-fields/cs-code/cs-full-code/cs-full-code-template.html', 'components/cs-fields/cs-date/cs-date-template.html', 'components/cs-fields/cs-datetime/cs-datetime-template.html', 'components/cs-fields/cs-enum/cs-enum-template.html', 'components/cs-fields/cs-number/cs-number-template.html', 'components/cs-fields/cs-resource-input/cs-resource-input-template.html', 'components/cs-fields/cs-textfield/cs-textfield-template.html', 'components/cs-fields/cs-time/cs-time-template.html', 'components/cs-filter-row/cs-filter-row-template.html', 'components/cs-form/cs-form-template.html', 'components/cs-index/cs-index-sidepanel/cs-index-sidepanel-template.html', 'components/cs-index/cs-index-template.html', 'components/cs-item-list/cs-item-list-template.html', 'components/cs-main/cs-main-template.html', 'components/cs-menu/cs-menu-template.html', 'components/cs-table/cs-table-container/cs-table-container-template.html', 'components/cs-table/cs-table-header/cs-table-header-template.html', 'components/cs-table/cs-table-row/cs-table-row-template.html', 'components/cs-wizard/cs-wizard-panel-template.html', 'components/cs-wizard/cs-wizard-template.html', 'cs-route-provider/router-component/cs-page-router-template.html', 'cs-utils/cs-error-template/cs-error-template.html', 'cs-utils/cs-loader/cs-loader-template.html']);

angular.module("components/containers/cs-item-list-container/cs-item-list-container-template.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/containers/cs-item-list-container/cs-item-list-container-template.html",
    "<div class='modal-header'>\n" +
    "  <button class='close' ng-click='$ctrl.close()'>\n" +
    "    &times\n" +
    "  </button>\n" +
    "  <h4 class='modal-title'>\n" +
    "    {{ $ctrl.UI.fieldName }}\n" +
    "  </h4>\n" +
    "</div>\n" +
    "<cs-item-list c-mode='$ctrl.cMode' field='$ctrl.field' item-list='$ctrl.itemList' item='$ctrl.item' key='$ctrl.key' many='$ctrl.many'></cs-item-list>\n" +
    "");
}]);

angular.module("components/cs-alert/cs-alert-template.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/cs-alert/cs-alert-template.html",
    "<div close='csAlertService.dismissAlert(alert.id)' dismiss-on-timeout='{{csAlertService.timeoutForAlert(alert)}}' ng-class=\"'alert alert-dismissible alert-' + (alert.type || 'warning')\" ng-click='csAlertService.dismissAlert(alert.id)' ng-repeat='alert in csAlertService.getAlerts()' uib-alert=''>\n" +
    "  {{alert.message}}\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/cs-field/cs-field-template.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/cs-field/cs-field-template.html",
    "<!-- CloudStorm Form Field component -->\n" +
    "<!-- Renders different kind of inputs for different types of items -->\n" +
    "<div class='cs-field-inner' ng-class='CL.containerStyle'>\n" +
    "  <div ng-class='CL.container'>\n" +
    "    <div class='inline label-container' ng-class='CL.label'>\n" +
    "      <label class='control-label'>{{field.label}}</label>\n" +
    "      <span class='req-star' ng-class='CL.required' ng-if='field.required'>*</span>\n" +
    "    </div>\n" +
    "    <div ng-class='CL.value'>\n" +
    "      <div class='cs-input-wrapper'></div>\n" +
    "    </div>\n" +
    "    <span class='help-block' ng-if='field.errors.length &gt; 0'>\n" +
    "      {{ getError(field) }}\n" +
    "    </span>\n" +
    "    <span class='help-block' ng-if='(!(field.errors.length &gt; 0) &amp;&amp; (getHint(field)))'>\n" +
    "      {{ getHint(field) }}\n" +
    "    </span>\n" +
    "    <div class='cover'></div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/cs-fields/cs-checkbox/cs-checkbox-template.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/cs-fields/cs-checkbox/cs-checkbox-template.html",
    "<!-- Only valid for cardinality:one -->\n" +
    "<input class='form-control' ng-disabled='fieldDisabled()' ng-if=\"mode('create') || mode('edit')\" ng-model='formItem.attributes[field.attribute]' type='checkbox'>\n" +
    "<div class='show-view' ng-if=\"mode('show') || mode('tableView')\">\n" +
    "  <div ng-if='formItem.attributes[field.attribute]'>\n" +
    "    {{ i18n.t('checkbox.checked') }}\n" +
    "  </div>\n" +
    "  <div ng-if='!formItem.attributes[field.attribute]'>\n" +
    "    {{ i18n.t('checkbox.unchecked') }}\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/cs-fields/cs-code/cs-code-template.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/cs-fields/cs-code/cs-code-template.html",
    "<div ng-if=\"mode('create') || mode('edit')\">\n" +
    "  <textarea class='form-control' ng-disabled='fieldDisabled()' ng-keyup='keyPressed($event)' ng-model='formItem.attributes[field.attribute]' ng-required='fieldRequired()' rows='3'></textarea>\n" +
    "</div>\n" +
    "<pre ng-if=\"mode('show')\" ng-model='formItem.attributes[field.attribute]'><code>{{ formatted_code }}</code></pre>\n" +
    "<pre ng-if=\"mode('tableView') &amp;&amp; !trimmed\" ng-model='formItem.attributes[field.attribute]'><code>{{ formatted_code_short }}</code></pre>\n" +
    "<pre class='pointer-cursor' ng-click='showFullCode()' ng-if=\"mode('tableView') &amp;&amp; trimmed\" ng-model='formItem.attributes[field.attribute]'><code>{{ formatted_code_short }}</code></pre>\n" +
    "<!-- %div{ \"ng-if\" => \"mode('tableView')\" } -->\n" +
    "<!-- {{ formItem.attributes[field.attribute] }} -->\n" +
    "");
}]);

angular.module("components/cs-fields/cs-code/cs-full-code/cs-full-code-template.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/cs-fields/cs-code/cs-full-code/cs-full-code-template.html",
    "<div class='modal-header'>\n" +
    "  <button class='close' ng-click='$ctrl.close()'>\n" +
    "    &times\n" +
    "  </button>\n" +
    "  <h4 class='modal-title'>\n" +
    "    {{ $ctrl.UI.title }}\n" +
    "  </h4>\n" +
    "</div>\n" +
    "<div class='modal-body'>\n" +
    "  <pre><code>{{ $ctrl.UI.content }}</code></pre>\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/cs-fields/cs-date/cs-date-template.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/cs-fields/cs-date/cs-date-template.html",
    "<input autocomplete='off' class='form-control' clear-text=\"{{ i18n.t('buttons.clear') }}\" close-text=\"{{ i18n.t('buttons.close') }}\" current-text=\"{{ i18n.t('today') }}\" datepicker-append-to-body='true' datepicker-options='{startingDay: 1, showWeeks: false}' is-open='dt.open' ng-click='dt.open = true' ng-disabled='fieldDisabled()' ng-if=\"mode('edit') || mode('create')\" ng-model-options='getModelOptions()' ng-model='formItem.attributes[field.attribute]' ng-required='fieldRequired()' type='text' uib-datepicker-popup=''>\n" +
    "<div class='form-control no-cursor' disabled='true' ng-if=\"mode('show')\">\n" +
    "  {{ input_date }}\n" +
    "</div>\n" +
    "<div class='no-wrap' ng-if=\"mode('tableView')\">\n" +
    "  {{ input_date }}\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/cs-fields/cs-datetime/cs-datetime-template.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/cs-fields/cs-datetime/cs-datetime-template.html",
    "<div class='container-flex' ng-if=\"mode('edit') || mode('create')\">\n" +
    "  <input autocomplete='off' class='form-control first' clear-text=\"{{ i18n.t('buttons.clear') }}\" close-text=\"{{ i18n.t('buttons.close') }}\" current-text=\"{{ i18n.t('today') }}\" datepicker-append-to-body='true' datepicker-options='{startingDay: 1, showWeeks: false}' is-open='dt.open' ng-click='dt.open = true' ng-disabled='fieldDisabled()' ng-model-options='getModelOptions()' ng-model='formItem.attributes[field.attribute]' ng-required='fieldRequired()' type='text' uib-datepicker-popup=''>\n" +
    "  <div ng-disabled='fieldDisabled()' ng-model-options='getModelOptions()' ng-model='formItem.attributes[field.attribute]' ng-required='fieldRequired()' show-spinners='false' uib-timepicker=''></div>\n" +
    "</div>\n" +
    "<div class='form-control no-cursor' disabled='true' ng-if=\"mode('show')\">\n" +
    "  {{ input_date }}\n" +
    "</div>\n" +
    "<div class='no-wrap' ng-if=\"mode('tableView')\">\n" +
    "  {{ input_date }}\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/cs-fields/cs-enum/cs-enum-template.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/cs-fields/cs-enum/cs-enum-template.html",
    "<ui-select close-on-select='true' ng-disabled='fieldDisabled()' ng-if=\"field.cardinality == 'one'\" ng-model='formItem.attributes[field.attribute]' ng-required='fieldRequired()'>\n" +
    "  <ui-select-match>\n" +
    "    <span>\n" +
    "      {{$select.selected.name}}\n" +
    "    </span>\n" +
    "  </ui-select-match>\n" +
    "  <ui-select-choices repeat='item.value as item in (field.enum | filter:$select.search) track by $index'>\n" +
    "    <span>\n" +
    "      {{item.name}}\n" +
    "    </span>\n" +
    "  </ui-select-choices>\n" +
    "</ui-select>\n" +
    "<ui-select multiple='' ng-disabled='fieldDisabled()' ng-if=\"field.cardinality == 'many'\" ng-model='formItem.attributes[field.attribute]' ng-required='fieldRequired()'>\n" +
    "  <ui-select-match>\n" +
    "    <span>\n" +
    "      {{$item.name}}\n" +
    "    </span>\n" +
    "  </ui-select-match>\n" +
    "  <ui-select-choices repeat='item.value as item in (field.enum | filter:$select.search) track by $index'>\n" +
    "    <span>\n" +
    "      {{item.name}}\n" +
    "    </span>\n" +
    "  </ui-select-choices>\n" +
    "</ui-select>\n" +
    "");
}]);

angular.module("components/cs-fields/cs-number/cs-number-template.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/cs-fields/cs-number/cs-number-template.html",
    "<input class='form-control' ng-disabled='fieldDisabled()' ng-if=\"mode('create') || mode('edit')\" ng-model='formItem.attributes[field.attribute]' ng-required='fieldRequired()' type='number'>\n" +
    "<div class='form-control no-cursor' disabled='true' ng-if=\"mode('show')\">\n" +
    "  {{ formItem.attributes[field.attribute] }}\n" +
    "</div>\n" +
    "<div class='no-wrap' ng-if=\"mode('tableView')\">\n" +
    "  {{ formItem.attributes[field.attribute] }}\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/cs-fields/cs-resource-input/cs-resource-input-template.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/cs-fields/cs-resource-input/cs-resource-input-template.html",
    "<div class='input-group cs-resource-input-group' ng-if=\"field.cardinality == 'one' &amp;&amp; (mode('create') || mode('edit'))\">\n" +
    "  <ui-select append-to-body='true' close-on-select='true' ng-disabled='fieldDisabled()' ng-model='model.object' ng-required='fieldRequired()'>\n" +
    "    <ui-select-match allow-clear>\n" +
    "      <span>\n" +
    "        {{$select.selected.$display_name()}}\n" +
    "      </span>\n" +
    "    </ui-select-match>\n" +
    "    <ui-select-choices refresh-delay='200' refresh='refresh($select.search)' repeat='item in associates track by $index'>\n" +
    "      <span>\n" +
    "        {{item.$display_name()}}\n" +
    "      </span>\n" +
    "    </ui-select-choices>\n" +
    "  </ui-select>\n" +
    "  <span class='input-group-btn' ng-if='canCreateResources() || createDisabled()'>\n" +
    "    <button class='btn btn-default' ng-click='pushPanel()' ng-disabled='fieldDisabled()' type='button'>{{ i18n.t('buttons.new') }}</button>\n" +
    "  </span>\n" +
    "</div>\n" +
    "<cs-item-list c-mode='formMode' field='field' item-list='model.object' key='resource.descriptor.fields[0].attribute' many=\"field.cardinality == 'many'\" ng-if=\"(mode('show') || mode('tableView'))\" optins='options'></cs-item-list>\n" +
    "<div class='input-group cs-resource-input-group' ng-if=\"(mode('create') || mode('edit')) &amp;&amp; field.cardinality == 'many'\">\n" +
    "  <ui-select append-to-body='true' close-on-select='true' enable='false' multiple ng-disabled='fieldDisabled()' ng-model='model.object' ng-required='fieldRequired()' on-select='selectItem()' ui-select-override=''>\n" +
    "    <ui-select-match ui-lock-choice=\"mode('show')\">\n" +
    "      <span>\n" +
    "        {{$item.$display_name()}}\n" +
    "      </span>\n" +
    "    </ui-select-match>\n" +
    "    <ui-select-choices refresh-delay='200' refresh='refresh($select.search)' repeat='item in associates track by $index'>\n" +
    "      <span>\n" +
    "        {{item.$display_name()}}\n" +
    "      </span>\n" +
    "    </ui-select-choices>\n" +
    "  </ui-select>\n" +
    "  <span class='input-group-btn' ng-if=\"createResources() &amp;&amp; !createDisabled() &amp;&amp; (mode('create') || mode('edit'))\">\n" +
    "    <button class='btn btn-default' ng-click='pushPanel()' ng-disabled='fieldDisabled()' type='button'>{{ i18n.t('buttons.new') }}</button>\n" +
    "  </span>\n" +
    "</div>\n" +
    "<div class='cover'></div>\n" +
    "");
}]);

angular.module("components/cs-fields/cs-textfield/cs-textfield-template.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/cs-fields/cs-textfield/cs-textfield-template.html",
    "<!-- ng-if creates an isolate scope so all data is available through $parent -->\n" +
    "<!-- %ui-select-choices is only here to disable typeahed dropdown as there should be not typeahed in this controller -->\n" +
    "<div ng-if=\"mode('create') || mode('edit')\">\n" +
    "  <input class='form-control' ng-disabled='fieldDisabled()' ng-if=\"field.cardinality == 'one'\" ng-keyup='keyPressed($event)' ng-model='$parent.formItem.attributes[$parent.field.attribute]' ng-required='fieldRequired()' type='text'>\n" +
    "  <ui-select multiple='' ng-disabled='fieldDisabled()' ng-if=\"field.cardinality == 'many'\" ng-model='$parent.formItem.attributes[$parent.field.attribute]' ng-required='fieldRequired()' tagging-label='newTag' tagging=''>\n" +
    "    <ui-select-match>\n" +
    "      <span>\n" +
    "        {{ $item }}\n" +
    "      </span>\n" +
    "    </ui-select-match>\n" +
    "    <ui-select-choices repeat='item in []'></ui-select-choices>\n" +
    "  </ui-select>\n" +
    "</div>\n" +
    "<div class='form-control no-cursor' disabled ng-if=\"mode('show')\" ng-model='$parent.formItem.attributes[$parent.field.attribute]'>\n" +
    "  {{ formItem.attributes[field.attribute] }}\n" +
    "</div>\n" +
    "<div ng-if=\"mode('tableView')\">\n" +
    "  {{ formItem.attributes[field.attribute] }}\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/cs-fields/cs-time/cs-time-template.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/cs-fields/cs-time/cs-time-template.html",
    "<div ng-disabled='fieldDisabled()' ng-model-options='getModelOptions()' ng-model='formItem.attributes[field.attribute]' ng-required='fieldRequired()' show-spinners='false' uib-timepicker=''></div>\n" +
    "");
}]);

angular.module("components/cs-filter-row/cs-filter-row-template.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/cs-filter-row/cs-filter-row-template.html",
    "<div class='row page-header'>\n" +
    "  <h1>\n" +
    "    {{ $ctrl.header }}\n" +
    "    <small ng-bind='$ctrl.subHeader'></small>\n" +
    "    <div class='header-actions pull-right'>\n" +
    "      <div class='input-group-wrap'>\n" +
    "        <div class='input-group'>\n" +
    "          <div class='input-group-addon'>\n" +
    "            <span class='glyphicon glyphicon-search'></span>\n" +
    "          </div>\n" +
    "          <input class='form-control cs-index-filter' ng-change='$ctrl.changeInFilter()' ng-model='$ctrl.filterValue' placeholder=\"{{$ctrl.i18n.t('filter_for_anything') }}\" type='text'>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <button class='btn btn-default' ng-click='$ctrl.refreshIndex_()' type='button'>\n" +
    "        <span class='glyphicon glyphicon-refresh'></span>\n" +
    "      </button>\n" +
    "      <button class='btn btn-primary create-button' ng-click='$ctrl.openNewResourcePanel_()' ng-disabled='$ctrl.createDisabled' type='button'>\n" +
    "        {{ $ctrl.i18n.t('buttons.new') }}\n" +
    "      </button>\n" +
    "    </div>\n" +
    "  </h1>\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/cs-form/cs-form-template.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/cs-form/cs-form-template.html",
    "<!-- CloudStorm Form component -->\n" +
    "<!-- Can be used on its own or be generated by a CSWizard -->\n" +
    "<!-- Iterates over the fields of a form and renders CSField components for each field -->\n" +
    "<div class='form-header' ng-switch=\"csFormOptions['form-mode']\">\n" +
    "  <h3 ng-switch-when='create'>\n" +
    "    {{i18n.t('new')}} {{formResource.descriptor.name}}\n" +
    "  </h3>\n" +
    "  <span ng-switch-when='edit'>\n" +
    "    <h4 class='divided'>\n" +
    "      {{editableItem.$display_name()}}\n" +
    "    </h4>\n" +
    "  </span>\n" +
    "  <span ng-switch-when='show'>\n" +
    "    <h4 class='divided'>\n" +
    "      {{editableItem.$display_name()}}\n" +
    "    </h4>\n" +
    "  </span>\n" +
    "</div>\n" +
    "<form name='csForm' ng-transclude='fields' novalidate=''>\n" +
    "  <cs-field class='form-group field' create-resources='createResources()' cs-field-options='csFormOptions' descriptor=\"childDescriptors['csField']\" field='field' form-item='editableItem' form-mode='formMode' ng-if='isFieldVisible(field.attribute)' ng-repeat='field in fields track by $index'></cs-field>\n" +
    "</form>\n" +
    "<div class='form-group form-actions' ng-if=\"formMode != 'show'\" ng-transclude='actions'>\n" +
    "  <div class='actions-inner'>\n" +
    "    <div class='btn-tooltip-wrapper' tooltip-enable='csForm.$invalid' tooltip-placement='right' tooltip-trigger='mouseenter' uib-tooltip=\"{{i18n.t('validation_text')}}\">\n" +
    "      <button class='btn btn-success' ng-class=\"{'disabled': csForm.$invalid}\" ng-click='submit()' type='button'>\n" +
    "        {{ i18n.t('buttons.submit') }}\n" +
    "      </button>\n" +
    "    </div>\n" +
    "    <button class='btn btn-link' ng-click='cancel()' ng-switch=\"csFormOptions['form-mode']\" type='button'>\n" +
    "      <span ng-switch-when='create'>\n" +
    "        {{ i18n.t('buttons.close') }}\n" +
    "      </span>\n" +
    "      <span ng-switch-default=''>\n" +
    "        {{ i18n.t('buttons.cancel') }}\n" +
    "      </span>\n" +
    "    </button>\n" +
    "    <span class='help-block' ng-if='field.errors.length &gt; 0'></span>\n" +
    "    <div class='checkbox create-another' ng-if=\"formMode == 'create' &amp;&amp; wizardPanelIndex == 0\">\n" +
    "      <label>\n" +
    "        <input ng-model=\"csFormOptions['keep-first']\" type='checkbox'>\n" +
    "          {{ i18n.t('create_another') }}\n" +
    "        </input>\n" +
    "      </label>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/cs-index/cs-index-sidepanel/cs-index-sidepanel-template.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/cs-index/cs-index-sidepanel/cs-index-sidepanel-template.html",
    "<div class='panel-close'>\n" +
    "  <span ng-click='closePanel()'>&#10006;</span>\n" +
    "</div>\n" +
    "<div cs-wizard-options='editWizardOptions' cs-wizard='' ng-if='editWizardOptions' panel-number-callback='panelNumberCallback'></div>\n" +
    "");
}]);

angular.module("components/cs-index/cs-index-template.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/cs-index/cs-index-template.html",
    "<div class='row'>\n" +
    "  <div class='col-lg-12' ng-switch='$ctrl.listIsEmpty()'>\n" +
    "    <cs-filter-row filter='$ctrl.filter(filterValue)' filterValue='$ctrl.filterValue' open-new-resource-panel='$ctrl.openNewResourcePanel()' refresh-index='$ctrl.refreshIndex()' resource='$ctrl.resource'></cs-filter-row>\n" +
    "    <div class='row' ng-switch-when='true'>\n" +
    "      <div class='well well-lg'>\n" +
    "        {{$ctrl.header}} {{ $ctrl.i18n.t('index.empty') }}\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class='row' ng-switch-when='false'>\n" +
    "      <cs-table-container collection='$ctrl.items' column-visible_='$ctrl.columnVisible(column, index)' columns='$ctrl.columns' cs-index-options='$ctrl.csIndexOptions' destroy-item_='$ctrl.destroyItem(event, item)' ng-class=\"{ 'col-lg-8' : $ctrl.sidePanelIsVisible() &amp;&amp; !$ctrl.viewIsCompressed(),&#x000A;'col-lg-6' : $ctrl.viewIsCompressed() }\" resource='$ctrl.resource' select-item_='$ctrl.selectItem(item)' show-item_='$ctrl.showItem(item)'></cs-table-container>\n" +
    "      <cs-index-sidepanel cs-index-sidepanel-options='$ctrl.csIndexOptions' item='$ctrl.csIndexOptions.selectedItem' ng-class=\"{ 'col-lg-4' : !$ctrl.viewIsCompressed() &amp;&amp; $ctrl.sidePanelIsVisible(),&#x000A;'col-lg-6' : $ctrl.viewIsCompressed() }\" ng-if='$ctrl.sidePanelIsVisible()' panel-number-callback_='$ctrl.getPanelNumber(length)' resource-type='$ctrl.resourceType' unselect-item='$ctrl.unselectItem()'></cs-index-sidepanel>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/cs-item-list/cs-item-list-template.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/cs-item-list/cs-item-list-template.html",
    "<!-- .item-container{ \"ng-class\" => \"{ 'row-container' : $ctrl.modalMode}\" } -->\n" +
    "<div class='item-container' ng-class='$ctrl.CL.itemContainer' ng-if='$ctrl.many'>\n" +
    "  <div class='form-control item' ng-class='$ctrl.CL.item' ng-click='$ctrl.select(item)' ng-if='$ctrl.many &amp;&amp; ($index &lt; 3 || !$ctrl.condition.tableMode)' ng-repeat='item in $ctrl.itemList track by $index'>\n" +
    "    {{ item.attributes[$ctrl.key] }}\n" +
    "  </div>\n" +
    "  <div class='form-control item' ng-class='$ctrl.CL.item' ng-click='$ctrl.showItems()' ng-if='$ctrl.itemList.length &gt; 3 &amp;&amp; $ctrl.condition.tableMode'>\n" +
    "    {{$ctrl.UI.clickText}}\n" +
    "  </div>\n" +
    "  <div class='no-item' ng-if='$ctrl.condition.noItem'>\n" +
    "    {{$ctrl.UI.noItem}}\n" +
    "  </div>\n" +
    "</div>\n" +
    "<!-- single item -->\n" +
    "<div class='form-control item' ng-click='$ctrl.selectSingle()' ng-if='!$ctrl.many &amp;&amp; !$ctrl.condition.noItem'>\n" +
    "  {{ $ctrl.itemList.$display_name() }}\n" +
    "</div>\n" +
    "<div class='no-item' ng-if='!$ctrl.many &amp;&amp; $ctrl.condition.noItem'>\n" +
    "  {{$ctrl.UI.noItem}}\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/cs-main/cs-main-template.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/cs-main/cs-main-template.html",
    "<cs-menu></cs-menu>\n" +
    "<cs-alert></cs-alert>\n" +
    "<div class='container'>\n" +
    "  <ui-view></ui-view>\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/cs-menu/cs-menu-template.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/cs-menu/cs-menu-template.html",
    "<div class='flex nav'>\n" +
    "  <div class='navElement appTitle'>\n" +
    "    {{title}}\n" +
    "  </div>\n" +
    "  <div class='navElement nav' ng-class='{selected : isSelected(resource.descriptor.type)}' ng-click='select(resource.descriptor.type)' ng-repeat='(key, resource) in resources'>\n" +
    "    {{resource.descriptor.name}}\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/cs-table/cs-table-container/cs-table-container-template.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/cs-table/cs-table-container/cs-table-container-template.html",
    "<div class='table-responsive'>\n" +
    "  <div class='cs-table table table-striped table-hover'>\n" +
    "    <div class='cs-table-body'>\n" +
    "      <cs-table-header column-visible_='$ctrl.columnVisible(column, index)' columns='$ctrl.columns' cs-index-options='$ctrl.csIndexOptions' sort_='$ctrl.sort(column, direction)'></cs-table-header>\n" +
    "    </div>\n" +
    "    <div class='cs-table-body'>\n" +
    "      <cs-table-row columns='$ctrl.columns' cs-index-options='$ctrl.csIndexOptions' destroy-item_='$ctrl.destroyItem(event, item)' item='item' ng-class=\" {  'selected-row' : $ctrl.csIndexOptions.selectedItem.id == item.id, &#x000A;'selectable-row' : $ctrl.csIndexOptions.selectedItem != null }\" ng-click='$ctrl.clickRow(item)' ng-repeat='item in $ctrl.collection track by $index' select-item_='$ctrl.selectItem(item)' show-item_='$ctrl.showItem(item)'></cs-table-row>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "<div class='row no-result' ng-if='$ctrl.collection.length == 0'>\n" +
    "  <div class='col-lg-12'>\n" +
    "    {{ $ctrl.i18n.t('info.no_item') }}\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/cs-table/cs-table-header/cs-table-header-template.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/cs-table/cs-table-header/cs-table-header-template.html",
    "<!-- .tRow is the style of the component template -->\n" +
    "<div class='cs-table-header-cell' ng-click='$ctrl.changeSorting(column)' ng-if='$ctrl.columnVisible(column, $index)' ng-repeat='column in $ctrl.columns track by $index'>\n" +
    "  <div class='inline'>\n" +
    "    {{column.label}}\n" +
    "  </div>\n" +
    "  <div class='inline arrow-container'>\n" +
    "    <span class='glyphicon glyphicon-triangle-top' ng-if='$ctrl.asc(column)'></span>\n" +
    "    <span class='glyphicon glyphicon-triangle-bottom' ng-if='$ctrl.desc(column)'></span>\n" +
    "  </div>\n" +
    "</div>\n" +
    "<div class='cs-table-header-cell actions' ng-hide=\"csIndexOptions['hide-actions']\"></div>\n" +
    "");
}]);

angular.module("components/cs-table/cs-table-row/cs-table-row-template.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/cs-table/cs-table-row/cs-table-row-template.html",
    "<div class='cs-table-cell' ng-repeat='column in $ctrl.columns track by $index'>\n" +
    "  <!-- {{ $ctrl.fieldValue(column) }} -->\n" +
    "  <cs-field cs-field-options='$ctrl.fieldOptions' field='column' form-item='$ctrl.item' form-mode=\"'tableView'\"></cs-field>\n" +
    "  <!-- \"ng-if\" => \"$ctrl.columnVisible(column, $index) || true\" -->\n" +
    "</div>\n" +
    "<div class='cs-table-cell actions'>\n" +
    "  <!-- SHOW -->\n" +
    "  <div class='action edit-action' ng-click='$ctrl.showItem()'>\n" +
    "    {{ $ctrl.i18n.t('buttons.show') }}\n" +
    "  </div>\n" +
    "  <!-- EDIT -->\n" +
    "  <div class='action edit-action' ng-click='$ctrl.selectItem()'>\n" +
    "    {{ $ctrl.i18n.t('buttons.edit') }}\n" +
    "  </div>\n" +
    "  <!-- DELETE -->\n" +
    "  <div class='action delete-action' ng-click='$ctrl.destroyItem($event)'>\n" +
    "    {{ $ctrl.i18n.t('buttons.delete') }}\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/cs-wizard/cs-wizard-panel-template.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/cs-wizard/cs-wizard-panel-template.html",
    "<div autocomplete='off' create-resources='shouldShowNewButton()' cs-form-options='csWizardOptions' cs-form='' form-item='panel.item' form-mode='{{panel.formMode}}' form-parent='panel.parent' form-resource-descriptor='resource_descriptor(panel)' form-resource='panel.resource' ng-class='formClass()' role='form' wizard-panel-index='panelIndex'></div>\n" +
    "");
}]);

angular.module("components/cs-wizard/cs-wizard-template.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/cs-wizard/cs-wizard-template.html",
    "<div class='form-panel animation' ng-class=\"{'active' : $index==panelStack.length-1,&#x000A;'pre-hover' : panel.hoverOrder &lt; 0,&#x000A;'hover' : panel.hoverOrder==0, 'post-hover' : panel.hoverOrder &gt; 0 }\" ng-init='panelIndex = $index' ng-mouseover='panelHover($index)' ng-repeat='panel in panelStack track by $index'>\n" +
    "  <cs-wizard-panel></cs-wizard-panel>\n" +
    "</div>\n" +
    "");
}]);

angular.module("cs-route-provider/router-component/cs-page-router-template.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("cs-route-provider/router-component/cs-page-router-template.html",
    "<cs-loader ng-if='$ctrl.loading'></cs-loader>\n" +
    "<div ng-if='!$ctrl.loading'>\n" +
    "  <cs-error errors='$ctrl.errors'></cs-error>\n" +
    "  <div ng-if='$ctrl.errors.length == 0' ng-switch='$ctrl.pageType'>\n" +
    "    <cs-index cs-index-options='options' item-id='null' items='$ctrl.items' ng-switch-when='index' resource-type='$ctrl.resourceType' resource='$ctrl.resource'></cs-index>\n" +
    "    <div class='aligner' ng-switch-when='show'>\n" +
    "      <div class='alignerItem'>\n" +
    "        <div class='wizardContainer'>\n" +
    "          <div cs-wizard-options='$ctrl.wizardOptions' cs-wizard=''></div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class='aligner' ng-switch-when='edit'>\n" +
    "      <div class='alignerItem'>\n" +
    "        <div class='wizardContainer'>\n" +
    "          <div cs-wizard-options='$ctrl.wizardOptions' cs-wizard=''></div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class='aligner' ng-switch-when='create'>\n" +
    "      <div class='alignerItem'>\n" +
    "        <div class='wizardContainer'>\n" +
    "          <div cs-wizard-options='$ctrl.wizardOptions' cs-wizard=''></div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("cs-utils/cs-error-template/cs-error-template.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("cs-utils/cs-error-template/cs-error-template.html",
    "<div class='alert alert-danger errorMsg' ng-repeat='error in $ctrl.errors'>\n" +
    "  <strong>\n" +
    "    Error!\n" +
    "  </strong>\n" +
    "  {{error}}\n" +
    "</div>\n" +
    "");
}]);

angular.module("cs-utils/cs-loader/cs-loader-template.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("cs-utils/cs-loader/cs-loader-template.html",
    "<div class='middle'>\n" +
    "  <div class='loader'></div>\n" +
    "</div>\n" +
    "");
}]);

//# sourceMappingURL=cloudstorm.js.map