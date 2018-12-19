import ADS from './ads';
import VaultCrypt from './vaultcrypt';

const name = (value, vault) => {
  if (vault.keys.find(key => key.name === value)) {
    return `Key named ${value} already exists`;
  }
  return null;
};
const publicKey = (value) => {
  if (!ADS.validateKey(value)) {
    return 'Please provide an valid public key';
  }
  return null;
};
const secretKey = (value) => {
  if (!ADS.validateKey(value)) {
    return 'Please provide an valid secret key';
  }
  return null;
};
const password = (value, vault) => {
  if (!VaultCrypt.checkPassword(vault, value)) {
    return 'Invalid password';
  }
  return null;
};

export { name, publicKey, secretKey, password };
