"use strict"

defaultAbilities =

  'superadmin':
    actions:
      APPEND_TO_SEQUENCE: true
      ASSIGN_ANALYST: true
      CREATE_SAMPLES: true
      CROSSCHECK_SAMPLES: true
      DELETE_SAMPLES: true
      EDIT_SAMPLES: true
      EXECUTE_PLANNING: true
      REORDER_PLANNER_CARDS: true
      REORDER_WORKFLOW_CARDS: true
      SEE_COMPETENCIES: true
      SEE_INSTRUMENT_TYPES: true
      SEE_ELUENT_STABILIZATIONS: true
      SEE_GROUPS: true
      SEE_INSTRUMENTS: true
      SEE_LABORATORIES: true
      SEE_LEAN_TABLE: true
      SEE_MATERIAL_BASES: true
      SEE_MATERIALS: true
      SEE_MEASUREMENTS: true
      SEE_PACKAGINGS: true
      SEE_POTENCIES: true
      SEE_PROCEDURES: true
      SEE_PRODUCT_MASTER_LIST: true
      SEE_PRODUCT_TYPES: true
      SEE_STORAGE_ENVIRONMENTS: true
      SEE_USERS: true
      SEE_WORK_OF_OTHERS: true
      SEE_WORKFLOW: true
      SET_ANALYST_AVAILABILITY: true
      SET_INSTRUMENT_AVAILABILITY: true
      SET_SAMPLE_CLOSED: true
      SPLIT_SEQUENCE: true
    resources: #example
      product:
        create: true

  'laboratory_manager':
    actions:
      CREATE_LABORATORY_SAMPLES: true
      EDIT_SAMPLES: true
      SEE_MATERIAL_BASES: true
      SEE_MATERIALS: true
      SEE_MEASUREMENTS: true
      SEE_PRODUCT_TYPES: true

  'lead_analyst':
    actions:
      APPEND_TO_SEQUENCE: true
      ASSIGN_ANALYST: true
      CREATE_SAMPLES: true
      DELETE_SAMPLES: true
      EDIT_SAMPLES: true
      EXECUTE_PLANNING: true
      REORDER_PLANNER_CARDS: true
      REORDER_WORKFLOW_CARDS: true
      SEE_COMPETENCIES: true
      SEE_INSTRUMENT_TYPES: true
      SEE_ELUENT_STABILIZATIONS: true
      SEE_INSTRUMENTS: true
      SEE_LEAN_TABLE: true
      SEE_MATERIAL_BASES: true
      SEE_MATERIALS: true
      SEE_MEASUREMENTS: true
      SEE_PACKAGINGS: true
      SEE_POTENCIES: true
      SEE_PROCEDURES: true
      SEE_PRODUCT_TYPES: true
      SEE_STORAGE_ENVIRONMENTS: true
      SEE_USERS: true
      SEE_WORK_OF_OTHERS: true
      SEE_WORKFLOW: true
      SET_ANALYST_AVAILABILITY: true
      SET_INSTRUMENT_AVAILABILITY: true
      SET_SAMPLE_CLOSED: true
      SPLIT_SEQUENCE: true
    resources: {}

  'analyst':
    actions:
      ANALYZE_SAMPLES: true
      APPEND_TO_SEQUENCE: true
      CREATE_SAMPLES: true
      EDIT_SAMPLES: true
      REORDER_PLANNER_CARDS: true
      REORDER_WORKFLOW_CARDS: true
      SEE_INSTRUMENT_TYPES: true
      SEE_ELUENT_STABILIZATIONS: true
      SEE_INSTRUMENTS: true
      SEE_LEAN_TABLE: true
      SEE_MATERIAL_BASES: true
      SEE_MATERIALS: true
      SEE_MEASUREMENTS: true
      SEE_PACKAGINGS: true
      SEE_POTENCIES: true
      SEE_PROCEDURES: true
      SEE_PRODUCT_TYPES: true
      SEE_STORAGE_ENVIRONMENTS: true
      SEE_WORKFLOW: true
      SPLIT_SEQUENCE: true
    resources: {}

  'admin':
    actions:
      SEE_USERS: true
    resources: {}

  'observer':
    actions:
      SEE_WORK_OF_OTHERS: true
      SEE_WORKFLOW: true
      SEE_LEAN_TABLE: true
    resources: {}

  'validator':
    actions:
      CROSSCHECK_SAMPLES: true
      SEE_WORKFLOW: true
    resources: {}


# =============================================================================

app = angular.module("todoList.services")
app.service "UserAbility", [ "User", (User) ->

  class UserAbility
    @abilities: defaultAbilities || {}

    @changeAbility: (role, action, value) ->
      if role is '*'
        for i_role, abilities of @abilities
          abilities.actions[action] = value
      else
        @abilities[role].actions[action] = value

    @setAbilities: (newAbilities) ->
      @abilities = newAbilities

    @can: (action, user = User.current) ->
      availableRoles = user.roles
      if !action
        return false
      else
        if window.applicationVersion == "development"
          _.find availableRoles, (role) =>
            roleAbilities = @abilities[role]
            roleAbilities?.actions[action] == true
        else
          _.find availableRoles, (role) =>
            @abilities[role].actions[action] == true

]
