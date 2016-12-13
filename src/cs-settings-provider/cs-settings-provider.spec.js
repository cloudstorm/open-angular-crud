describe('csSettings', function() {

  var csSettings;
  var csLocalization;

  beforeEach(angular.mock.module('cloudStorm.localizationProvider'));
  beforeEach(angular.mock.module('cloudStorm.settings'));

  beforeEach(inject(function (_csSettings_, _csLocalization_) {
    csSettings = _csSettings_;
    csLocalization = _csLocalization_
  }));

  it('should exist', function() {
    expect(csSettings).toBeDefined();
  });

  it('should return the defaults', function() {
    expect(csSettings).toBeDefined();
    expect(csSettings.settings['i18n-engine']).toEqual(csLocalization);
    expect(csSettings.settings['date-format']).toEqual('yyyy-MM-dd');
    expect(csSettings.settings['datetime-format']).toEqual('yyyy-MM-ddThh:mm:ss.sss');
    expect(csSettings.settings['time-zone-offset']).toEqual('utc');
  });

  it('should allow adding new setting', function() {
    expect(csSettings).toBeDefined();
    csSettings.set('test-setting', 'Test Value');
    expect(csSettings.settings['test-setting']).toEqual('Test Value');
  });

  it('should allow overwriting default setting', function() {
    expect(csSettings).toBeDefined();
    csSettings.set('date-format', 'fullDate');
    expect(csSettings.settings['date-format']).toEqual('fullDate');
  });

});
