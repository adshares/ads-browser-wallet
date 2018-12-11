import * as ActionTypes from '../constants/ActionTypes';
import KeyBox from '../utils/keybox';
import VaultCrypt from '../utils/vaultcrypt';
import { InvalidPasswordError } from '../actions/errors';
import config from '../config';

const initialVault = {
  empty: true,
  sealed: true,
  secret: '',
  seedPhrase: '',
  seed: '',
  keys: [],
  accounts: [],
  selectedAccount: null,
};

const actionsMap = {

  [ActionTypes.CREATE_VAULT](initialVault, action) {
    console.debug('CREATE_VAULT');
    const seed = KeyBox.seedPhraseToHex(action.seedPhrase);
    const vault = {
      ...initialVault,
      empty: false,
      sealed: false,
      seedPhrase: action.seedPhrase,
      seed,
      keys: KeyBox.generateKeys(seed, config.initKeysQuantity),
    };
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
    VaultCrypt.save(initialVault);

    return initialVault;
  },

  [ActionTypes.UNSEAL_VAULT](vault, action) {
    console.debug('UNSEAL_VAULT');
    if (!VaultCrypt.checkPassword(vault, action.password)) {
      throw new InvalidPasswordError();
    }
    const unsealedVault = VaultCrypt.decrypt(vault, action.password);
    return {
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

export default function (vault = initialVault, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return vault;
  return reduceFn(vault, action);
}
