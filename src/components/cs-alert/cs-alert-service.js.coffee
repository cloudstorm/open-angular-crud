"use strict"

app = angular.module('cloudStorm.alertService', [])

# ===== SERVICE ===============================================================

app.service 'csAlertService', ['csSettings', (csSettings) ->

  @i18n = csSettings.settings['i18n-engine']
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

  @success = (msgType) ->
    @addAlert(@getText(msgType), 'success')

  @info = (msgType) ->
    @addAlert(@getText(msgType), 'info')

  @warning = (msgType) ->
    @addAlert(@getText(msgType), 'warning')

  @getText = (type) ->
    @i18n.t('alert.' + type) || 'translation missing'

  @dismissAlert = (idToDismiss) ->
    @alerts = _.without @alerts, _.findWhere(@alerts, {id: idToDismiss})

  # For debug purposes
  window.csAlerts = this
]
