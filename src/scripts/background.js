'use strict';

console.log('background.js ' + new Date());

let ProxyPort = undefined;
let PopupPort = undefined;

let KeyStore = function () {
};
KeyStore.lock = function () {
    this.isUnlocked = false;
};
KeyStore.unlock = function (password) {
    // TODO get keys from storage
    this.isUnlocked = true;
};
KeyStore.isAccount = function () {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(null, (result) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError.message);
            } else {
                // if there is any entry in storage, account was created
                let isAccount = Object.getOwnPropertyNames(result).length > 0;
                resolve(isAccount);
            }
        });
    });
};
KeyStore.isLoggedIn = function () {
    return this.isUnlocked;
};

async function createPageSelectObject() {
    let pageId;
    const isAccount = await KeyStore.isAccount();
    const isLoggedIn = KeyStore.isLoggedIn();
    if (isAccount) {
        if (isLoggedIn) {
            pageId = 'user-page';
        } else {
            pageId = 'login-page';
        }
    } else {
        pageId = 'create-acc-page';
    }

    return {
        type: 'page_select',
        isAccount: isAccount,
        isLoggedIn: isLoggedIn,
        pageId: pageId,
        tabId: undefined
    };
}

function onMsgDeleteAccount() {
    chrome.storage.local.clear();
    createPageSelectObject().then((p) => PopupPort.postMessage(p));
}

function onMsgLogOut() {
    KeyStore.lock();
    createPageSelectObject().then((p) => PopupPort.postMessage(p));
}

function onMsgPassword(password) {
    // TODO check password
    let correct = true;
    KeyStore.unlock(password);
    if (correct) {
        createPageSelectObject().then((p) => PopupPort.postMessage(p));
    } else {
        PopupPort.postMessage({type: 'invalid_password'});
    }
}

function onMsgPasswordNew(password) {
    createPageSelectObject().then((p) => PopupPort.postMessage(p));
}

function onPopupConnected() {
    createPageSelectObject().then((p) => PopupPort.postMessage(p));
}

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
            } else if (port.name === 'ads-popup') {// connection with popup
                PopupPort = port;
                onPopupConnected();
                PopupPort.onMessage.addListener((message) => {
                    console.log('background.js: connected with popup');
                    console.log(message);
                    switch (message.type) {
                        case 'delete_account':
                            onMsgDeleteAccount();
                            break;
                        case 'log_out':
                            onMsgLogOut();
                            break;
                        case 'new_password':
                            onMsgPasswordNew(message.data);
                            break;
                        case 'password':
                            onMsgPassword(message.data);
                            break;
                        default:
                            // TODO
                            console.log('Unknown message type');
                    }
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
