import ADS from './ads';
import VaultCrypt from './vaultcrypt';
import KeyBox from './keybox';

const name = ({value, vault}) => {
  if (vault.keys.find(key => key.name === value)) {
    return `Key named ${value} already exists`;
  }
  return null;
};
const publicKey = ({value, inputs}) => {
  if (!inputs.secretKey || !inputs.secretKey.value) {
    throw new Error('Provide secretKey to full fil publicKey validation');
  }

  if (!ADS.validateKey(value)) {
    return 'Please provide an valid public key';
  }

  console.log('inputs.secretKey.value', inputs.secretKey.value)

  if (KeyBox.getPublicKey(inputs.secretKey.value) !== value) {
    return 'Public and secret key does not match';
  }

  return null;
};
const secretKey = ({value}) => {
  if (!ADS.validateKey(value)) {
    return 'Please provide an valid secret key';
  }
  return null;
};
const password = ({value, vault}) => {
  if (!VaultCrypt.checkPassword(vault, value)) {
    return 'Invalid password';
  }
  return null;
};

export { name, publicKey, secretKey, password };
