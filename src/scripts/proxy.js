'use strict';

// connection with background script
let port = chrome.runtime.connect('mggldlanffdgafakkmdheppehalbddbi', {name: 'ads-proxy'});

window.addEventListener('message', function (event) {
    console.log('proxy.js: onMessage');
    console.log(event);
    if (event.data && event.data === 'init') {

        // redirect messages from background to page
        port.onMessage.addListener(function (message) {
            console.log('background -> page');
            console.log(message);
            event.ports[0].postMessage(message);
        });

        // redirect messages from page to background
        event.ports[0].onmessage = function (message) {
            console.log('page -> background');
            console.log(message.data);
            port.postMessage(message.data);
        };

        // accept connection from page
        event.ports[0].postMessage('ready');
    }
}, false);
