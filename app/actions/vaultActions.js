export const CREATE = 'VAULT_CREATE';
export const CHANGE_PASSWORD = 'VAULT_CHANGE_PASSWORD';
export const ERASE = 'VAULT_ERASE';
export const UNSEAL = 'VAULT_UNSEAL';
export const UNSEAL_SUCCESS = 'VAULT_UNSEAL_SUCCESS';
export const UNSEAL_FAILURE = 'VAULT_UNSEAL_FAILURE';
export const SEAL = 'VAULT_SEAL';
export const SAVE_ACCOUNT = 'VAULT_SAVE_ACCOUNT';
export const REMOVE_ACCOUNT = 'VAULT_REMOVE_ACCOUNT';
export const GENERATE_KEYS = 'VAULT_GENERATE_KEYS';
export const SAVE_KEY = 'VAULT_SAVE_KEY';
export const REMOVE_KEY = 'VAULT_REMOVE_KEY';
export const SELECT_ACTIVE_ACCOUNT = 'VAULT_SELECT_ACTIVE_ACCOUNT';
export const SWITCH_NETWORK = 'VAULT_SWITCH_NETWORK';


export function create(password, seedPhrase, callback) {
  return { type: CREATE, password, seedPhrase, callback };
}

export function changePassword(password, callback) {
  return { type: CHANGE_PASSWORD, password, callback };
}

export function erase(callback) {
  return { type: ERASE, callback };
}

export function unseal(password) {
  return { type: UNSEAL, password };
}

export function unsealSuccess(unsealedVault) {
  return { type: UNSEAL_SUCCESS, unsealedVault };
}

export function unsealFailure(errorMsg) {
  return { type: UNSEAL_FAILURE, errorMsg };
}

export function seal() {
  return { type: SEAL };
}

export function saveAccount(address, name, callback) {
  return { type: SAVE_ACCOUNT, address, name, callback };
}

export function removeAccount(address, callback) {
  return { type: REMOVE_ACCOUNT, address, callback };
}

export function generateKeys(quantity, callback) {
  return { type: GENERATE_KEYS, quantity, callback };
}

export function saveKey(secretKey, name, callback) {
  return { type: SAVE_KEY, secretKey, name, callback };
}

export function removeKey(publicKey, callback) {
  return { type: REMOVE_KEY, publicKey, callback };
}

export function selectActiveAccount(accountAddress) {
  return { type: SELECT_ACTIVE_ACCOUNT, accountAddress };
}

export function switchNetwork(testnet) {
  return { type: SWITCH_NETWORK, testnet };
}
