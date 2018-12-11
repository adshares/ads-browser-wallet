import CryptoJS from 'crypto-js';

function checkPassword(vault, password) {
  try {
    CryptoJS.AES.decrypt(vault.secret, password).toString(CryptoJS.enc.Utf8);
    return true;
  } catch (err) {
    // Error means that data cannot be decrypted with given password.
    return false;
  }
}

function loadVault(callback) {
  chrome.storage.sync.get('vault', (result) => {
    const vault = {
      secret: result.vault || '',
      sealed: true,
      empty: !result.vault || result.vault.length === 0,
    };
    callback(vault);
  });
}

function saveVault(vault, callback) {
  chrome.storage.sync.set({ vault: vault.secret || '' }, callback);
}

function encryptVault(vault, password) {
  return CryptoJS.AES.encrypt(JSON.stringify({
    seedPhrase: vault.seedPhrase,
    seed: vault.seed,
    keyCount: vault.keys.length,
    accounts: vault.accounts,
  }), password).toString();
}

function decryptVault(vault, password) {
  return JSON.parse(CryptoJS.AES.decrypt(vault.secret, password).toString(CryptoJS.enc.Utf8));
}

export default {
  checkPassword,
  load: loadVault,
  save: saveVault,
  encrypt: encryptVault,
  decrypt: decryptVault,
};
