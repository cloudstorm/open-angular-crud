"use strict"

app = angular.module('cloudStorm.alertService', [])

# ===== SERVICE ===============================================================

app.service 'csAlertService', [() ->
  @sequence = 0
  @alerts = []
  
  @getAlerts = () ->
    if @alerts
      @alerts
    else
      []
  
  @timeoutForAlert = (alert) ->
    switch alert.type
      when 'success' then 3500
      when 'info'    then 3500
      when 'warning' then 3500
      when 'danger'  then 3500

  @addAlert = (message, type = 'warning') ->
    unless @alerts
      @alerts = []
    @alerts.push {id:@sequence, message: message, type: type}
    @sequence++
  
  @dismissAlert = (idToDismiss) ->
    @alerts = _.without @alerts, _.findWhere(@alerts, {id: idToDismiss})
    
  # For debug purposes
  window.csAlerts = this
]