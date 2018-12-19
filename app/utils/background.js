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
    console.debug(response);
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

export default {
  startSession,
  getSession,
  removeSession,
};
