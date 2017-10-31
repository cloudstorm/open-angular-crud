"use strict"

app = angular.module("cloudStorm.layoutSettings", [])

###############################################################################

app.provider 'csLayoutSettings', [() ->


  @style = {

    'csField' : {
      horizontal : {
        container : "cont_h",
        field1 : "field1_h",
        field2 : "field2_h"
      },
      vertical : {
        container : "cont_v",
        field1 : "field1_v",
        field2 : "field2_v"
      }
    }
  }

  @$get = ->
    @

  return

]
