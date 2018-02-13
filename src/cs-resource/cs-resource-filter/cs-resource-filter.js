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
