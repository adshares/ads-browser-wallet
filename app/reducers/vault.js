import * as ActionTypes from '../constants/ActionTypes';
import KeyBox from '../utils/keybox';
import VaultCrypt from '../utils/vaultcrypt';
import { InvalidPasswordError } from '../actions/errors';
import config from '../config';

const initialState = {};

const actionsMap = {

  [ActionTypes.CREATE_VAULT](state, action) {
    console.debug('CREATE_VAULT');
    const vault = {
      empty: false,
      sealed: false,
      seedPhrase: action.seedPhrase,
    };
    vault.seed = KeyBox.seedPhraseToHex(action.seedPhrase);
    vault.keys = KeyBox.generateKeys(vault.seed, config.initKeysQuantity);
    vault.accounts = [];
    vault.secret = VaultCrypt.encrypt(vault, action.password);

    if (action.callback) {
      VaultCrypt.save(vault, action.callback);
    } else {
      VaultCrypt.save(vault);
    }

    return vault;
  },

  [ActionTypes.EREASE_VAULT]() {
    console.debug('EREASE_VAULT');
    const vault = {
      empty: true,
      sealed: true,
      secret: '',
    };
    VaultCrypt.save(vault);

    return vault;
  },

  [ActionTypes.UNSEAL_VAULT](vault, action) {
    console.debug('UNSEAL_VAULT');
    if (!VaultCrypt.checkPassword(vault, action.password)) {
      throw new InvalidPasswordError();
    }
    const unsealedVault = VaultCrypt.decrypt(vault, action.password);
    return {
      accounts: [],
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

    const updatedVault = { ...vault };
    updatedVault.accounts.push({
      name: action.name,
      id: action.accountId,
      publicKey: action.publicKey,
    });
    updatedVault.secret = VaultCrypt.encrypt(updatedVault, action.password);
    VaultCrypt.save(updatedVault, action.callback);

    return updatedVault;
  },
};

export default function (state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
