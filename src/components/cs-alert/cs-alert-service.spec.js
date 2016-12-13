describe('csAlertService', function() {

  var csAlertService;

  beforeEach(angular.mock.module('cloudStorm.alertService'));

  beforeEach(inject(function (_csAlertService_) {
    csAlertService = _csAlertService_;
  }));

  it('should exist and have no messages', function() {
    expect(csAlertService).toBeDefined();
    expect(csAlertService.getAlerts()).toEqual([]);
  });

  it('should be able to receive alerts', function() {
    expect(csAlertService).toBeDefined();
    expect(csAlertService.getAlerts()).toEqual([]);

    csAlertService.addAlert('test alert 1');
    expect(csAlertService.getAlerts()).toEqual([{id: 0, message: 'test alert 1', type: 'warning'}]);

    csAlertService.addAlert('test alert 2', 'success');
    expect(csAlertService.getAlerts()).toEqual([{id: 0, message: 'test alert 1', type: 'warning'}, {id: 1, message: 'test alert 2', type: 'success'}]);
  });

  it('should be able to dismiss alerts', function() {
    expect(csAlertService).toBeDefined();
    expect(csAlertService.getAlerts()).toEqual([]);

    csAlertService.addAlert('test alert 1', 'info');
    expect(csAlertService.getAlerts()).toEqual([{id: 0, message: 'test alert 1', type: 'info'}]);

    csAlertService.addAlert('test alert 2', 'danger');
    expect(csAlertService.getAlerts()).toEqual([{id: 0, message: 'test alert 1', type: 'info'}, {id: 1, message: 'test alert 2', type: 'danger'}]);

    csAlertService.dismissAlert(0);
    expect(csAlertService.getAlerts()).toEqual([{id: 1, message: 'test alert 2', type: 'danger'}]);

    csAlertService.dismissAlert(1);
    expect(csAlertService.getAlerts()).toEqual([]);
  });

  it('should not error when dismissing non-existing alerts', function() {
    expect(csAlertService).toBeDefined();
    expect(csAlertService.getAlerts()).toEqual([]);

    csAlertService.dismissAlert(0);
    csAlertService.dismissAlert(1);
    csAlertService.dismissAlert(2);
    csAlertService.dismissAlert(0);
  });


  it('should not error when having a lot of alerts', function() {
    expect(csAlertService).toBeDefined();
    expect(csAlertService.getAlerts()).toEqual([]);
    for (var i = 0; i < 1000000; i++) {
       csAlertService.addAlert('test alert 1', 'info');
    }
  });
});
