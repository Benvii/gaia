/* This should live in the shared directory */

'use strict';

requireApp('system/test/unit/mock_moz_mobile_connection.js');

requireApp('system/shared/js/mobile_operator.js');

suite('shared/MobileOperator', function() {
  var MockMobileConnection;
  var BRAZIL_MCC = 724;


  setup(function() {
    MockMobileConnection = new MockMozMobileConnection();
  });

  suite('Worldwide connection', function() {
    test('Connection with short name', function() {
      var infos = MobileOperator.userFacingInfo(MockMobileConnection);
      assert.equal(infos.operator, 'Fake short');
      assert.isUndefined(infos.carrier);
      assert.isUndefined(infos.region);
    });
    test('Connection with long name', function() {
      MockMobileConnection.voice.network.shortName = '';
      var infos = MobileOperator.userFacingInfo(MockMobileConnection);
      assert.equal(infos.operator, 'Fake long');
      assert.isUndefined(infos.carrier);
      assert.isUndefined(infos.region);
    });
    test('Connection with SPN display', function() {
      MockMobileConnection.iccInfo.isDisplaySpnRequired = true;
      var infos = MobileOperator.userFacingInfo(MockMobileConnection);
      assert.equal(infos.operator, 'Fake SPN');
      assert.isUndefined(infos.carrier);
      assert.isUndefined(infos.region);
    });
    test('Connection with SPN display and network display', function() {
      MockMobileConnection.iccInfo.isDisplaySpnRequired = true;
      MockMobileConnection.iccInfo.isDisplayNetworkNameRequired = true;
      var infos = MobileOperator.userFacingInfo(MockMobileConnection);
      assert.equal(infos.operator, 'Fake short Fake SPN');
      assert.isUndefined(infos.carrier);
      assert.isUndefined(infos.region);
    });
  });
  suite('Brazilian connection', function() {
    test('Connection ', function() {
      MockMobileConnection.voice.network.mcc = BRAZIL_MCC;
      var infos = MobileOperator.userFacingInfo(MockMobileConnection);
      assert.equal(infos.operator, 'Fake short');
      assert.equal(infos.carrier, 'VIVO');
      assert.equal(infos.region, 'BA 71');
    });
    test('Connection with unknown mnc', function() {
      MockMobileConnection.voice.network.mcc = BRAZIL_MCC;
      MockMobileConnection.voice.network.mnc = 42;
      var infos = MobileOperator.userFacingInfo(MockMobileConnection);
      assert.equal(infos.operator, 'Fake short');
      assert.equal(infos.carrier, '72442');
      assert.equal(infos.region, 'BA 71');
    });
    test('Connection with unknown gsmLocationAreaCode', function() {
      MockMobileConnection.voice.network.mcc = BRAZIL_MCC;
      MockMobileConnection.voice.cell.gsmLocationAreaCode = 2;
      var infos = MobileOperator.userFacingInfo(MockMobileConnection);
      assert.equal(infos.operator, 'Fake short');
      assert.equal(infos.carrier, 'VIVO');
      assert.equal(infos.region, '');
    });
  });
});
