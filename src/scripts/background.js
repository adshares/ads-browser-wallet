'use strict';

const store = require('./store');

console.log('background.js ' + new Date());

let ProxyPort = undefined;
let PopupPort = undefined;

let KeyStore = function () {
};
KeyStore.lock = function () {
    console.log('KeyStore.lock');
    this.vault = undefined;
    this.isUnlocked = false;
};
KeyStore.unlock = function (password) {
    console.log('KeyStore.unlock');
    // get keys from storage
    return store.getEncryptedData('vault', password)
        .then(val => {
            this.vault = val;
            this.isUnlocked = true;
            console.log('1 isUnlocked ' + this.isUnlocked);
        })
        .catch(e => {
            KeyStore.lock();
            console.error(e);
            console.log('2 isUnlocked ' + this.isUnlocked);
        });
};
KeyStore.isAccount = function () {
    console.log('KeyStore.isAccount');
    return store.getData('vault').then(val => val !== undefined);
};
KeyStore.isLoggedIn = function () {
    console.log('KeyStore.isLoggedIn');
    return this.isUnlocked;
};
KeyStore.createAccount = function (password) {
    console.log('KeyStore.createAccount');
    return store.setEncryptedData('vault', {}, password);
};

async function createPageSelectObject() {
    console.log('createPageSelectObject');
    let pageId;
    const isAccount = await KeyStore.isAccount();
    console.log('\tisAccount ' + isAccount);
    const isLoggedIn = KeyStore.isLoggedIn();
    console.log('\tisLoggedIn ' + isLoggedIn);
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
    createPageSelectObject().then(p => PopupPort.postMessage(p));
}

function onMsgLogOut() {
    KeyStore.lock();
    createPageSelectObject().then(p => PopupPort.postMessage(p));
}

function onMsgPassword(password) {
    // TODO check password
    let correct = true;
    if (correct) {
        // login
        KeyStore.unlock(password)
            .then(a => createPageSelectObject())
            .then(p => PopupPort.postMessage(p));
    } else {
        PopupPort.postMessage({type: 'invalid_password'});
    }
}

function onMsgPasswordNew(password) {
    // TODO validate password (length, chars)
    let isValid = true;
    if (isValid) {
        KeyStore.isAccount().then(isAccount => {
            if (isAccount) {
                if (KeyStore.isLoggedIn()) {
                    // change password

                } else {
                    // reject request
                    createPageSelectObject().then(p => PopupPort.postMessage(p));
                }
            } else {
                // create new account
                KeyStore.createAccount(password)
                    .then(a => KeyStore.unlock(password))
                    .then(a => createPageSelectObject())
                    .then(p => PopupPort.postMessage(p))
                    .catch(e => console.error(e));
            }
        });
    } else {
        PopupPort.postMessage({type: 'invalid_new_password'});
    }
}

function onPopupConnected() {
    createPageSelectObject().then(p => PopupPort.postMessage(p));
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
