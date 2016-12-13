describe('csTemplateService', function() {
  var csTemplateService;

  beforeEach(angular.mock.module('cloudStorm.templateService'));

  beforeEach(inject(function (_csTemplateService_) {
    csTemplateService = _csTemplateService_;
  }));

  it('should exist', function() {
    expect(csTemplateService).toBeDefined();
  });


  it('should return default template if no override is specified', function() {
    expect(csTemplateService).toBeDefined();
    const field = { type: 'fieldType', attribute: 'fieldAttribute' };
    expect(csTemplateService.getTemplateUrl(field, {}, 'defaultTemplateUrl')).toEqual('defaultTemplateUrl');
  });


  it('should return type override template if type override is specified', function() {
    expect(csTemplateService).toBeDefined();
    const field = {
      type: 'fieldType',
      attribute: 'fieldAttribute'
    };
    const options = { 
      'template-overrides': [
        { type: 'fieldType', template: 'overriddenTemplateUrl' }
      ]
    };
    expect(csTemplateService.getTemplateUrl(field, options, 'defaultTemplateUrl')).toEqual('overriddenTemplateUrl');
  });

  it('should return attribute override template if attribute override is specified', function() {
    expect(csTemplateService).toBeDefined();
    const field = {
      type: 'fieldType',
      attribute: 'fieldAttribute'
    };
    const options = { 
      'template-overrides': [
        { attribute: 'fieldAttribute', template: 'overriddenTemplateUrl' }
      ]
    };
    expect(csTemplateService.getTemplateUrl(field, options, 'defaultTemplateUrl')).toEqual('overriddenTemplateUrl');
  });

  it('should return attribute override template if both overrides are specified', function() {
    expect(csTemplateService).toBeDefined();
    const field = {
      type: 'fieldType',
      attribute: 'fieldAttribute'
    };
    const options = { 
      'template-overrides': [
        { attribute: 'fieldAttribute', template: 'overriddenAttributeTemplateUrl' },
        { type: 'fieldType', template: 'overriddenTypeTemplateUrl' }
      ]
    };
    expect(csTemplateService.getTemplateUrl(field, options, 'defaultTemplateUrl')).toEqual('overriddenAttributeTemplateUrl');
  });
});
