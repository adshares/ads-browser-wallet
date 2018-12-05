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
    const unsealedVault = {
      empty: false,
      sealed: false,
      seedPhrase: action.seedPhrase,
      keys: KeyBox.generateKeys(action.seedPhrase, config.initKeysQuantity),
    };
    unsealedVault.secret = VaultCrypt.encrypt(unsealedVault, action.password);

    return unsealedVault;
  },

  [ActionTypes.UNSEAL_VAULT](state, action) {
    const unsealedVault = VaultCrypt.decrypt(state, action.password);
    return {
      ...state,
      ...unsealedVault,
    };
  },

  [ActionTypes.SEAL_VAULT](state, action) {
    return {
      ...state,
      sealed: true,
      secret: VaultCrypt.encrypt(state, action.password)
    };
  },
};

export default function vault(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
