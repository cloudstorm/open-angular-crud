#= require_self
#= require_tree .


# ===== SETUP =================================================================

# Make sure that the components module is defined only once
try
  # Module already defined, use it
  app = angular.module("cloudStorm")
catch err
  # Module not defined yet, define it
 app = angular.module('cloudStorm', [])

# ===== DEFAULTS ==============================================================

app.config([
  'csSettingsProvider', 'csLocalizationProvider'
  (csSettingsProvider, csLocalizationProvider) ->
    csSettingsProvider.set('i18n-engine', csLocalizationProvider.$get())
])