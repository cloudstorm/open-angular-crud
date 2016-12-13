describe('csDataStore', function() {
  var csDataStore;

  beforeEach(angular.mock.module('cloudStorm.dataStore'));

  beforeEach(inject(function (_csDataStore_) {
    csDataStore = _csDataStore_;
  }));

  it('should exist', function() {
    expect(csDataStore).toBeDefined();
  });

  it('should allow putting objects to global', function() {
    expect(csDataStore).toBeDefined();
    csDataStore.global().put('testType', '0', { data: 'test data'} );
  });

  it('should allow retrieving objects', function() {
    expect(csDataStore).toBeDefined();
    csDataStore.global().put('testType', '0', { data: 'test data'} );

    const retrievedData = csDataStore.global().get('testType', '0');
    expect(retrievedData).toEqual({ data: 'test data'});
  });

  it('should return "undefined" for non-existing id', function() {
    expect(csDataStore).toBeDefined();
    csDataStore.global().put('testType', '0', { data: 'test data'} );

    const retrievedData = csDataStore.global().get('testType', 'non-existing-id');
    expect(retrievedData).not.toBeDefined();
  });

  it('should return "null" for non-existion type', function() {
    expect(csDataStore).toBeDefined();
    csDataStore.global().put('testType', '0', { data: 'test data'} );

    const retrievedData = csDataStore.global().get('nonExistingType', '0');
    expect(retrievedData).toBeNull();
  });

  it('should overwrite old data with new', function() {
    expect(csDataStore).toBeDefined();
    csDataStore.global().put('testType', '0', { data: 'test data 1'} );
    csDataStore.global().put('testType', '0', { data: 'test data 2'} );

    const retrievedData = csDataStore.global().get('testType', '0');
    expect(retrievedData).toEqual({ data: 'test data 2'});
  });

  it('should store with different ids', function() {
    expect(csDataStore).toBeDefined();
    csDataStore.global().put('testType', 1, { data: 'test data 1'} );
    csDataStore.global().put('testType', 2, { data: 'test data 2'} );

    const retrievedData1 = csDataStore.global().get('testType', 1);
    expect(retrievedData1).toEqual({ data: 'test data 1'});
    const retrievedData2 = csDataStore.global().get('testType', 2);
    expect(retrievedData2).toEqual({ data: 'test data 2'});
  });

  it('should allow forking', function() {
    expect(csDataStore).toBeDefined();
    csDataStore.global().put('testType', 1, { data: 'test data 1'} );
    csDataStore.global().put('testType', 2, { data: 'test data 2'} );

    const retrievedData1 = csDataStore.global().get('testType', 1);
    expect(retrievedData1).toEqual({ data: 'test data 1'});
    const retrievedData2 = csDataStore.global().get('testType', 2);
    expect(retrievedData2).toEqual({ data: 'test data 2'});

    const forkedDataStore = csDataStore.global().fork();

    const forkedData1 = forkedDataStore.get('testType', 1);
    expect(forkedData1).toEqual({ data: 'test data 1'});
    const forkedData2 = forkedDataStore.get('testType', 2);
    expect(forkedData2).toEqual({ data: 'test data 2'});
  });

  it('should store with different types', function() {
    expect(csDataStore).toBeDefined();
    csDataStore.global().put('testType1', 0, { data: 'test data 1'} );
    csDataStore.global().put('testType2', 0, { data: 'test data 2'} );

    const retrievedData1 = csDataStore.global().get('testType1', 0);
    expect(retrievedData1).toEqual({ data: 'test data 1'});
    const retrievedData2 = csDataStore.global().get('testType2', 0);
    expect(retrievedData2).toEqual({ data: 'test data 2'});
  });

  it('should allow datastore creation', function() {
    expect(csDataStore).toBeDefined();
    const myDataStore = new csDataStore({ });
    expect(myDataStore).toBeDefined();

    myDataStore.put('testType1', 0, { data: 'test data 1'} );
    myDataStore.put('testType2', 0, { data: 'test data 2'} );

    const retrievedData1 = myDataStore.get('testType1', 0);
    expect(retrievedData1).toEqual({ data: 'test data 1'});
    const retrievedData2 = myDataStore.get('testType2', 0);
    expect(retrievedData2).toEqual({ data: 'test data 2'});

  });

});
