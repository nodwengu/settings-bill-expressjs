const assert = require('assert');
const SettingsBill = require('../settings-bill');

describe('Settings Bill Function ', () => {
  it('Should be able to record calls', () => {
    let settingsInstance = SettingsBill();

    let userInput = { callCost: 4, smsCost: 2, warningLevel: 10, criticalLevel: 20 }
    settingsInstance.setSettings(userInput);
    settingsInstance.setAction('call');
    settingsInstance.setAction('sms');

    let actions = settingsInstance.getActions();

    let timeStamp1 = actions[0].timeStamp;
    let timeStamp2 = actions[1].timeStamp;

    let result = [{ type: 'call', cost: 4, timeStamp: timeStamp1 }, { type: 'sms', cost: 2, timeStamp: timeStamp2 }]

    assert.deepEqual(settingsInstance.getActions(), result);
  })

  it('Should be able to set the settings', () => {
    let settingsInstance = SettingsBill();

    let userInput = {
      callCost: 4,
      smsCost: 2,
      warningLevel: 10,
      criticalLevel: 20
    }
    settingsInstance.setSettings(userInput);

    assert.deepEqual(settingsInstance.getSettings(), { callCost: 4, smsCost: 2, warningLevel: 10, criticalLevel: 20 });
  })


  it('Should calculate the right totals', () => {
    let settingsInstance = SettingsBill();

    let userInput = { callCost: 4, smsCost: 2, warningLevel: 10, criticalLevel: 20 }
    settingsInstance.setSettings(userInput);
    settingsInstance.setAction('call');
    settingsInstance.setAction('sms');

    assert.deepEqual(settingsInstance.getTotals(), { callsTotal: '4.00', smsTotal: '2.00', grandTotal: '6.00' });
  })

  it('Should calculte the right totals for multiple actions', () => {
    let settingsInstance = SettingsBill();

    let userInput = { callCost: 4, smsCost: 2, warningLevel: 10, criticalLevel: 20 }
    settingsInstance.setSettings(userInput);
    settingsInstance.setAction('call');
    settingsInstance.setAction('call');
    settingsInstance.setAction('call');
    settingsInstance.setAction('sms');
    settingsInstance.setAction('sms');
    settingsInstance.setAction('sms');

    assert.deepEqual(settingsInstance.getTotals(), { callsTotal: '12.00', smsTotal: '6.00', grandTotal: '18.00' });
  })

  it('Should know when the waring level is reached', () => {
    let settingsInstance = SettingsBill();

    let userInput = { callCost: 4, smsCost: 2, warningLevel: 10, criticalLevel: 20 }
    settingsInstance.setSettings(userInput);
    settingsInstance.setAction('call');
    settingsInstance.setAction('sms');
    settingsInstance.setAction('call');
    settingsInstance.setAction('call');

    assert.equal(settingsInstance.getWarningLevel(), 10);
    assert.equal(settingsInstance.getGrandTotal(), 14);
    assert.deepEqual(settingsInstance.hasReachedWarningLevel(), true);
  })

  it('Should know when the critical level is reached', () => {
    let settingsInstance = SettingsBill();

    let userInput = { callCost: 4, smsCost: 2, warningLevel: 10, criticalLevel: 20 }
    settingsInstance.setSettings(userInput);
    settingsInstance.setAction('call');
    settingsInstance.setAction('sms');
    settingsInstance.setAction('call');
    settingsInstance.setAction('call');
    settingsInstance.setAction('call');
    settingsInstance.setAction('call');
    settingsInstance.setAction('call');
    settingsInstance.setAction('sms');

    assert.equal(settingsInstance.getCriticalLevel(), 20);
    assert.equal(settingsInstance.getGrandTotal(), 28);
    assert.deepEqual(settingsInstance.hasReachedCriticalLevel(), true);
  })

  it('Should be able to update text color based on the warning or critical level', () => {
    let settingsInstance = SettingsBill();

    let userInput = { callCost: 9, smsCost: 2, warningLevel: 10, criticalLevel: 20 }
    settingsInstance.setSettings(userInput);
    settingsInstance.setAction('call');
    settingsInstance.setAction('sms');
    settingsInstance.setAction('call');
    settingsInstance.setAction('call');
    settingsInstance.setAction('call');
    settingsInstance.setAction('call');
  
    settingsInstance.updateText();
    assert.equal(settingsInstance.getCriticalLevel(), 20);
    assert.equal(settingsInstance.getGrandTotal(), 47);
    assert.equal(settingsInstance.getColor(), "danger");
    // assert.equal(settingsInstance.getGrandTotal(), 28);
    assert.deepEqual(settingsInstance.hasReachedCriticalLevel(), true);
  })
})

