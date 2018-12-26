import ADS from './ads';
import VaultCrypt from './vaultcrypt';
import KeyBox from './keybox';
import KeysImporterPage from '../containers/Settings/KeysImporterPage';
import config from '../config';
import AccountEditorPage from '../containers/Settings/AccountEditorPage';


const name = ({pageName, value, vault}) => {
  if (pageName === KeysImporterPage.PAGE_NAME && vault.keys.find(key => key.name === value)) {
    return `Key named ${value} already exists`;
  }
  if (pageName === AccountEditorPage.PAGE_NAME &&
    vault.accounts.find(account => account.name === value)) {
    return `Account named ${value} already exists`;
  }
  if (vault.length > config.accountAndKeyNameMaxLength) {
    return `Given name ${value} is too long.`;
  }
  return null;
};
const publicKey = ({value, inputs, vault, pageName}) => {

  console.log('ADS.validateKey(value)', ADS.validateKey(value));
  if (!ADS.validateKey(value)) {
    return 'Please provide an valid public key';
  }
  const keys = vault.keys;
  if (pageName === KeysImporterPage.PAGE_NAME) {
    if (!inputs.secretKey || !inputs.secretKey.value) {
      throw new Error('Provide secretKey to full fil publicKey validation');
    }
    if (KeyBox.getPublicKeyFromSecret(inputs.secretKey.value) !== value) {
      return 'Public and secret key does not match';
    }
    if (keys.find(key => key.publicKey === value)) {
      return 'Given public key already exists in data base';
    }
    if (keys.filter(key => key.type === 'imported').length >=
      config.importedKeysLimit) {
      return `You've already imported ${config.importedKeysLimit}. To import more keys increase
       your imported keys limit`;
    }
  } else if (pageName === AccountEditorPage.PAGE_NAME && !keys.find(key => key.publicKey.toUpperCase() === value)) {
    return 'Cannot find a key in storage. Please import secret key first.';
  }
  return null;
};

const secretKey = ({value, vault}) => {
  if (!ADS.validateKey(value)) {
    return 'Please provide an valid secret key';
  }
  if (vault.keys.find(key => key.secretKey === value)) {
    return 'Given secret key already exists in data base';
  }
  return null;
};
const password = ({value, vault}) => {
  if (!VaultCrypt.checkPassword(vault, value)) {
    return 'Invalid password';
  }
  return null;
};

const address = ({value, vault}) => {
  if (!value || !ADS.validateAddress(value)) {
    return 'Please provide an valid account address';
  }
  if (vault.accounts.find(a => a.address.toUpperCase() === value.toUpperCase())) {
    return `Account ${value} already exists`;
  }
  return null;
};

export {name, publicKey, secretKey, password, address};
