describe('csAlert', function() {
  var $compile;
  var $rootScope;
  var csAlertService;

  beforeEach(angular.mock.module('hamlTemplates'));
  beforeEach(angular.mock.module('cloudStorm.alertService'));
  beforeEach(angular.mock.module('cloudStorm.alert'));

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function(_$compile_, _$rootScope_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  beforeEach(inject(function (_csAlertService_) {
    csAlertService = _csAlertService_;
  }));

  it('Replaces the element with the appropriate content', function() {
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
  });
});
