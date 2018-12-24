import config from '../../app/config/config';

let webPort;

// connection with background script
const backgroundPort = chrome.runtime.connect(
  chrome.i18n.getMessage('@@extension_id'),
  { name: config.proxyConnectionName }
);

backgroundPort.onMessage.addListener((message) => {
  console.debug('background: onMessage', message);
  if (webPort) {
    webPort.postMessage(message);
  }
});

window.addEventListener('message', (event) => {
  console.debug('proxy: window', event.data);
  // init connection
  if (event.data && event.data === 'init') {
    webPort = event.ports[0];
    webPort.onmessage = (message) => {
      console.debug('proxy: onMessage', message.data);
      backgroundPort.postMessage(message.data);
    };
    // accept connection from page
    webPort.postMessage('ready');
  }
});
