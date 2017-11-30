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

  this.success = function(msgType) {
    return this.addAlert(this.getText(msgType), 'success');
  };

  this.info = function(msgType) {
    return this.addAlert(this.getText(msgType), 'info');
  };

  this.warning = function(msgType) {
    return this.addAlert(this.getText(msgType), 'warning');
  };

  this.danger = function(msgType) {
    return this.addAlert(customMessage || this.getText(msgType), 'danger');
  };

  this.getText = function(type) {
    return this.i18n.t('alert.' + type) || 'translation missing';
  };

  this.dismissAlert = function(idToDismiss) {
    return this.alerts = _.without(this.alerts, _.findWhere(this.alerts, {
      id: idToDismiss
    }));
  };

  window.csAlerts = this;

}])
