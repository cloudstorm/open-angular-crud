'use strict'

var app;

app = angular.module('cloudStorm.resourceFilter', [])

app.factory('csResourceFilter', function(csSettings){

  this.i18n = csSettings.settings['i18n-engine']

  this.sort = function(array, column, desc){
    var fieldValue;
    var array = _.sortBy(array, (function(item){
      fieldValue = this.fieldValue(item, column)
      if(fieldValue)
        fieldValue = fieldValue.toLowerCase()
      return fieldValue
    }).bind(this))

    if(desc){
      array = array.reverse()
    }
    return array
  }

  this.fieldValue = function(item, field) {

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
      return ((ref = this.i18n) != null ? ref.t(item.attributes[field.attribute]) : void 0) || item.attributes[field.attribute];
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

  return this
})
