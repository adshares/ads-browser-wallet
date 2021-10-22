import ADS from './ads';
import VaultCrypt from './vaultcrypt';
import config from '../config/config';
import { getPublicKeyFromSecret, findKeyIndex } from './keybox';
import { SAVE_KEY, SAVE_ACCOUNT } from '../actions/settingsActions';

const name = ({ pageName, value, vault, editedId }) => {
  const val = value.trim();
  if (pageName === SAVE_KEY) {
    if (vault.keys.find(key => key.name.toLowerCase() === val.toLowerCase())) {
      return `Key named ${val} already exists`;
    }
    if (vault.keys.filter(key => key.type === 'imported').length >=
      config.importedKeysLimit) {
      return 'Maximum imported keys limit has been reached. Please remove unused keys.';
    }
  }
  if (pageName === SAVE_ACCOUNT && val.length > 0 && vault.accounts.find(a =>
    a.address !== editedId && a.name.toLowerCase() === val.toLowerCase()
  )) {
    return `Account named ${val} already exists`;
  }
  if (val.length > config.itemNameMaxLength) {
    return `Given name is too long (max ${config.itemNameMaxLength} characters).`;
  }

  if (pageName !== SAVE_ACCOUNT && !val) {
    return 'Name cannot be empty';
  }
  return null;
};

const publicKey = ({ value, inputs, vault, pageName }) => {
  if (!ADS.validateKey(value)) {
    return 'Please provide an valid public key';
  }
  const keys = vault.keys;

  if (pageName === SAVE_KEY) {
    if (!inputs.secretKey || !inputs.secretKey.value) {
      throw new Error('Provide secretKey to full fil publicKey validation');
    }
    if (getPublicKeyFromSecret(inputs.secretKey.value) !== value) {
      return 'Public and secret key does not match';
    }
  } else if (pageName === SAVE_ACCOUNT &&
    !keys.find(k => k.publicKey === value) &&
    findKeyIndex(vault.seed, value) < 0) {
    return 'Cannot find a key in storage. Please import secret key first.';
  }
  return null;
};

const secretKey = ({ value, vault }) => {
  if (!ADS.validateKey(value)) {
    return 'Please provide an valid secret key';
  }
  if (vault.keys.find(key => key.secretKey === value)) {
    return 'Given secret key already exists in data base';
  }
  return null;
};

const password = ({ value, vault }) => {
  if (!VaultCrypt.checkPassword(vault, value)) {
    return 'Invalid password';
  }
  return null;
};

const newPassword = ({ value, vault }) => {
  if (!value) {
    return 'New password field is required';
  }
  if (value.length < config.passwordMinLength) {
    return `Password too short - min. length is ${config.passwordMinLength}`;
  }
  if (VaultCrypt.checkPassword(vault, value)) {
    return 'New password cannot match old one';
  }
  return null;
};

const repeatedPassword = ({ value, inputs }) => {
  if (inputs.newPassword.value !== value) {
    return 'Passwords are not identical';
  }
  return null;
};

const address = ({ value, vault, editedId }) => {
  if (!value || !ADS.validateAddress(value)) {
    return 'Please provide an valid account address';
  }
  if (vault.accounts.find(a =>
    a.address !== editedId && ADS.compareAddresses(a.address, value)
  )) {
    return `Account ${value} already exists`;
  }
  return null;
};

const amount = ({ value }) => {
  if (!/^[0-9,.]*$/.test(value)) {
    return 'Invalid amount';
  }
  return null;
};

const message = ({ value }) => {
  const maxLength = 64;
  if (!/^[0-9a-fA-F]*$/.test(value)) {
    return 'Message can contain only hexadecimal characters';
  }
  if (value.length > maxLength) {
    return `Massage too long (max ${maxLength} characters)`;
  }
  return null;
};

export {
  name,
  publicKey,
  secretKey,
  password,
  newPassword,
  repeatedPassword,
  address,
  amount,
  message
};
