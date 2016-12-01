/**
 * cloudstorm - v0.0.11 - 2016-12-01
 * https://github.com/cloudstorm/cloudstorm#readme
 *
 * Copyright (c) 2016 Virtual Solutions Ltd <info@cloudstorm.io>
 * Licensed MIT 
 */
"use strict";
var app;

app = angular.module('cloudStorm.alertService', []);

app.service('csAlertService', [
  function() {
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
    this.dismissAlert = function(idToDismiss) {
      return this.alerts = _.without(this.alerts, _.findWhere(this.alerts, {
        id: idToDismiss
      }));
    };
    return window.csAlerts = this;
  }
]);

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

app = angular.module('cloudStorm.checkbox', []);

app.directive("csCheckbox", [
  '$rootScope', 'csInputBase', function($rootScope, csInputBase) {
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
      templateUrl: 'components/cs-checkbox/cs-checkbox-template.html',
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

app = angular.module('cloudStorm.date', []);

app.directive("csDate", [
  'uibDateParser', 'csSettings', 'csInputBase', function(uibDateParser, csSettings, csInputBase) {
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
      if (format) {
        input_date = $scope.formItem.attributes[$scope.field.attribute];
        date = uibDateParser.parse(input_date, format);
        if (date) {
          date.setHours(14);
        }
        return $scope.formItem.attributes[$scope.field.attribute] = date;
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
          return $scope.$emit('input-value-changed', $scope.field);
        }
      });
    };
    return {
      restrict: 'E',
      templateUrl: 'components/cs-date/cs-date-template.html',
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
          $scope.$watch('formItem.id', function(newValue, oldValue) {
            if (newValue !== oldValue) {
              return format_date($scope);
            }
          });
          return $scope.$watch('formItem.attributes[field.attribute]', function(newValue, oldValue) {
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
  'uibDateParser', 'csSettings', 'csInputBase', function(uibDateParser, csSettings, csInputBase) {
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
        if (!angular.isDate(input_date)) {
          input_date = input_date.substring(0, input_date.length - 1);
        }
        console.log(input_date);
        date = uibDateParser.parse(new Date(input_date), date_format);
        return $scope.formItem.attributes[$scope.field.attribute] = date;
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
      templateUrl: 'cloudstorm/src/components/cs-datetime/cs-datetime-template.html',
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
      templateUrl: 'components/cs-enum/cs-enum-template.html',
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

app = angular.module('cloudStorm.field', []);

app.directive("csField", [
  '$compile', '$templateRequest', function($compile, $templateRequest) {
    var compile, getDirectiveOverride, link;
    compile = function($templateElement, $templateAttributes) {
      $templateElement.addClass("cs-field");
      return {
        pre: function($scope, element, attrs, controller) {},
        post: link
      };
    };
    link = function($scope, element, attrs, controller) {
      var directiveName, innerElement, inputTemplate, override, type;
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
            case type !== 'resource':
              return 'cs-resource-input';
            case type !== 'string':
              return 'cs-textfield';
            case type !== 'date':
              return 'cs-date';
            case type !== 'time':
              return 'cs-time';
            case type !== 'datetime':
              return 'cs-datetime';
            case type !== 'integer':
              return 'cs-number';
            case type !== 'float':
              return 'cs-number';
            case type !== 'enum':
              return 'cs-enum';
            case type !== 'boolean':
              return 'cs-checkbox';
          }
        })();
      }
      innerElement = angular.element(element[0].querySelector('.cs-input-wrapper'));
      inputTemplate = "<" + directiveName + " form-item='formItem' field-name='fieldName' field='field' form-mode='formMode' create-resources='createResources()' options='csFieldOptions'> </" + directiveName + ">";
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
        createResources: '&'
      },
      compile: compile
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
        pre: function(scope, element, attrs, controller) {},
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
      if ($scope.formMode === 'edit') {
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
  '$rootScope', 'csAlertService', 'csSettings', function($rootScope, csAlertService, csSettings) {
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
        unselectItem: '&unselectItem',
        csIndexSidepanelOptions: '=',
        panelNumberCallback: '='
      }
    };
  }
]);

"use strict";
var app;

app = angular.module('cloudStorm.index', []);

app.directive("csIndex", [
  'ResourceService', 'csDataStore', 'csRestApi', 'csSettings', '$uibModal', 'csAlertService', '$filter', function(ResourceService, csDataStore, csRestApi, csSettings, $uibModal, csAlertService, $filter) {
    var compile;
    compile = function($templateElement, $templateAttributes) {
      var link;
      $templateElement.addClass("cs-index");
      ({
        pre: function($scope, element, attrs, controller) {},
        post: link
      });
      return link = function($scope, element, attrs, ctrl) {
        var attributeToHide, defaultOptions, escapeRegExp, indexOptions, loadData, pushNewItem, resource, sortField;
        $scope.i18n = csSettings.settings['i18n-engine'];
        $scope.collection = [];
        resource = ResourceService.get($scope.resourceType);
        loadData = function() {
          return resource.$index({
            include: '*'
          }).then(function(items) {
            return $scope.collection = items;
          }, function(reason) {
            $scope.collection = null;
            return console.log(reason);
          }, function() {});
        };
        loadData();
        defaultOptions = {
          'selectedItem': null,
          'sortAttribute': resource.descriptor.fields[0].attribute,
          'filterValue': "",
          'sortReverse': false,
          'condensedView': false,
          'hide-actions': false,
          'hide-attributes': resource.descriptor.attributes_to_hide || {}
        };
        $scope.csIndexOptions || ($scope.csIndexOptions = {});
        indexOptions = angular.copy($scope.csIndexOptions);
        angular.copy({}, $scope.csIndexOptions);
        angular.merge($scope.csIndexOptions, defaultOptions, indexOptions);
        $scope.columns = resource.descriptor.fields;
        $scope.header = resource.descriptor.name;
        $scope.subHeader = resource.descriptor.hint;
        sortField = _.find(resource.descriptor.fields, {
          attribute: $scope.csIndexOptions.sortAttribute
        });
        $scope.comparisonValue = function(item) {
          if (sortField) {
            return $scope.fieldValue(item, sortField);
          }
        };
        escapeRegExp = function(str) {
          return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        };
        $scope.filterComparison = function(value, index, array) {
          var search;
          search = new RegExp(escapeRegExp($scope.csIndexOptions.filterValue), "i");
          return _.any(resource.descriptor.fields, function(field) {
            var field_value;
            if ((field_value = $scope.fieldValue(value, field))) {
              return field_value.toString().match(search);
            }
          });
        };
        $scope.listIsEmpty = function() {
          return $scope.collection === null;
        };
        $scope.fieldValue = function(item, field) {
          var associations, display_date, display_time, enum_value, item_data, names, ref, relationship;
          if (field.resource) {
            if (field.cardinality === 'many') {
              associations = item.$association(field);
              names = _.map(associations, function(assoc) {
                return assoc.$display_name();
              });
              return names.join(", ");
            } else {
              if (!item.relationships[field.relationship]) {
                return '';
              }
              item_data = item.relationships[field.relationship].data;
              relationship = item.$relationship(item_data);
              if (!relationship) {
                return '';
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
            return ((ref = $scope.i18n) != null ? ref.t(item.attributes[field.attribute]) : void 0) || item.attributes[field.attribute];
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
        $scope.columnVisible = function(column, index) {
          var length;
          length = $scope.columns.length;
          if (attributeToHide(column.attribute)) {
            return false;
          }
          if ($scope.viewIsCompressed() && !_.contains([0, 1, 2], index)) {
            return false;
          }
          return true;
        };
        attributeToHide = function(attribute) {
          var hiddenAttrs;
          if (hiddenAttrs = $scope.csIndexOptions['hide-attributes'].index) {
            return hiddenAttrs.indexOf(attribute) > -1;
          }
          return false;
        };
        $scope.createDisabled = function() {
          return resource.descriptor.create_disabled;
        };
        $scope.sidePanelIsVisible = function() {
          if ($scope.csIndexOptions.selectedItem) {
            return true;
          }
          return false;
        };
        $scope.viewIsCompressed = function() {
          return $scope.sidePanelIsVisible() && $scope.csIndexOptions.condensedView;
        };
        $scope.changeSorting = function(column) {
          $scope.csIndexOptions.sortAttribute = column.attribute;
          $scope.csIndexOptions.sortReverse = !$scope.csIndexOptions.sortReverse;
          return sortField = _.find(resource.descriptor.fields, {
            attribute: $scope.csIndexOptions.sortAttribute
          });
        };
        $scope.selectItem = function(item) {
          return $scope.csIndexOptions.selectedItem = item;
        };
        $scope.destroyItem = function($event, item) {
          var ref;
          $event.stopPropagation();
          if (confirm((ref = $scope.i18n) != null ? ref.t('confirm.delete') : void 0)) {
            return item.$destroy().then(function(result) {
              var index;
              $scope.csIndexOptions.selectedItem = null;
              index = $scope.collection.indexOf(item);
              return $scope.collection.splice(index, 1);
            }, function(reason) {
              var alert, ref1, ref2;
              alert = (ref1 = reason.data) != null ? ref1.errors[0].detail : void 0;
              return csAlertService.addAlert(alert || ((ref2 = $scope.i18n) != null ? ref2.t('alert.error_happened') : void 0), 'danger');
            });
          }
        };
        $scope.unselectItem = function() {
          return $scope.csIndexOptions.selectedItem = null;
        };
        $scope.getPanelNumber = function(length) {
          if (length > 1) {
            return $scope.csIndexOptions.condensedView = true;
          } else {
            return $scope.csIndexOptions.condensedView = false;
          }
        };
        $scope.refreshIndex = function() {
          $scope.unselectItem();
          return loadData();
        };
        $scope.openNewResourcePanel = function() {
          var modalInstance;
          $scope.unselectItem();
          $scope.wizardOptions = {
            "resource-type": $scope.resourceType,
            "form-item": {},
            "form-mode": "create",
            "reset-on-submit": true,
            "events": {
              'wizard-canceled': function(resource) {
                var ref;
                modalInstance.close();
                return csAlertService.addAlert(((ref = $scope.i18n) != null ? ref.t('alert.no_resource_created') : void 0) || 'translation missing', 'info');
              },
              'wizard-submited': function(resource) {
                var ref;
                pushNewItem($scope.collection, resource);
                if (!$scope.wizardOptions['keep-first']) {
                  modalInstance.close();
                }
                return csAlertService.addAlert(((ref = $scope.i18n) != null ? ref.t('alert.new_resource_created') : void 0) || 'translation missing', 'success');
              }
            }
          };
          angular.merge($scope.wizardOptions, $scope.csIndexOptions);
          modalInstance = $uibModal.open({
            scope: $scope,
            keyboard: false,
            backdrop: 'static',
            windowTopClass: 'modal-wizard',
            template: "<div cs-wizard cs-wizard-options=wizardOptions></div>",
            resolve: {
              dummy: function() {
                return $scope.dummy;
              }
            }
          });
          return modalInstance.result.then((function(selectedItem) {
            return $scope.selected = selectedItem;
          }), function() {
            return console.info('Modal dismissed at: ' + new Date());
          });
        };
        return pushNewItem = function(collection, item) {
          var newItem;
          newItem = item.constructor.$new();
          newItem.$clone(item);
          return collection.push(newItem);
        };
      };
    };
    return {
      restrict: 'E',
      compile: compile,
      templateUrl: 'components/cs-index/cs-index-template.html',
      scope: {
        csIndexOptions: '=',
        resourceType: '='
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
      return $scope.createDisabled = function() {
        return $scope.field.create_disabled;
      };
    };
    return build;
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
      templateUrl: 'components/cs-number/cs-number-template.html',
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
      $scope.defaultTemplate = 'components/cs-resource-input/cs-resource-input-template.html';
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
      $scope.$on('form-reset', function() {
        return $scope.model = {
          object: $scope.formItem.$association($scope.field)
        };
      });
      $rootScope.$on('form-submit', function(event, formItem) {
        var itemID;
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
          var relationships;
          $scope.associates = items;
          if (relationships = $scope.formItem.relationships[$scope.field.relationship]) {
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
        var ref, ref1;
        return $scope.createResources() && !((ref = $scope.formItem.relationships[$scope.field.relationship]) != null ? (ref1 = ref.data) != null ? ref1.id : void 0 : void 0);
      };
      refreshAndSelect = function(itemID) {
        var search_options;
        search_options = angular.merge({}, $scope.field.resource_endpoint);
        return $scope.resource.$search(null, search_options).then(function(items) {
          var base;
          $scope.associates = items;
          if ($scope.field.cardinality === 'one') {
            return $scope.model.object = _.findWhere(items, {
              id: itemID
            });
          } else {
            (base = $scope.model).object || (base.object = []);
            return $scope.model.object.push(_.findWhere(items, {
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
      $scope.defaultTemplate = 'components/cs-textfield/cs-textfield-template.html';
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
      templateUrl: 'components/cs-time/cs-time-template.html',
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
      if ($scope.panel.directive) {
        innerElement = angular.element(element[0]);
        inputTemplate = "<" + $scope.panel.directive + "\n  autocomplete=\"off\"\n  create-resources=\"shouldShowNewButton()\"\n  cs-form-options=\"csWizardOptions\"\n  form-item=\"panel.item\"\n  form-parent=\"panel.parent\"\n  form-mode=\"{{csWizardOptions['form-mode']}}\"\n  form-resource=\"panel.resource\"\n  form-resource-descriptor=\"resource_descriptor(panel)\"\n  role=\"form\"\n>";
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

app = angular.module('cloudStorm.datetime', ['ui.bootstrap']);

app.directive("csDatetime", [
  'uibDateParser', 'csSettings', 'CSInputBase', function(uibDateParser, csSettings, CSInputBase) {
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
        if (!angular.isDate(input_date)) {
          input_date = input_date.substring(0, input_date.length - 1);
        }
        console.log(input_date);
        date = uibDateParser.parse(new Date(input_date), date_format);
        return $scope.formItem.attributes[$scope.field.attribute] = date;
      }
    };
    link = function($scope, element, attrs, controller) {
      $scope.i18n = csSettings.settings['i18n-engine'];
      CSInputBase($scope);
      format_date($scope);
      return $scope.$watch('formItem.attributes[field.attribute]', function(newValue, oldValue) {
        if (newValue !== oldValue) {
          return $scope.$emit('input-value-changed', $scope.field);
        }
      });
    };
    return {
      restrict: 'E',
      templateUrl: 'cloudstorm/src/components/cs-datetime/cs-datetime-template.html',
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
        return new csDataStore(this);
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

angular.module('cloudStorm.localizationProvider', []).provider('csLocalization', [
  function() {
    var Localization, defaultTranslations, translations;
    defaultTranslations = {
      'false': 'Yes',
      'true': 'No',
      'new': 'New',
      'today': 'Today',
      'create_another': 'Create another',
      'validation_text': 'Some required fields (marked *) are not yet set',
      'buttons.cancel': 'Cancel',
      'buttons.close': 'Close',
      'buttons.submit': 'Submit',
      'buttons.delete': 'Delete',
      'index.empty': ' list empty',
      'buttons.new': 'New',
      'buttons.clear': 'Clear',
      'alert.nothing_changed': 'Nothing changed',
      'alert.changes_saved': 'Changes saved',
      'alert.error_happened': 'An error happened',
      'alert.no_resource_created': 'Nothing created',
      'alert.new_resource_created': 'New resource successfully created',
      'confirm.delete': "Are you sure you want to delete the item?",
      'filter_for_anything': 'Filter for anything'
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

      ResourceService.prototype.register = function(name, resource) {
        return resources[name] = resource;
      };

      register_dynamic_name = function(name, service_name) {
        return lookup_table[name] = service_name;
      };

      ResourceService.prototype.get = function(name) {
        var moduleName, resource;
        resource = resources[name];
        if (!resource) {
          moduleName = lookup_table[name] || ((camelCase(name)) + "Resource");
          resource = $injector.get(moduleName);
          if (resource) {
            this.register(name, resource);
          } else {
            throw "CS-001: cannot auto-inject " + name;
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
      var member_endpoint_template;
      if (!resource.member_endpoint) {
        return null;
      }
      member_endpoint_template = urltemplate.parse(resource.member_endpoint);
      return member_endpoint_template.expand({
        id: id
      });
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
          value_object = opts.value;
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
            objects = _.map(data.data, (function(i) {
              return new _this(i, {
                datastore: datastore
              });
            }));
            included = _.map(data.included, function(i) {
              var resource;
              resource = ResourceService.get(i.type);
              return new resource(i, {
                datastore: datastore
              });
            });
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
        return csRestApi.get(memberEndpointUrl(this, id), params).then((function(_this) {
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

      Resource.prototype.$reload = function() {
        var endpoint;
        endpoint = this.links.self.href || memberEndpointUrl(this.constructor, this.id);
        return csRestApi.get(endpoint, {}).then((function(_this) {
          return function(data) {
            return _this.$assign(data.data);
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
            return _this.$assign(data.data);
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

      Resource.prototype.$destroy = function(options) {
        var base_url, endpoint;
        if (options == null) {
          options = {};
        }
        endpoint = options.endpoint || memberEndpointUrl(this.constructor, this.id) || this.links.self.href;
        base_url = baseUrl(this.constructor);
        if (base_url) {
          endpoint = "" + base_url + endpoint;
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
        angular.merge(this, _.pick(value_object, "id", "type", "attributes", "relationships", "links"));
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
        angular.merge(this, _.pick(value_object, "id", "type", "attributes", "relationships", "links"));
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
        if (opts == null) {
          opts = {};
        }
        if (value) {
          if (angular.isArray(value)) {
            this.relationships[field.relationship] = {
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
      $http(request).success((function(_this) {
        return function(data, status, headers, config) {
          return deferred.resolve(data);
        };
      })(this)).error((function(_this) {
        return function(data, status, headers, config) {
          return deferred.reject(data);
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
      $http(request).success((function(_this) {
        return function(data, status, headers, config) {
          return deferred.resolve(data);
        };
      })(this)).error((function(_this) {
        return function(data, status, headers, config) {
          return deferred.reject(data);
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
      $http(request).success((function(_this) {
        return function(data, status, headers, config) {
          return deferred.resolve(data);
        };
      })(this)).error((function(_this) {
        return function(data, status, headers, config) {
          return deferred.reject({
            data: data,
            status: status
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
      $http(request).success((function(_this) {
        return function(data, status, headers, config) {
          return deferred.resolve(data);
        };
      })(this)).error((function(_this) {
        return function(data, status, headers, config) {
          return deferred.reject({
            data: data,
            status: status
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
      $http(request).success((function(_this) {
        return function(data, status, headers, config) {
          return deferred.resolve(data);
        };
      })(this)).error((function(_this) {
        return function(data, status, headers, config) {
          return deferred.reject({
            data: data,
            status: status
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
    var defaultSettings;
    defaultSettings = {
      'i18n-engine': csLocalizationProvider.$get(),
      'date-format': 'yyyy-MM-dd',
      'datetime-format': 'yyyy-MM-ddThh:mm:ss.sss',
      'time-zone-offset': 'utc'
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

app = angular.module('cloudStorm', ['cloudStorm.alertService', 'cloudStorm.alert', 'cloudStorm.field', 'cloudStorm.form', 'cloudStorm.index', 'cloudStorm.index.sidePanel', 'cloudStorm.wizard', 'cloudStorm.checkbox', 'cloudStorm.date', 'cloudStorm.time', 'cloudStorm.datetime', 'cloudStorm.enum', 'cloudStorm.number', 'cloudStorm.resourceInput', 'cloudStorm.textfield', 'cloudStorm.inputBase', 'cloudStorm.dataStore', 'cloudStorm.localizationProvider', 'cloudStorm.resource', 'cloudStorm.resourceService', 'cloudStorm.restApi', 'cloudStorm.settings', 'cloudStorm.templateService', 'cloudStorm.templates', 'ui.bootstrap']);

angular.module('cloudStorm.templates', ['components/cs-alert/cs-alert-template.html', 'components/cs-checkbox/cs-checkbox-template.html', 'components/cs-date/cs-date-template.html', 'components/cs-datetime/cs-datetime-template.html', 'components/cs-enum/cs-enum-template.html', 'components/cs-field/cs-field-template.html', 'components/cs-form/cs-form-template.html', 'components/cs-index/cs-index-sidepanel/cs-index-sidepanel-template.html', 'components/cs-index/cs-index-template.html', 'components/cs-number/cs-number-template.html', 'components/cs-resource-input/cs-resource-input-template.html', 'components/cs-textfield/cs-textfield-template.html', 'components/cs-time/cs-time-template.html', 'components/cs-wizard/cs-wizard-panel-template.html', 'components/cs-wizard/cs-wizard-template.html']);

angular.module("components/cs-alert/cs-alert-template.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/cs-alert/cs-alert-template.html",
    "<uib-alert close='csAlertService.dismissAlert(alert.id)' dismiss-on-timeout='{{csAlertService.timeoutForAlert(alert)}}' ng-click='csAlertService.dismissAlert(alert.id)' ng-repeat='alert in csAlertService.getAlerts()' type='{{alert.type}}'>\n" +
    "  {{alert.message}}\n" +
    "</uib-alert>\n" +
    "");
}]);

angular.module("components/cs-checkbox/cs-checkbox-template.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/cs-checkbox/cs-checkbox-template.html",
    "<!-- Only valid for cardinality:one -->\n" +
    "<input class='form-control' ng-disabled='fieldDisabled()' ng-model='formItem.attributes[field.attribute]' type='checkbox'>\n" +
    "");
}]);

angular.module("components/cs-date/cs-date-template.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/cs-date/cs-date-template.html",
    "<input autocomplete='off' class='form-control' clear-text=\"{{ i18n.t('buttons.clear') }}\" close-text=\"{{ i18n.t('buttons.close') }}\" current-text=\"{{ i18n.t('today') }}\" datepicker-append-to-body='true' datepicker-options='{startingDay: 1, showWeeks: false}' is-open='dt.open' ng-click='dt.open = true' ng-disabled='fieldDisabled()' ng-model-options='getModelOptions()' ng-model='formItem.attributes[field.attribute]' ng-required='fieldRequired()' type='text' uib-datepicker-popup=''>\n" +
    "");
}]);

angular.module("components/cs-datetime/cs-datetime-template.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/cs-datetime/cs-datetime-template.html",
    "<div class='container-flex'>\n" +
    "  <input autocomplete='off' class='form-control first' clear-text=\"{{ i18n.t('buttons.clear') }}\" close-text=\"{{ i18n.t('buttons.close') }}\" current-text=\"{{ i18n.t('today') }}\" datepicker-append-to-body='true' datepicker-options='{startingDay: 1, showWeeks: false}' is-open='dt.open' ng-click='dt.open = true' ng-disabled='fieldDisabled()' ng-model-options='getModelOptions()' ng-model='formItem.attributes[field.attribute]' ng-required='fieldRequired()' type='text' uib-datepicker-popup=''>\n" +
    "  <div ng-disabled='fieldDisabled()' ng-model-options='getModelOptions()' ng-model='formItem.attributes[field.attribute]' ng-required='fieldRequired()' show-spinners='false' uib-timepicker=''></div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/cs-enum/cs-enum-template.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/cs-enum/cs-enum-template.html",
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

angular.module("components/cs-field/cs-field-template.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/cs-field/cs-field-template.html",
    "<!-- CloudStorm Form Field component -->\n" +
    "<!-- Renders different kind of inputs for different types of items -->\n" +
    "<div class='cs-field-inner'>\n" +
    "  <label class='control-label'>{{field.label}}</label>\n" +
    "  <span ng-if='field.required'>*</span>\n" +
    "  <!-- CS will populate the correct input taking into account its overrides -->\n" +
    "  <div class='cs-input-wrapper'></div>\n" +
    "  <span class='help-block' ng-if='field.errors.length &gt; 0'>\n" +
    "    {{getError(field)}}\n" +
    "  </span>\n" +
    "  <span class='help-block' ng-if='(!(field.errors.length &gt; 0) &amp;&amp; (getHint(field)))'>\n" +
    "    {{getHint(field)}}\n" +
    "  </span>\n" +
    "  <div class='cover'></div>\n" +
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
    "</div>\n" +
    "<form name='csForm' ng-transclude='fields' novalidate=''>\n" +
    "  <cs-field class='form-group field' create-resources='createResources()' cs-field-options='csFormOptions' field='field' form-item='editableItem' form-mode='formMode' ng-repeat='field in fields track by $index' ng-show='isFieldVisible(field.attribute)'></cs-field>\n" +
    "</form>\n" +
    "<div class='form-group form-actions' ng-transclude='actions'>\n" +
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
    "  <div class='col-lg-12' ng-switch='listIsEmpty()'>\n" +
    "    <div class='row page-header'>\n" +
    "      <h1>\n" +
    "        {{ header }}\n" +
    "        <small ng-bind='subHeader'></small>\n" +
    "        <div class='header-actions pull-right'>\n" +
    "          <div class='input-group-wrap'>\n" +
    "            <div class='input-group'>\n" +
    "              <div class='input-group-addon'>\n" +
    "                <span class='glyphicon glyphicon-search'></span>\n" +
    "              </div>\n" +
    "              <input class='form-control cs-index-filter' ng-model='csIndexOptions.filterValue' placeholder=\"{{ i18n.t('filter_for_anything') }}\" type='text'>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "          <button class='btn btn-default' ng-click='refreshIndex()' type='button'>\n" +
    "            <span class='glyphicon glyphicon-refresh'></span>\n" +
    "          </button>\n" +
    "          <button class='btn btn-primary create-button' ng-click='openNewResourcePanel()' ng-disabled='createDisabled()' type='button'>\n" +
    "            {{ i18n.t('buttons.new') }}\n" +
    "          </button>\n" +
    "        </div>\n" +
    "      </h1>\n" +
    "    </div>\n" +
    "    <div class='row' ng-switch-when='true'>\n" +
    "      <div class='well well-lg'>\n" +
    "        {{header}} {{ i18n.t('index.empty') }}\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class='row' ng-switch-when='false'>\n" +
    "      <div class='index-table' ng-class=\"{ 'col-lg-8' : sidePanelIsVisible() &amp;&amp; !viewIsCompressed(),&#x000A;'col-lg-6' : viewIsCompressed() }\">\n" +
    "        <div class='table-responsive'>\n" +
    "          <table class='table table-striped table-hover'>\n" +
    "            <thead>\n" +
    "              <tr>\n" +
    "                <!-- TODO: static header -->\n" +
    "                <th ng-click='changeSorting(column)' ng-if='columnVisible(column, $index)' ng-repeat='column in columns track by $index'>\n" +
    "                  {{column.label}}\n" +
    "                  <span class='glyphicon glyphicon-triangle-top' ng-if='csIndexOptions.sortAttribute==column.attribute &amp;&amp; !csIndexOptions.sortReverse'></span>\n" +
    "                  <span class='glyphicon glyphicon-triangle-bottom' ng-if='csIndexOptions.sortAttribute==column.attribute &amp;&amp; csIndexOptions.sortReverse'></span>\n" +
    "                </th>\n" +
    "                <th class='actions' ng-hide=\"csIndexOptions['hide-actions']\"></th>\n" +
    "              </tr>\n" +
    "            </thead>\n" +
    "            <tbody>\n" +
    "              <tr ng-class=\"{'info' : csIndexOptions.selectedItem.id == item.id}\" ng-click='selectItem(item)' ng-dblclick='selectItem(item)' ng-repeat='item in collection | orderBy:comparisonValue:csIndexOptions.sortReverse | filter:filterComparison track by $index '>\n" +
    "                <td ng-if='columnVisible(column, $index)' ng-repeat='column in columns track by $index'>\n" +
    "                  {{ fieldValue(item, column) }}\n" +
    "                </td>\n" +
    "                <td class='actions' ng-hide=\"csIndexOptions['hide-actions']\">\n" +
    "                  <!-- DELETE --><div class='action delete-action' ng-click='destroyItem($event, item)'>{{ i18n.t('buttons.delete') }}</div></td>\n" +
    "              </tr>\n" +
    "            </tbody>\n" +
    "          </table>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <cs-index-sidepanel cs-index-sidepanel-options='csIndexOptions' item='csIndexOptions.selectedItem' ng-class=\"{ 'col-lg-4' : !viewIsCompressed() &amp;&amp; sidePanelIsVisible(),&#x000A;'col-lg-6' : viewIsCompressed() }\" ng-if='sidePanelIsVisible()' panel-number-callback='getPanelNumber' resource-type='resourceType' unselect-item='unselectItem()'></cs-index-sidepanel>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/cs-number/cs-number-template.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/cs-number/cs-number-template.html",
    "<input class='form-control' ng-disabled='fieldDisabled()' ng-model='formItem.attributes[field.attribute]' ng-required='fieldRequired()' type='number'>\n" +
    "");
}]);

angular.module("components/cs-resource-input/cs-resource-input-template.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/cs-resource-input/cs-resource-input-template.html",
    "<div class='input-group cs-resource-input-group' ng-if=\"field.cardinality == 'one'\">\n" +
    "  <ui-select close-on-select='true' ng-disabled='fieldDisabled()' ng-model='model.object' ng-required='fieldRequired()'>\n" +
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
    "<div class='input-group cs-resource-input-group' ng-if=\"field.cardinality == 'many'\">\n" +
    "  <ui-select append-to-body='true' close-on-select='true' multiple ng-disabled='fieldDisabled()' ng-model='model.object' ng-required='fieldRequired()' ui-select-override=''>\n" +
    "    <ui-select-match allow-clear>\n" +
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
    "  <span class='input-group-btn' ng-if='createResources() &amp;&amp; !createDisabled()'>\n" +
    "    <button class='btn btn-default' ng-click='pushPanel()' ng-disabled='fieldDisabled()' type='button'>{{ i18n.t('buttons.new') }}</button>\n" +
    "  </span>\n" +
    "</div>\n" +
    "<div class='cover'></div>\n" +
    "");
}]);

angular.module("components/cs-textfield/cs-textfield-template.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/cs-textfield/cs-textfield-template.html",
    "<!-- ng-if creates an isolate scope so all data is available through $parent -->\n" +
    "<!-- %ui-select-choices is only here to disable typeahed dropdown as there should be not typeahed in this controller -->\n" +
    "<input class='form-control' ng-disabled='fieldDisabled()' ng-if=\"field.cardinality == 'one'\" ng-keyup='keyPressed($event)' ng-model='$parent.formItem.attributes[$parent.field.attribute]' ng-required='fieldRequired()' type='text'>\n" +
    "<ui-select multiple='' ng-disabled='fieldDisabled()' ng-if=\"field.cardinality == 'many'\" ng-model='$parent.formItem.attributes[$parent.field.attribute]' ng-required='fieldRequired()' tagging-label='newTag' tagging=''>\n" +
    "  <ui-select-match>\n" +
    "    <span>\n" +
    "      {{$item}}\n" +
    "    </span>\n" +
    "  </ui-select-match>\n" +
    "  <ui-select-choices repeat='item in []'></ui-select-choices>\n" +
    "</ui-select>\n" +
    "");
}]);

angular.module("components/cs-time/cs-time-template.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/cs-time/cs-time-template.html",
    "<div ng-disabled='fieldDisabled()' ng-model-options='getModelOptions()' ng-model='formItem.attributes[field.attribute]' ng-required='fieldRequired()' show-spinners='false' uib-timepicker=''></div>\n" +
    "");
}]);

angular.module("components/cs-wizard/cs-wizard-panel-template.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/cs-wizard/cs-wizard-panel-template.html",
    "<div autocomplete='off' create-resources='shouldShowNewButton()' cs-form-options='csWizardOptions' cs-form='' form-item='panel.item' form-mode='{{panel.formMode}}' form-parent='panel.parent' form-resource-descriptor='resource_descriptor(panel)' form-resource='panel.resource' role='form' wizard-panel-index='panelIndex'></div>\n" +
    "");
}]);

angular.module("components/cs-wizard/cs-wizard-template.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/cs-wizard/cs-wizard-template.html",
    "<div class='form-panel animation' ng-class=\"{'active' : $index==panelStack.length-1,&#x000A;'pre-hover' : panel.hoverOrder &lt; 0,&#x000A;'hover' : panel.hoverOrder==0, 'post-hover' : panel.hoverOrder &gt; 0 }\" ng-init='panelIndex = $index' ng-mouseover='panelHover($index)' ng-repeat='panel in panelStack track by $index'>\n" +
    "  <cs-wizard-panel></cs-wizard-panel>\n" +
    "</div>\n" +
    "");
}]);

//# sourceMappingURL=cloudstorm.js.map