describe('csLocalization', function() {

  var csLocalization;

  beforeEach(angular.mock.module('cloudStorm.localizationProvider'));

  beforeEach(inject(function (_csLocalization_) {
    csLocalization = _csLocalization_;
  }));

  it('should exist', function() {
    expect(csLocalization).toBeDefined();
  });

  it('should return the defaults', function() {
    expect(csLocalization).toBeDefined();
    expect(csLocalization.t('false')).toEqual('Yes');
    expect(csLocalization.t('buttons.close')).toEqual('Close');
  });

  it('should allow adding new translations', function() {
    expect(csLocalization).toBeDefined();
    csLocalization.add('test_key', 'Test Value');
    expect(csLocalization.t('test_key')).toEqual('Test Value');
  });

  it('should return key for non-existing keys', function() {
    expect(csLocalization).toBeDefined();
    expect(csLocalization.t('non_existing_test_key')).toEqual('non_existing_test_key');
  });

  it('should overwrite old value when re-adding a key', function() {
    expect(csLocalization).toBeDefined();
    csLocalization.add('false', 'New False Value');
    expect(csLocalization.t('false')).toEqual('New False Value');
  });
});
