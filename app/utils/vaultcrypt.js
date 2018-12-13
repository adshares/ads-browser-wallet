import CryptoJS from 'crypto-js';

const STORAGE_KEY = 'vault';
const TESTNET_STORAGE_KEY = 'testnetVault';

const SEED_PHRASE = 'p';
const SEED = 's';
const KEY_COUNT = 'c';
const IMPORTED_KEYS = 'k';
const ACCOUNTS = 'a';
const ACCOUNT_ADDRESS = 'a';
const ACCOUNT_NAME = 'n';
const ACCOUNT_PUBLIC_KEY = 'k';
const SETTINGS = 'o';

let isTestnet = false;

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
    [SEED_PHRASE]: vault.seedPhrase,
    [SEED]: vault.seed,
    [KEY_COUNT]: vault.keyCount,
    [ACCOUNTS]: vault.accounts.map(account => (
      {
        [ACCOUNT_ADDRESS]: account.address,
        [ACCOUNT_NAME]: account.name,
        [ACCOUNT_PUBLIC_KEY]: account.publicKey,
      }
    )),
  }), password).toString();
}

function decrypt(encryptedVault, password) {
  const vault = JSON.parse(
    CryptoJS.AES.decrypt(encryptedVault.secret, password).toString(CryptoJS.enc.Utf8)
  );
  return {
    seedPhrase: vault[SEED_PHRASE],
    seed: vault[SEED],
    keyCount: vault[KEY_COUNT],
    accounts: vault[ACCOUNTS].map(account => (
      {
        address: account[ACCOUNT_ADDRESS],
        name: account[ACCOUNT_NAME],
        publicKey: account[ACCOUNT_PUBLIC_KEY],
      }
    )),
  };
}

function load(testnet, callback) {
  isTestnet = testnet;
  const key = isTestnet ? TESTNET_STORAGE_KEY : STORAGE_KEY;
  chrome.storage.sync.get(key, (result) => {
    const vault = {
      secret: result[key] || '',
      sealed: true,
      empty: !result[key] || result[key].length === 0,
    };
    callback(vault);
  });
}

function save(vault, password, callback) {
  const secret = encrypt(vault, password);
  const key = isTestnet ? TESTNET_STORAGE_KEY : STORAGE_KEY;
  chrome.storage.sync.set({ [key]: secret || '' }, callback);
  return secret;
}

function erase(callback) {
  const keys = [TESTNET_STORAGE_KEY];
  if (!isTestnet) {
    keys.push(STORAGE_KEY);
  }
  chrome.storage.sync.remove(keys, callback);
}

export default {
  checkPassword,
  encrypt,
  decrypt,
  load,
  save,
  erase,
};
