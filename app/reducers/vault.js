import * as ActionTypes from '../constants/ActionTypes';
import KeyBox from '../utils/keybox';
import VaultCrypt from '../utils/vaultcrypt';
import {
  InvalidPasswordError,
  AccountsLimitError,
  UnknownPublicKeyError,
  ItemNotFound,
} from '../actions/errors';
import config from '../config';

const initialVault = {
  empty: true,
  sealed: true,
  secret: '',
  seedPhrase: '',
  seed: '',
  keys: [],
  importedKeys: [],
  accounts: [],
  selectedAccount: null,
};

const actionsMap = {

  [ActionTypes.CREATE_VAULT](vault, action) {
    console.debug('CREATE_VAULT');
    const seed = KeyBox.seedPhraseToHex(action.seedPhrase);

    const newVault = {
      ...initialVault,
      ...vault,
      empty: false,
      sealed: false,
      seedPhrase: action.seedPhrase,
      seed,
      keys: KeyBox.generateKeys(seed, config.initKeysQuantity),
    };
    newVault.secret = VaultCrypt.save(newVault, action.password, action.callback);

    return newVault;
  },

  [ActionTypes.EREASE_VAULT]() {
    console.debug('EREASE_VAULT');
    //TODO check password
    VaultCrypt.erase();
    return initialVault;
  },

  [ActionTypes.UNSEAL_VAULT](vault, action) {
    console.debug('UNSEAL_VAULT');
    if (!VaultCrypt.checkPassword(vault, action.password)) {
      throw new InvalidPasswordError();
    }

    const unsealedVault = VaultCrypt.decrypt(vault, action.password);
    return {
      ...initialVault,
      ...vault,
      ...unsealedVault,
      keys: KeyBox.generateKeys(
        unsealedVault.seed,
        unsealedVault.keyCount || config.initKeysQuantity
      ),
      sealed: false,
    };
  },

  [ActionTypes.SEAL_VAULT](vault) {
    console.debug('SEAL_VAULT');
    return {
      ...initialVault,
      secret: vault.secret,
      empty: vault.empty,
      sealed: true,
    };
  },

  [ActionTypes.ADD_ACCOUNT](vault, action) {
    console.debug('ADD_ACCOUNT');
    if (!VaultCrypt.checkPassword(vault, action.password)) {
      throw new InvalidPasswordError();
    }
    if (vault.accounts.length >= config.accountsLimit) {
      throw new AccountsLimitError(config.accountsLimit);
    }

    const address = action.address.toUpperCase();
    const name = action.name;
    const publicKey = action.publicKey.toUpperCase();
    const key = vault.keys.find(k => k.publicKey === publicKey);

    if (!key) {
      throw new UnknownPublicKeyError(action.publicKey);
    }

    const updatedVault = {
      ...initialVault,
      ...vault,
    };
    updatedVault.accounts.push({
      address,
      name,
      publicKey,
      secretKey: key.secretKey,
    });
    updatedVault.secret = VaultCrypt.save(updatedVault, action.password, action.callback);

    return updatedVault;
  },

  [ActionTypes.UPDATE_ACCOUNT](vault, action) {
    console.debug('UPDATE_ACCOUNT');
    if (!VaultCrypt.checkPassword(vault, action.password)) {
      throw new InvalidPasswordError();
    }

    const address = action.address.toUpperCase();
    const name = action.name;
    const publicKey = action.publicKey.toUpperCase();
    const key = vault.keys.find(k => k.publicKey === publicKey);

    if (!key) {
      throw new UnknownPublicKeyError(action.publicKey);
    }

    const account = vault.accounts.find(a => a.address === address);
    if (!account) {
      throw new ItemNotFound('account', action.address);
    }

    account.name = name;
    account.publicKey = publicKey;
    account.secretKey = key.secretKey;

    const updatedVault = {
      ...initialVault,
      ...vault,
    };
    updatedVault.secret = VaultCrypt.save(updatedVault, action.password, action.callback);

    return updatedVault;
  },

  [ActionTypes.REMOVE_ACCOUNT](vault, action) {
    console.debug('REMOVE_ACCOUNT');
    if (!VaultCrypt.checkPassword(vault, action.password)) {
      throw new InvalidPasswordError();
    }

    const address = action.address.toUpperCase();
    const account = vault.accounts.find(a => a.address === address);
    if (!account) {
      throw new ItemNotFound('account', action.address);
    }

    const updatedVault = {
      ...initialVault,
      ...vault,
    };
    updatedVault.accounts = vault.accounts.filter(a => a.address !== address);
    updatedVault.secret = VaultCrypt.save(updatedVault, action.password, action.callback);

    return updatedVault;
  },

  [ActionTypes.IMPORT_KEY](vault, action) {
    console.debug('IMPORT_KEY');
    if (!VaultCrypt.checkPassword(vault, action.password)) {
      throw new InvalidPasswordError();
    }

    const updatedVault = { ...vault };
    updatedVault.keys.push({
      name: action.name,
      secretKey: action.secretKey,
      publicKey: action.publicKey,
    });

    updatedVault.secret = VaultCrypt.encrypt(updatedVault, action.password);
    VaultCrypt.save(updatedVault, action.callback);

    return updatedVault;
  },
};

export default function (vault = initialVault, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return vault;
  return reduceFn(vault, action);
}
