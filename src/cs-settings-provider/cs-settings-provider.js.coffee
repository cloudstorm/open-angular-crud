"use strict"

app = angular.module("cloudStorm.settings", [])

###############################################################################

app.provider 'csSettings', ['csLocalizationProvider', (csLocalizationProvider) ->
  
  defaultSettings = {
    'i18n-engine': csLocalizationProvider.$get()
    'date-format': 'yyyy-MM-dd'
    'datetime-format': 'yyyy-MM-ddThh:mm:ss.sss'
    'time-zone-offset': 'utc'
  }
  
  @settings = defaultSettings

  @set = (option, value) ->
    @settings[option] = value
    return

  @$get = ->
    @

  return

]
