import CryptoJS from 'crypto-js';

const STORAGE_KEY = 'vault';
const TESTNET_STORAGE_KEY = 'testnetValut';

const SEED_PHRASE = 'p';
const SEED = 's';
const KEY_COUNT = 'c';
const IMPORTED_KEYS = 'k';
const ACCOUNTS = 'a';
const ACCOUNT_ADDRESS = 'a';
const ACCOUNT_NAME = 'n';
const ACCOUNT_PUBLIC_KEY = 'k';
const SETTINGS = 'o';

function checkPassword(vault, password) {
  try {
    CryptoJS.AES.decrypt(vault.secret, password).toString(CryptoJS.enc.Utf8);
    return true;
  } catch (err) {
    // Error means that data cannot be decrypted with given password.
    return false;
  }
}

function encrypt(vault, password) {
  return CryptoJS.AES.encrypt(JSON.stringify({
    seedPhrase: vault.seedPhrase,
    seed: vault.seed,
    keyCount: vault.keys.length,
    accounts: vault.accounts,
  }), password).toString();
}

function decrypt(vault, password) {
  return JSON.parse(CryptoJS.AES.decrypt(vault.secret, password).toString(CryptoJS.enc.Utf8));
}

function load(callback) {
  chrome.storage.sync.get(STORAGE_KEY, (result) => {
    const vault = {
      secret: result.vault || '',
      sealed: true,
      empty: !result.vault || result.vault.length === 0,
    };
    callback(vault);
  });
}

function save(vault, password, callback) {
  const secret = encrypt(vault, password);
  chrome.storage.sync.set({ [STORAGE_KEY]: secret || '' }, callback);
  return secret;
}

function erase(callback) {
  chrome.storage.sync.remove(STORAGE_KEY, callback);
}

export default {
  checkPassword,
  encrypt,
  decrypt,
  load,
  save,
  erase,
};
