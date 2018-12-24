import * as types from '../../app/constants/MessageTypes';

function startSession(secret, callback) {
  chrome.runtime.sendMessage({
    type: types.MSG_SESSION_START,
    data: { secret }
  }, (response) => {
    if (callback) {
      callback(response.data);
    }
  });
}

function getSession(callback) {
  chrome.runtime.sendMessage({
    type: types.MSG_SESSION,
  }, (response) => {
    if (callback) {
      callback(response.data);
    }
  });
}

function changeNetwork(testnet = false, callback) {
  chrome.runtime.sendMessage({
    type: types.MSG_SESSION_NETWORK,
    data: { testnet }
  }, (response) => {
    if (callback) {
      callback(response.data);
    }
  });
}

function removeSession(callback) {
  chrome.runtime.sendMessage({
    type: types.MSG_SESSION_REMOVE,
  }, (response) => {
    if (callback) {
      callback(response.data);
    }
  });
}

function sendResponse(sourceId, id, data, callback) {
  chrome.runtime.sendMessage({
    type: types.MSG_RESPONSE,
    sourceId,
    id,
    data,
  }, (response) => {
    if (callback) {
      callback(response.error ? { error: response.error } : response.data);
    }
  });
}

export default {
  startSession,
  getSession,
  changeNetwork,
  removeSession,
  sendResponse
};
