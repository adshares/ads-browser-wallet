const adsSign = require('ads-sign');
const parser = require('ads-data-parser');
const store = require('store');
const { sanitizeHex } = require('util');
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
  STORE_KEY_VAULT,
} = require('./enums');
/**
 * Regular expression for hex string.
 *
 * @type {RegExp}
 */
const HEX_REGEXP = /^[0-9A-Fa-f]+$/;

console.log(`background.js ${new Date()}`);

let ProxyPort;
let PopupPort;

class KeyStore {
  constructor() {
    this.vault = undefined;
    this.isUnlocked = false;
  }

  lock() {
    console.log('KeyStore.lock');
    this.vault = undefined;
    this.isUnlocked = false;
  }

  unlock(password) {
    console.log('KeyStore.unlock');
    // get keys from storage
    return store.getEncryptedData(STORE_KEY_VAULT, password)
      .then((val) => {
        this.vault = val;
        this.isUnlocked = true;
        console.log(`1 isUnlocked ${this.isUnlocked}`);
      })
      .catch((e) => {
        this.lock();
        console.log(`2 isUnlocked ${this.isUnlocked}`);
        console.error(e);
        throw e;
      });
  }

  static isAccount() {
    console.log('KeyStore.isAccount');
    return store.getData(STORE_KEY_VAULT)
      .then(val => val !== undefined);
  }

  isLoggedIn() {
    console.log('KeyStore.isLoggedIn');
    return this.isUnlocked;
  }

  static createAccount(password) {
    console.log('KeyStore.createAccount');
    return store.setEncryptedData(STORE_KEY_VAULT, {}, password);
  }

  sign(data, keyId) {
    console.log('KeyStore.sign');
    if (this.vault) {
      const kc = this.vault[keyId];
      if (kc) {
        const key = kc.sk + kc.pk;
        return adsSign.sign(data, key);
      }
    }
    throw new Error('Cannot sign data');
  }
}

const keyStore = new KeyStore();

async function createPageSelectObject() {
  console.log('createPageSelectObject');
  let pageId;
  const isAccount = await KeyStore.isAccount();
  console.log(`\tisAccount ${isAccount}`);
  const isLoggedIn = keyStore.isLoggedIn();
  console.log(`\tisLoggedIn ${isLoggedIn}`);
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
    isAccount,
    isLoggedIn,
    pageId,
    tabId: undefined,
  };
}

function prepareTransactionData(data) {
  if (!data || !data.mid || !data.txData || !data.txAccountHashin) {
    throw new Error('Missing tx data');
  }
  const { mid } = data;
  const txData = sanitizeHex(data.txData);
  const txAccountHashin = sanitizeHex(data.txAccountHashin);

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
    throw new Error(`Parse error: ${err.message}`);
  }

  return {
    d: txData,
    h: txAccountHashin,
    m: mid,
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
      data: err.message,
    });
  }

  if (txObj) {
    store.getData(STORE_KEY_TX)
      .then((v) => {
        let val;
        if (!v) {
          val = {};
        } else {
          val = v;
        }
        const ts = new Date().getTime();
        val[ts] = txObj;
        return store.setData(STORE_KEY_TX, val);
      })
      .then(() => {
        // update icon badge
        chrome.browserAction.getBadgeText({}, (t) => {
          let text;
          if (t === '') {
            text = '1';
          } else {
            text = (parseInt(t, 10) + 1).toString();
          }
          chrome.browserAction.setBadgeText({ text });
        });
      })
      .catch(
        e => console.error(e),
      );
  }
}

function onMsgDeleteAccount() {
  chrome.storage.local.clear();
  createPageSelectObject()
    .then(p => PopupPort.postMessage(p));
}

function onMsgImportKey(data) {
  const { name, pass } = data;
  const sk = sanitizeHex(data.sk);
  const pk = sanitizeHex(data.pk);
  const sg = sanitizeHex(data.sg);

  // validate
  if ((typeof name === 'string') && name.length > 0 && (typeof sk === 'string') && sk.length === 64
    && (typeof pk === 'string') && pk.length === 64) {
    let isSignPass = true;
    // Signature SG is optional. Validate SG, if provided.
    if (sg) {
      let isValid = false;
      if (typeof sg === 'string' && sg.length === 128) {
        try {
          const signed = adsSign.sign('', sk + pk);
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

      keyStore.unlock(pass)
        .then((a) => {
          console.log(a);
          console.log(keyStore.vault);
          keyStore.vault[name] = {
            sk,
            pk,
          };
          return store
            .setEncryptedData(STORE_KEY_VAULT, keyStore.vault, pass)
            .then(() => {
              status = STATUS_SUCCESS;
            });
        })
        // Catch is needed, because keyStore.unlock may throw when KeyStore cannot be unlocked.
        // If catch is missing error is visible on page.
        .catch()
        .finally(() => {
          PopupPort.postMessage({
            type: MSG_IMPORT_KEY_RES,
            status,
          });
        });
    } else {
      // invalid signature was passed
      PopupPort.postMessage({
        type: MSG_IMPORT_KEY_RES,
        status: STATUS_FAIL,
      });
    }
  } else {
    // invalid format of keys or missing name
    PopupPort.postMessage({
      type: MSG_IMPORT_KEY_RES,
      status: STATUS_FAIL,
    });
  }
}

function onMsgLogOut() {
  keyStore.lock();
  createPageSelectObject()
    .then(p => PopupPort.postMessage(p));
}

function onMsgPassword(password) {
  // login - password is checked within unlock function
  keyStore.unlock(password)
    .then(() => createPageSelectObject())
    .then(p => PopupPort.postMessage(p))
    .catch(() => PopupPort.postMessage({ type: MSG_INVALID_PASSWORD }));
}

/**
 * Checks if provided string can be used as password.
 * @param p proposed password
 * @returns {boolean} true if p can be used as password
 */
function isValidPassword(p) {
  // TODO validate password (length, chars)
  return (typeof p === 'string' && p.length > 0);
}

function onMsgPasswordNew(password) {
  const isValid = isValidPassword(password);
  if (isValid) {
    KeyStore.isAccount()
      .then((isAccount) => {
        if (isAccount) {
          if (keyStore.isLoggedIn()) {
            // change password

          } else {
            // reject request
            createPageSelectObject()
              .then(p => PopupPort.postMessage(p));
          }
        } else {
          // create new account
          KeyStore.createAccount(password)
            .then(() => keyStore.unlock(password))
            .then(() => createPageSelectObject())
            .then(p => PopupPort.postMessage(p))
            .catch(e => console.error(e));
        }
      });
  } else {
    PopupPort.postMessage({ type: MSG_INVALID_NEW_PASSWORD });
  }
}

function onMsgTxReject(ts) {
  // remove from storage
  let status = STATUS_FAIL;
  store.getData(STORE_KEY_TX)
    .then((v) => {
      const val = v;
      val[ts] = undefined;
      return store.setData(STORE_KEY_TX, val);
    })
    .then(() => {
      status = STATUS_SUCCESS;
    })
    .catch((e) => {
      console.error(e);
    })
    .finally(() => PopupPort.postMessage({
      type: MSG_TX_REJECT_RES,
      status,
      data: ts,
    }));
}

function onMsgTxSign(data) {
  const {
    ts,
    d: txData,
    h: txAccountHashin,
  } = data;

  const dataToSign = txAccountHashin + txData;
  // TODO select key
  const key = 'name1';

  let signature;
  try {
    signature = keyStore.sign(dataToSign, key);
  } catch (err) {
    console.error(err.message);
  }

  const status = signature ? STATUS_SUCCESS : STATUS_FAIL;
  PopupPort.postMessage({
    type: MSG_TX_SIGN_RES,
    status,
    data: ts,
  });
  if (STATUS_SUCCESS === status) {
    const resp = {
      mid: data.m,
      txAccountHashin,
      txData,
      txSignature: signature,
    };
    ProxyPort.postMessage({
      type: MSG_TRANSACTION_SIGNED,
      status: STATUS_SUCCESS,
      data: resp,
    });

    // remove from store
    store.getData(STORE_KEY_TX)
      .then((v) => {
        const val = v;
        val[ts] = undefined;
        return store.setData(STORE_KEY_TX, val);
      })
      .catch(
        e => console.error(e),
      );
  }
}

function onPopupConnected() {
  createPageSelectObject()
    .then(p => PopupPort.postMessage(p));
}

chrome.runtime.onConnect.addListener(
  (port) => {
    console.log('background.js: onConnect');
    console.log(`connect ${port.name}`);
    console.log(port);
    if (port.sender.id === chrome.i18n.getMessage('@@extension_id')) {
      if (port.name === CONN_ID_PROXY) { // connection with proxy script
        // TODO remove line below = it was added for testing purpose
        port.postMessage({ response: 'yes' });
        ProxyPort = port;
        ProxyPort.onMessage.addListener((message) => {
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
      } else if (port.name === CONN_ID_POPUP) { // connection with popup
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
        PopupPort.onDisconnect.addListener((p) => {
          console.log('background.js: disconnected with popup');
          console.log(p);
          PopupPort = undefined;
        });
      }
    } else {
      console.error('Connection from outside extension.');
    }
  },
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
