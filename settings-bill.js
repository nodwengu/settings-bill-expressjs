
let moment = require('moment');

module.exports = function SettingsBill() {
  let callCost;
  let smsCost;
  let warningLevel;
  let criticalLevel;
  let textColor = "";
  let disabled;

  let callsTotal = 0;
  let smsTotal = 0;
  let grandTotal = 0;

  let actionList = []

  function setSettings(setting) {
    callCost = Number(setting.callCost);
    smsCost = Number(setting.smsCost);
    warningLevel = Number(setting.warningLevel);
    criticalLevel = Number(setting.criticalLevel);
  }

  function getCallCost() {
    return callCost;
  }
  function getSmsCost() {
    return smsCost;
  }
  function getGrandTotal() {
    return grandTotal;
  }

  function getSettings() {
    return {
      callCost,
      smsCost,
      warningLevel,
      criticalLevel
    }
  }

  function makeCall() {
    callsTotal += callCost;
    grandTotal += callCost
  }

  function sendSms() {
    smsTotal += smsCost;
    grandTotal += smsCost
  }

  function setAction(action) {
    let cost = 0;
    if (action === 'call') {
      makeCall();
      cost = callCost.toFixed(2);
    } else if (action === 'sms') {
      sendSms();
      cost = smsCost.toFixed(2);
    }

    actionList.push({
      type: action,
      cost,
      timeStamp: moment().calendar()
    })
  }

  function getActions() {
    return actionList;
  }

  function getTotals() {
    return {
      callsTotal: callsTotal.toFixed(2),
      smsTotal: smsTotal.toFixed(2),
      grandTotal: grandTotal.toFixed(2)
    }
  }

  function getActionsFor(type) {
    return actionList.filter((action) => action.type === type)
  }

  function hasReachedWarningLevel() {
    const total = getGrandTotal();
    
    return total >= warningLevel && total < criticalLevel;
  }

  function hasReachedCriticalLevel() {
    const total = getGrandTotal();
    
    return total >= criticalLevel;
  }

  function getWarningLevel() {
    return warningLevel;
  }

  function getCriticalLevel() {
    return criticalLevel;
  }
  
  function updateText(){
    if( hasReachedWarningLevel() ) {
      textColor = "warning";
      disabled = ''
    } else if( hasReachedCriticalLevel() ) {
      textColor = "danger";
      disabled = 'disabled'
    } else {
      textColor = ""
      disabled = ''
    }
  }

  function getColor() {
    return textColor;
  }

  function getBtnStatus() {
    return disabled
  }

  return {
    setSettings,
    getSettings,
    setAction,
    getTotals,
    getActions,
    getActionsFor,
    getCallCost,
    getSmsCost,

    getGrandTotal,
    hasReachedCriticalLevel,
    hasReachedWarningLevel,
    getWarningLevel,
    getCriticalLevel,

    updateText,
    getColor,
    getBtnStatus
  }
}