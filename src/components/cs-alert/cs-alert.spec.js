describe('csAlert', function() {
  var $compile;
  var $rootScope;
  var csAlertService;

  // load templates
  beforeEach(angular.mock.module('hamlTemplates'));

  // load required modules
  beforeEach(angular.mock.module('cloudStorm.alertService'));
  beforeEach(angular.mock.module('cloudStorm.alert'));

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function(_$compile_, _$rootScope_, _csAlertService_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    csAlertService = _csAlertService_;
  }));

  it('Replaces the element with the appropriate content', function() {
    csAlertService.addAlert('test alert 1', 'success');
    csAlertService.addAlert('test alert 2', 'info');
    csAlertService.addAlert('test alert 3', 'warning');

    // Compile a piece of HTML containing the directive
    var html = '<cs-alert></cs-alert>';
    var element = angular.element(html);
    var compiled = $compile(element)($rootScope);

    // fire all the watches, so the scope expressions will be evaluated
    $rootScope.$digest();

    // Check that the compiled element contains the desired content
    expect(compiled.html()).toContain("test alert 1");
    expect(compiled.html()).toContain("test alert 2");
    expect(compiled.html()).toContain("test alert 3");
  });

  it('Does not show up if directive is missing' , function() {
    csAlertService.addAlert('test alert 1', 'danger');
    csAlertService.addAlert('test alert 2', 'success');
    csAlertService.addAlert('test alert 3', 'info');

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

  it('Disappears when alert is clicked.', function() {
    csAlertService.addAlert('test alert 1', 'danger');
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

    // click test alert 1 TODO: move this to a function...
    var alerts = element[0].getElementsByTagName("uib-alert");
    var searchText = "test alert 1";
    var testAlert1;

    for (var i = 0; i < alerts.length; i++) {
      if (alerts[i].textContent.indexOf(searchText) !== -1) {
        testAlert1 = alerts[i];
        break;
      }
    }
    expect(testAlert1).toBeDefined();
    testAlert1.click();

    // Check that the compiled element contains the desired content
    expect(element.html()).not.toContain("test alert 1");
    expect(element.html()).toContain("test alert 2");
    expect(element.html()).toContain("test alert 3");
  });
});
