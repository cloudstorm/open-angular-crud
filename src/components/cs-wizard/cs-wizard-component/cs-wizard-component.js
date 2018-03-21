var app

app = angular.module("cloudStorm.wizardComponent", [])

app.component("csWizardComponent", {

    bindings : {
        resourceType : "<",
        itemId : "<",
        pageType : "<",
    },
    templateUrl : "components/cs-wizard/cs-wizard-component/cs-wizard-component-template.html",
    controller : [ function(){
        this.loading = true
    }]
})
