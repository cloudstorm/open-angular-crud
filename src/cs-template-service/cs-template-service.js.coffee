"use strict"

# ===== SETUP =================================================================

# Make sure that the components module is defined only once
try
  # Module already defined, use it
  app = angular.module("cloudStorm")
catch err
  # Module not defined yet, define it
  app = angular.module('cloudStorm', [])

app.factory 'CSTemplateService', [() ->

  class CSTemplateService
    
    getTemplateUrl: (field, options, defaultTemplate) ->
      template = defaultTemplate
      
      if (overrides = options['template-overrides']) 
  
        _(overrides).forEach (override) ->
          if (override.type == field.type) && override.template
            template = override.template

        # Attribute override has precedence over type, let's iterate again
        _(overrides).forEach (override) ->
          if (override.attribute == field.attribute) && override.template
            template = override.template
            
      template

  return new CSTemplateService
]