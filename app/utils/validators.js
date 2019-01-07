import ADS from './ads';
import VaultCrypt from './vaultcrypt';
import config from '../config/config';
import AccountEditorPage from '../containers/Settings/AccountEditorPage';
import { getPublicKeyFromSecret } from './keybox';
import { SAVE_KEY, SAVE_ACCOUNT } from '../actions/settingsActions';

const name = ({ pageName, value, vault }) => {
  if (pageName === SAVE_KEY) {
    if (vault.keys.find(key => key.name === value)) {
      return `Key named ${value} already exists`;
    }
    if (vault.keys.filter(key => key.type === 'imported').length >=
      config.importedKeysLimit) {
      return 'Maximum imported keys limit has been reached. Please remove unused keys.';
    }
  }
  if (pageName === SAVE_ACCOUNT &&
    vault.accounts.find(account => account.name === value)) {
    return `Account named ${value} already exists`;
  }
  if (vault.length > config.itemNameMaxLength) {
    return `Given name ${value} is too long.`;
  }

  if (!value) {
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
    !keys.find(({ secretKey }) => getPublicKeyFromSecret(secretKey) === value)) {
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

const address = ({ value, vault }) => {
  if (!value || !ADS.validateAddress(value)) {
    return 'Please provide an valid account address';
  }
  if (vault.accounts.find(a => a.address.toUpperCase() === value.toUpperCase())) {
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
