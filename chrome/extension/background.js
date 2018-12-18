import { PostMessageError } from '../../app/actions/errors';
import handlePopupApiMessage from './background/api_popup';
import handleProxyApiMessage from './background/api_proxy';
import * as types from '../../app/constants/MessageTypes';
import queue from '../../app/utils/queue';
import config from '../../app/config';

const connections = {
  popup: null,
};

/**
 * Handle messages from the popup.
 *
 * @param message
 */
function handlePopupMessage(message) {
  console.debug('onPopupMessage', message);
  if (message.type === types.MSG_RESPONSE) {
    if (!message.sourceId) {
      throw new PostMessageError('Unknown message source', 400);
    }
    if (!connections[message.sourceId]) {
      throw new PostMessageError(`Cannot find connection ${message.sourceId}`, 400);
    }
    connections[message.sourceId].postMessage(message);
  }
  handlePopupApiMessage(message, (data) => {
    if (!connections.popup) {
      throw new PostMessageError('Cannot find connection with popup', 500);
    }
    connections.popup.postMessage({ type: types.MSG_RESPONSE, id: message.id, data });
  });
}

/**
 * Handle message from a web.
 *
 * @param portId client port id
 * @param message
 */
function handleProxyMessage(portId, message) {
  console.debug('onProxyMessage', portId, message);
  handleProxyApiMessage(message, portId, (data) => {
    if (!connections[portId]) {
      throw new PostMessageError(`Cannot find connection ${portId}`, 500);
    }
    connections[portId].postMessage({ type: types.MSG_RESPONSE, id: message.id, data });
  });
}

/**
 * Handle close a web.
 *
 * @param portId client port id
 */
function handleProxyDisconnect(portId) {
  console.debug('onDisconnect', portId);
  delete connections[portId];
  queue.clearFromSource(portId);
}

/**
 * Send a error response.
 *
 * @param port client port
 * @param id message id
 * @param error
 */
function sendErrorMessage(port, id, error) {
  port.postMessage({
    id,
    error: {
      code: error.code || 500,
      message: error.message || 'Unknown error',
      data: error.data,
    }
  });
}

/**
 * Handle extension startup.
 */
chrome.runtime.onInstalled.addListener(() => {
  queue.clear();
});
chrome.runtime.onStartup.addListener(() => {
  queue.clear();
});

/**
 * Handle messages.
 */
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
          sendErrorMessage(port, message.id, err);
        }
      });
    } else if (port.name === config.proxyConnectionName) { // connection with proxy script
      connections[portId] = port;
      port.onMessage.addListener((message) => {
        try {
          handleProxyMessage(portId, message);
        } catch (err) {
          sendErrorMessage(port, message.id, err);
        }
      });
      port.onDisconnect.addListener(() => {
        handleProxyDisconnect(portId);
      });
    }
  }
});
