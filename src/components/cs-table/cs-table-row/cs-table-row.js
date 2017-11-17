"use strict"

var app = angular.module('cloudStorm.tableRow', [])

app.component('csTableRow', {

  templateUrl : 'components/cs-table/cs-table-row/cs-table-row-template.html',

  controller : function(csSettings, $filter, $element){

    this.i18n = csSettings.settings['i18n-engine']

    this.$onInit = function() {
      $element.addClass('cs-table-row')
      //TODO - Later the different field directive must be prepared if the
      //options input is not defined. i.e. the cs-date would throw and error.
      this.fieldOptions = {}
      console.log("tableRow")
      console.log(this)
    };

    this.showItem = function(){
      this.showItem_({item : this.item})
    }

    this.selectItem = function(){
      this.selectItem_({item : this.item})
    }

    this.destroyItem = function(event){
      this.destroyItem_({event : event, item : this.item})
    }

    this.fieldValue = function(field) {
      var item = this.item
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
  },
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
