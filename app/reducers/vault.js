import * as ActionTypes from '../constants/ActionTypes';
import KeyBox from '../utils/keybox';
import VaultCrypt from '../utils/vaultcrypt';
import config from '../config';

const initialState = {
  empty: true,
  sealed: true,
  secrets: '',
};

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
    vault.secret = VaultCrypt.encrypt(vault, action.password);
    VaultCrypt.save(vault);

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
    const unsealedVault = VaultCrypt.decrypt(vault, action.password);
    return {
      ...vault,
      ...unsealedVault,
      keys: KeyBox.generateKeys(unsealedVault.seed, unsealedVault.keyCount || config.initKeysQuantity),
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

  [ActionTypes.SYNC_VAULT](vault, action) {
    console.debug('SYNC_VAULT');
    return {
      ...vault,
      secret: VaultCrypt.encrypt(vault, action.password)
    };
  },
};

export default function (state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
