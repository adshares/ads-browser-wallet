'use strict';

const adsSign = require('./ads-sign');
const parser = require('./ads-data-parser');
const store = require('./store');
const {
    CONN_ID_POPUP,
    CONN_ID_PROXY,
    MSG_DELETE_ACCOUNT,
    MSG_IMPORT_KEY_REQ,
    MSG_IMPORT_KEY_RES,
    MSG_INVALID_NEW_PASSWORD,
    MSG_INVALID_PASSWORD,
    MSG_LOG_OUT,
    MSG_NEW_PASSWORD,
    MSG_PASSWORD,
    MSG_PAGE_SELECT,
    MSG_TRANSACTION_ADD,
    MSG_TRANSACTION_SIGNED,
    MSG_TX_REJECT_REQ,
    MSG_TX_REJECT_RES,
    MSG_TX_SIGN_REQ,
    MSG_TX_SIGN_RES,
    STATUS_FAIL,
    STATUS_SUCCESS,
    STORE_KEY_TX,
    STORE_KEY_VAULT
} = require('./enums');
/**
 * Regular expression for hex string.
 *
 * @type {RegExp}
 */
const HEX_REGEXP = /^[0-9A-Fa-f]+$/;

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
    return store.getEncryptedData(STORE_KEY_VAULT, password)
        .then(val => {
            this.vault = val;
            this.isUnlocked = true;
            console.log('1 isUnlocked ' + this.isUnlocked);
        })
        .catch(e => {
            KeyStore.lock();
            console.log('2 isUnlocked ' + this.isUnlocked);
            console.error(e);
            throw e;
        });
};
KeyStore.isAccount = function () {
    console.log('KeyStore.isAccount');
    return store.getData(STORE_KEY_VAULT).then(val => val !== undefined);
};
KeyStore.isLoggedIn = function () {
    console.log('KeyStore.isLoggedIn');
    return this.isUnlocked;
};
KeyStore.createAccount = function (password) {
    console.log('KeyStore.createAccount');
    return store.setEncryptedData(STORE_KEY_VAULT, {}, password);
};
KeyStore.sign = function (data, keyId) {
    console.log('KeyStore.sign');
    if (this.vault) {
        let kc = this.vault[keyId];
        if (kc) {
            let key = kc.sk + kc.pk;
            return adsSign.sign(data, key);
        }
    }
    throw new Error('Cannot sign data');
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
        type: MSG_PAGE_SELECT,
        isAccount: isAccount,
        isLoggedIn: isLoggedIn,
        pageId: pageId,
        tabId: undefined
    };
}

function prepareTransactionData(data) {
    if (!data || !data.mid | !data.txData || !data.txAccountHashin) {
        throw new Error('Missing tx data');
    }
    let mid = data.mid;
    let txData = data.txData.sanitizeHex();
    let txAccountHashin = data.txAccountHashin.sanitizeHex();

    // validate txAccountHashin - is hex, length is 64 chars (32 bytes)
    if (!txAccountHashin.match(HEX_REGEXP) || txAccountHashin.length !== 64) {
        throw new Error('Invalid hash format');
    }

    // validate txData - is hex, length is even (each byte takes two chars)
    if (!txData.match(HEX_REGEXP) || (txData.length % 2 !== 0)) {
        throw new Error('Invalid data format');
    }

    // validate txData - is parsable
    try {
        parser.parseData(txData);
    } catch (err) {
        throw new Error('Parse error: ' + err.message);
    }

    return {
        d: txData,
        h: txAccountHashin,
        m: mid
    };
}

function onMsgAddTransaction(data) {
    let txObj;
    try {
        txObj = prepareTransactionData(data);
    } catch (err) {
        console.error(err.message);
        ProxyPort.postMessage({
            type: MSG_TRANSACTION_SIGNED,
            status: STATUS_FAIL,
            data: err.message
        });
    }

    if (txObj) {
        store.getData(STORE_KEY_TX)
            .then(val => {
                if (!val) {
                    val = {};
                }
                let ts = new Date().getTime();
                val[ts] = txObj;
                return store.setData(STORE_KEY_TX, val);
            })
            .then(a => {
                // update icon badge
                chrome.browserAction.getBadgeText({}, function (text) {
                    if (text === '') {
                        text = '1';
                    } else {
                        text = (parseInt(text) + 1).toString();
                    }
                    chrome.browserAction.setBadgeText({text: text});
                });
            })
            .catch(
                e => console.error(e)
            );
    }
}

function onMsgDeleteAccount() {
    chrome.storage.local.clear();
    createPageSelectObject().then(p => PopupPort.postMessage(p));
}

function onMsgImportKey(data) {
    const name = data.name;
    const sk = data.sk.sanitizeHex();
    const pk = data.pk.sanitizeHex();
    const sg = data.sg.sanitizeHex();
    const pass = data.pass;

    // validate
    if ((typeof name === 'string') && name.length > 0 && (typeof sk === 'string') && sk.length === 64
        && (typeof pk === 'string') && pk.length === 64) {

        let isSignPass = true;
        // Signature SG is optional. Validate SG, if provided.
        if (sg) {
            let isValid = false;
            if (typeof sg === 'string' && sg.length === 128) {
                try {
                    let signed = adsSign.sign('', sk + pk);
                    isValid = (signed === sg);
                } catch (err) {
                    console.error(err.message);
                }
            }
            console.log('is signature valid: ', isValid);
            isSignPass = isValid;
        }

        if (isSignPass) {
            // status of key importing, default: fail
            let status = STATUS_FAIL;

            KeyStore.unlock(pass)
                .then(a => {
                    console.log(a);
                    KeyStore.vault[name] = {
                        sk: sk,
                        pk: pk
                    };
                    return store.setEncryptedData(STORE_KEY_VAULT, KeyStore.vault, pass).then(status = STATUS_SUCCESS);
                })
                // Catch is needed, because KeyStore.unlock may throw when KeyStore cannot be unlocked.
                // If catch is missing error is visible on page.
                .catch()
                .finally(() => {
                    PopupPort.postMessage({type: MSG_IMPORT_KEY_RES, status: status});
                });
        } else {
            // invalid signature was passed
            PopupPort.postMessage({type: MSG_IMPORT_KEY_RES, status: STATUS_FAIL});
        }
    } else {
        // invalid format of keys or missing name
        PopupPort.postMessage({type: MSG_IMPORT_KEY_RES, status: STATUS_FAIL});
    }
}

function onMsgLogOut() {
    KeyStore.lock();
    createPageSelectObject().then(p => PopupPort.postMessage(p));
}

function onMsgPassword(password) {
    // login - password is checked within unlock function
    KeyStore.unlock(password)
        .then(a => createPageSelectObject())
        .then(p => PopupPort.postMessage(p))
        .catch(e => PopupPort.postMessage({type: MSG_INVALID_PASSWORD}));
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
        PopupPort.postMessage({type: MSG_INVALID_NEW_PASSWORD});
    }
}

function onMsgTxReject(ts) {
    // remove from storage
    let status = STATUS_FAIL;
    store.getData(STORE_KEY_TX)
        .then(val => {
            val[ts] = undefined;
            return store.setData(STORE_KEY_TX, val);
        })
        .then(a => {
            status = STATUS_SUCCESS;
        })
        .catch(e => {
            console.error(e);
        })
        .finally(() => PopupPort.postMessage({type: MSG_TX_REJECT_RES, status: status, data: ts}));
}

function onMsgTxSign(data) {
    let ts = data.ts;
    let txData = data.d;
    let txAccountHashin = data.h;

    let dataToSign = txAccountHashin + txData;
    // TODO select key
    let key = 'name1';

    let signature;
    try {
        signature = KeyStore.sign(dataToSign, key);
    } catch (err) {
        console.error(err.message);
    }

    let status = signature ? STATUS_SUCCESS : STATUS_FAIL;
    PopupPort.postMessage({type: MSG_TX_SIGN_RES, status: status, data: ts});
    if (STATUS_SUCCESS === status) {
        let resp = {
            mid: data.m,
            txAccountHashin: txAccountHashin,
            txData: txData,
            txSignature: signature
        };
        ProxyPort.postMessage({
            type: MSG_TRANSACTION_SIGNED,
            status: STATUS_SUCCESS,
            data: resp
        });

        // remove from store
        store.getData(STORE_KEY_TX)
            .then(val => {
                val[ts] = undefined;
                return store.setData(STORE_KEY_TX, val);
            })
            .catch(
                e => console.error(e)
            );
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
            if (port.name === CONN_ID_PROXY) {// connection with proxy script
                // TODO remove line below = it was added for testing purpose
                port.postMessage({response: 'yes'});
                ProxyPort = port;
                ProxyPort.onMessage.addListener(function (message) {
                    console.log('background.js: onMessage proxy');
                    console.log(message);
                    switch (message.type) {
                        case MSG_TRANSACTION_ADD:
                            onMsgAddTransaction(message.data);
                            break;
                        default:
                            // TODO
                            console.log('Unknown message type');
                    }
                });
            } else if (port.name === CONN_ID_POPUP) {// connection with popup
                PopupPort = port;
                onPopupConnected();
                PopupPort.onMessage.addListener((message) => {
                    console.log('background.js: connected with popup');
                    console.log(message);
                    switch (message.type) {
                        case MSG_DELETE_ACCOUNT:
                            onMsgDeleteAccount();
                            break;
                        case MSG_IMPORT_KEY_REQ:
                            onMsgImportKey(message.data);
                            break;
                        case MSG_LOG_OUT:
                            onMsgLogOut();
                            break;
                        case MSG_NEW_PASSWORD:
                            onMsgPasswordNew(message.data);
                            break;
                        case MSG_PASSWORD:
                            onMsgPassword(message.data);
                            break;
                        case MSG_TX_REJECT_REQ:
                            onMsgTxReject(message.data);
                            break;
                        case MSG_TX_SIGN_REQ:
                            onMsgTxSign(message.data);
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

// chrome.runtime.onMessage.addListener(
//     function (request, sender, sendResponse) {
//         console.log("background.js: onMessage");
//         console.log(request);
//         console.log(sender);
//         console.log(sendResponse);
//
//         if (sender.id === chrome.i18n.getMessage("@@extension_id")) {
//             console.log('message from extension');
//             if (ProxyPort) {
//                 ProxyPort.postMessage(request);
//             } else {
//                 console.error('ProxyPort is undefined');
//             }
//         }
//     }
// );
