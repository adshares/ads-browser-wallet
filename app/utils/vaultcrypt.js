const CryptoJS = require('crypto-js');

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
  let decrypted;
  try {
    // Encoder CryptoJS.enc.Utf8 below is needed to properly encode decrypted data
    decrypted = CryptoJS.AES.decrypt(vault.secret, password).toString(CryptoJS.enc.Utf8);
  } catch (err) {
    // Error means that data cannot be decrypted with given password.
    decrypted = undefined;
  }

  if (!decrypted) {
    throw new Error('Invalid password');
  } else {
    return JSON.parse(decrypted);
  }
}

export default {
  load: loadVault,
  save: saveVault,
  encrypt: encryptVault,
  decrypt: decryptVault,
};
