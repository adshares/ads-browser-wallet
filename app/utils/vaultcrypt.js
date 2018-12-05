const CryptoJS = require('crypto-js');

function encryptVault(vault, password) {
  const data = { ...vault };
  delete data.secret;

  return CryptoJS.AES.encrypt(JSON.stringify(data), password).toString();
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
  encrypt: encryptVault,
  decrypt: decryptVault,
};
