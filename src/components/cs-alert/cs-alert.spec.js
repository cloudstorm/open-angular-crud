describe('csAlert', function() {
  var $compile;
  var $rootScope;
  var csAlertService;
  var $templateCache;



  beforeEach(angular.mock.module('hamlTemplates'));
  beforeEach(angular.mock.module('cloudStorm.alertService'));
  beforeEach(angular.mock.module('cloudStorm.alert'));

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function(_$compile_, _$rootScope_, _$templateCache_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $templateCache = _$templateCache_
  }));

  beforeEach(inject(function (_csAlertService_) {
    csAlertService = _csAlertService_;
  }));

  beforeEach(inject(function ($templateCache) { $templateCache.put('components/cs-alert/cs-alert-template.html', "<uib-alert close='csAlertService.dismissAlert(alert.id)' dismiss-on-timeout='{{csAlertService.timeoutForAlert(alert)}}' ng-click='csAlertService.dismissAlert(alert.id)' ng-repeat='alert in csAlertService.getAlerts()' type='{{alert.type}}'> {{alert.message}} </uib-alert>"); }));

  it('Replaces the element with the appropriate content', function() {
    csAlertService.addAlert('test alert 1');
    csAlertService.addAlert('test alert 2');
    csAlertService.addAlert('test alert 3');

    template = $templateCache.get('components/cs-alert/cs-alert-template.html');
    console.log('-------------------- template:')
    console.log(template)

    template = $templateCache.get('components/cs-alert/cs-alert-template.haml');
    console.log('-------------------- template (haml):')
    console.log(template)

    // Compile a piece of HTML containing the directive
    var html = '<cs-alert></cs-alert>';
    var element = angular.element(html);
    console.log('-------------------- element:')
    console.log(element)
    var compiled = $compile(element)($rootScope);
    console.log('-------------------- compiled:')
    console.log(compiled)

    // fire all the watches, so the scope expressions will be evaluated
    $rootScope.$digest();

    console.log('-------------------- digested:')
    console.log(compiled)

    // Check that the compiled element contains the desired content
    expect(compiled.html()).toContain("test alert 1");
    expect(compiled.html()).toContain("test alert 2");
    expect(compiled.html()).toContain("test alert 3");
  });

  it('Does not show up if directive is missing' , function() {
    csAlertService.addAlert('test alert 1');
    csAlertService.addAlert('test alert 2');
    csAlertService.addAlert('test alert 3');

    // Compile a piece of HTML containing the directive
    var element = $compile("<body></body>")($rootScope);

    // fire all the watches, so the scope expressions will be evaluated
    $rootScope.$digest();

    // Check that the compiled element contains the desired content
    expect(element.html()).not.toContain("test alert 1");
    expect(element.html()).not.toContain("test alert 2");
    expect(element.html()).not.toContain("test alert 3");
  });

  it('Disappears when alert is dismissed.', function() {
    csAlertService.addAlert('test alert 1');
    csAlertService.addAlert('test alert 2');
    csAlertService.addAlert('test alert 3');

    // Compile a piece of HTML containing the directive
    var element = $compile("<cs-alert></cs-alert>")($rootScope);

    // fire all the watches, so the scope expressions will be evaluated
    $rootScope.$digest();

    // Check that the compiled element contains the desired content
    expect(element.html()).toContain("test alert 1");
    expect(element.html()).toContain("test alert 2");
    expect(element.html()).toContain("test alert 3");

    csAlertService.dismissAlert(0);

    // fire all the watches, so the scope expressions will be evaluated
    $rootScope.$digest();

    // Check that the compiled element contains the desired content
    expect(element.html()).not.toContain("test alert 1");
    expect(element.html()).toContain("test alert 2");
    expect(element.html()).toContain("test alert 3");
  });

  // it('Disappears when alert is clicked.', function() {
  //   csAlertService.addAlert('test alert 1');
  //   csAlertService.addAlert('test alert 2');
  //   csAlertService.addAlert('test alert 3');

  //   // Compile a piece of HTML containing the directive
  //   var element = $compile("<cs-alert></cs-alert>")($rootScope);

  //   // fire all the watches, so the scope expressions will be evaluated
  //   $rootScope.$digest();

  //   // Check that the compiled element contains the desired content
  //   expect(element.html()).toContain("test alert 1");
  //   expect(element.html()).toContain("test alert 2");
  //   expect(element.html()).toContain("test alert 3");

  //   var aTags = element[0].getElementsByTagName("div");
  //   console.log(aTags.length);
  //   var searchText = "test alert 1";
  //   var found = 222;

  //   for (var i = 0; i < aTags.length; i++) {
  //     if (aTags[i].textContent == searchText) {
  //       found = aTags[i];
  //       break;
  //     }
  //   }

  //   console.log(found)

  //   console.log('-------------------------------')
  //   console.log(element[0].querySelectorAll('.alert'))
  //   console.log('-------------------------------')

  //   //closeButton.triggerHandler('click');

  //   // fire all the watches, so the scope expressions will be evaluated
  //   $rootScope.$digest();

  //   // Check that the compiled element contains the desired content
  //   expect(element.html()).not.toContain("test alert 1");
  //   expect(element.html()).toContain("test alert 2");
  //   expect(element.html()).toContain("test alert 3");
  // });
});
