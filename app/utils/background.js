import * as types from '../../app/constants/MessageTypes';

function startSession(secret, testnet = false, callback) {
  chrome.runtime.sendMessage({
    type: types.MSG_SESSION_START,
    data: { secret, testnet }
  }, (response) => {
    if (callback) {
      callback(response.data);
    }
  });
}

function getSession(testnet = false, callback) {
  chrome.runtime.sendMessage({
    type: types.MSG_SESSION,
    data: { testnet }
  }, (response) => {
    if (callback) {
      callback(response.data && response.data.secret ? response.data.secret : null);
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
  removeSession,
  sendResponse
};
