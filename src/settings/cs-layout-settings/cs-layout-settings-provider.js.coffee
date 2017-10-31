"use strict"

app = angular.module("cloudStorm.layoutSettings", [])

###############################################################################

app.provider 'csLayoutSettings', [() ->


  @style = {

    'csField' : {
      horizontal : {
        contaner : "cont_h",
        field1 : "field1_h",
        field2 : "field2_h"
      },
      vertical : {
        contaner : "cont_h",
        field1 : "field1_h",
        field2 : "field2_h"
      }
    }
  }

  @$get = ->
    @

  return

]
