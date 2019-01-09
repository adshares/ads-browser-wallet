import config from '../../app/config/config';

let webPort;

// connection with background script
const backgroundPort = chrome.runtime.connect(
  chrome.i18n.getMessage('@@extension_id'),
  { name: config.proxyConnectionName }
);

backgroundPort.onMessage.addListener((message) => {
  if (webPort) {
    webPort.postMessage(message);
  }
});

window.addEventListener('message', (event) => {
  // init connection
  if (event.data && event.data === 'init') {
    webPort = event.ports[0];
    webPort.onmessage = (message) => {
      backgroundPort.postMessage(message.data);
    };
    // accept connection from page
    webPort.postMessage('ready');
  }
});
