// const bluebird = require('bluebird');
//
// global.Promise = bluebird;
//
// function promisifier(method) {
//   // return a function
//   return function promisified(...args) {
//     // which returns a promise
//     return new Promise((resolve) => {
//       args.push(resolve);
//       method.apply(this, args);
//     });
//   };
// }
//
// function promisifyAll(obj, list) {
//   list.forEach(api => bluebird.promisifyAll(obj[api], { promisifier }));
// }
//
// // let chrome extension api support Promise
// promisifyAll(chrome, [
//   'tabs',
//   'windows',
//   'browserAction',
//   'contextMenus'
// ]);
// promisifyAll(chrome.storage, [
//   'local',
// ]);
//
// require('./background/contextMenus');
// require('./background/inject');
// require('./background/badge');
import * as types from '../../app/constants/MessageTypes';
import config from '../../app/config';

const connections = {
  popup: null,
};

function handlePopupMessage(message) {
  console.debug('onPopupMessage', message);
}

function handleProxyMessage(portId, message) {
  console.debug('onProxyMessage', portId, message);

  switch (message.type) {
    case types.MSG_PING:
      connections[portId].postMessage({ type: types.MSG_PONG });
      break;
    case types.MSG_INFO_REQUEST:
      connections[portId].postMessage({ type: types.MSG_INFO_RESPONSE });
      break;
    case types.MSG_SIGN_REQUEST:
      connections[portId].postMessage({ type: types.MSG_SIGN_RESPONSE });
      break;
    default:
      throw new Error('Unknown request');
  }
}

function handleProxyDisconnect(portId) {
  console.debug('onDisconnect', portId);
  delete connections[portId];
}

function handleError(error, port) {
  port.postMessage({
    error: {
      code: error.code || 500,
      message: error.message || 'Unknown error',
      data: error.data,
    }
  });
}

chrome.runtime.onConnect.addListener((port) => {
  const portId = `${port.sender.id}/${port.sender.tab.id}`;
  console.debug('onConnect', portId);

  if (port.sender.id === chrome.i18n.getMessage('@@extension_id')) {
    if (port.name === config.popupConnectionName) { // connection with popup
      connections.popup = port;
      port.onMessage.addListener((message) => {
        try {
          handlePopupMessage(message);
        } catch (err) {
          handleError(err, port);
        }
      });
    } else if (port.name === config.proxyConnectionName) { // connection with proxy script
      connections[portId] = port;
      port.onMessage.addListener((message) => {
        try {
          handleProxyMessage(portId, message);
        } catch (err) {
          handleError(err, port);
        }
      });
      port.onDisconnect.addListener(() => {
        handleProxyDisconnect(portId);
      });
    } else {
      // throw new Error('Connection from unknown source');
    }
  } else {
    // throw new Error('Connection from outside extension');
  }
});
