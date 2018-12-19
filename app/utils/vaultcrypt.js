import CryptoJS from 'crypto-js';
import KeyBox from './keybox';
import config from '../config';

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
    console.log('checkPassword', checkPassword)
    return true;
  } catch (err) {
    console.log('err', err)
    // Error means that data cannot be decrypted with given password.
    return false;
  }
}

function encrypt(vault, password) {
  console.log('encrypt', encrypt)
  try{
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
  } catch (e) {
    console.log('e', e)
  }
}

function decrypt(encryptedVault, password) {
  const vault = JSON.parse(
    CryptoJS.AES.decrypt(encryptedVault.secret, password).toString(CryptoJS.enc.Utf8)
  );
  const decryptedVault = {
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
  const keys = KeyBox.generateKeys(
    decryptedVault.seed,
    decryptedVault.keyCount || config.initKeysQuantity
  );
  const accounts = decryptedVault.accounts.map(account => ({
    ...account,
    secretKey: keys.find(k => k.publicKey === account.publicKey).secretKey,
    balance: Math.random() * 1000,
  }));

  return {
    ...decryptedVault,
    keys,
    accounts,
  };
}

function load(testnet, callback) {
  isTestnet = testnet;
  const key = isTestnet ? config.testnetVaultStorageKey : config.vaultStorageKey;
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
  console.log('vault', vault)
  console.log('password', password)
  const secret = encrypt(vault, password);
  console.log('secret', secret)
  const key = isTestnet ? config.testnetVaultStorageKey : config.vaultStorageKey;
  chrome.storage.sync.set({ [key]: secret || '' }, callback);
  return secret;
}

function erase(callback) {
  const keys = [config.testnetVaultStorageKey];
  if (!isTestnet) {
    keys.push(config.vaultStorageKey);
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
