"use strict"

app = angular.module("cloudStorm.templateService", [])

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