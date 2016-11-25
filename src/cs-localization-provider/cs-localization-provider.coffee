angular.module('cloudStorm.localizationProvider', [])

####################################################################################################
# A simple key-value lookup base translation service

.provider 'csLocalization', [ () ->
  
####################################################################################################

  defaultTranslations = {
    'false': 'Yes'
    'true': 'No'
    'new': 'New'
    'today': 'Today'
    'create_another': 'Create another'
    'validation_text': 'Some required fields (marked *) are not yet set'
    'buttons.cancel': 'Cancel'
    'buttons.close': 'Close'
    'buttons.submit': 'Submit'
    'buttons.delete': 'Delete'
    'buttons.new': 'New'
    'buttons.clear': 'Clear'
    'alert.nothing_changed': 'Nothing changed'
    'alert.changes_saved': 'Changes saved'
    'alert.error_happened': 'An error happened'
    'alert.no_resource_created': 'Nothing created'
    'alert.new_resource_created': 'New resource successfully created'
    'filter_for_anything': 'Filter for anything'
  }
  
  translations = defaultTranslations

  ##################################################################################################

  Localization = {
    add: (string, translation) -> translations[string] = translation
    t:   (key) -> translations[key] || key
  }

  ##################################################################################################

  $get: -> Localization

####################################################################################################

]