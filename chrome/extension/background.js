import { PostMessageError } from '../../app/actions/errors';
import handlePopupApiMessage from './background/api_popup';
import handleProxyApiMessage from './background/api_proxy';
import config from '../../app/config';

const connections = {
  popup: null,
};

function handlePopupMessage(message) {
  console.debug('onPopupMessage', message);
  if (!connections.popup) {
    throw new PostMessageError('Cannot find connection with popup', 500);
  }
  handlePopupApiMessage(message, (data) => {
    connections.popup.postMessage({ id: message.id, ...data });
  });
}

function handleProxyMessage(portId, message) {
  console.debug('onProxyMessage', portId, message);
  if (!connections[portId]) {
    throw new PostMessageError(`Cannot find connection ${portId}`, 500);
  }
  handleProxyApiMessage(message, portId, (data) => {
    connections[portId].postMessage({ id: message.id, ...data });
  });
}

function handleProxyDisconnect(portId) {
  console.debug('onDisconnect', portId);
  delete connections[portId];
}

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
