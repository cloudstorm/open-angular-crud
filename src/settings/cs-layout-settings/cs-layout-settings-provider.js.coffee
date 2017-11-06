"use strict"

app = angular.module("cloudStorm.layoutSettings", [])

###############################################################################

app.provider 'csLayoutSettings', [() ->

  @style = {

    'csField' : {
      alignment : {
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
      mode : {
        create : {
          req_star : "show"
        },
        edit : {
          req_star : "show"
        },
        show : {
          req_star : "hide"
        }
      }
    }
  }

  @$get = ->
    @

  return

]
