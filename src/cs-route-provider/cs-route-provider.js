"use strict";
var app;

app = angular.module('cloudStorm.routeProvider', []);

app.provider('csRoute', [
  '$stateProvider', 'csSettingsProvider', function($stateProvider, csSettingsProvider) {

    this.go = function(type, params, options) {
      this.params = params;
      if (this.state) {
        return this.state.go(csSettingsProvider.settings['router-path-prefix'] + type, params, options);
      } else {
        console.log('No current router state, cannot navite to', type, params, options)
      }
    };

    this.setState = function(state) {
      return this.state = state;
    };

    this.getState = function() {
      return this.params;
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
