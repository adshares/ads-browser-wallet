'use strict';

console.log('background.js ' + new Date());

let ProxyPort = undefined;
let PopupPort = undefined;

chrome.runtime.onConnect.addListener(
    function (port) {
        console.log("background.js: onConnect");
        console.log('connect ' + port.name);
        console.log(port);
        if (port.sender.id === chrome.i18n.getMessage("@@extension_id")) {
            if (port.name === 'ads-proxy') {// connection with proxy script

                ProxyPort = port;
                ProxyPort.onMessage.addListener(function (message) {
                    console.log('background.js: onMessage proxy');
                    console.log(message);
                    port.postMessage({response: 'yes'});

                    // update icon badge
                    chrome.browserAction.getBadgeText({}, function (text) {
                        if (text === '') {
                            text = '1';
                        } else {
                            text = (parseInt(text) + 1).toString();
                        }
                        chrome.browserAction.setBadgeText({text: text});
                    });
                });
            }
            else if (port.name === 'ads-popup') {// connection with popup
                port.postMessage({response: 'connected'});
                PopupPort = port;
                PopupPort.onMessage.addListener((message) => {
                    console.log('background.js: connected with popup');
                    console.log(message);
                });
                PopupPort.onDisconnect.addListener((port) => {
                    console.log('background.js: disconnected with popup');
                    console.log(port);
                    PopupPort = undefined;
                });
            }
        } else {
            console.error('Connection from outside extension.');
        }
    }
);

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log("background.js: onMessage");
        console.log(request);
        console.log(sender);
        console.log(sendResponse);

        if (sender.id === chrome.i18n.getMessage("@@extension_id")) {
            console.log('message from extension');
            if (ProxyPort) {
                ProxyPort.postMessage(request);
            } else {
                console.error('ProxyPort is undefined');
            }
        }
    }
);
