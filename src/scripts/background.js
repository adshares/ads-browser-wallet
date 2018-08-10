'use strict';

chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({color: '#3aa757'}, function () {
        console.log('The color is green.');
    });
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {urlContains: 'index'},
            })
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});

chrome.runtime.onConnect.addListener(
    function (port) {
        console.log("background.js: onConnect");
        console.log('connect' + port.name);
        if (port.name === 'ads-cs') {// connection with content script
            port.onMessage.addListener(function (msg) {
                for (let prop in msg) {
                    console.log(prop + ': ' + msg[prop]);
                }
                port.postMessage({response: 'yes'});
            });
        }
    }
);

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log("background.js: onMessage");
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        if (request.greeting === "hello") {
            sendResponse({farewell: "goodbye"});
        }
    }
);
