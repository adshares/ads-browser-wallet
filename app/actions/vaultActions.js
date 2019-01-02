export const CREATE = 'CREATE';
export const CHANGE_PASSWORD = 'VAULT_CHANGE_PASSWORD';
export const ERASE = 'ERASE';
export const ERASE_INIT = 'ERASE_INIT';
export const UNSEAL = 'UNSEAL';
export const UNSEAL_SUCCESS = 'UNSEAL_SUCCESS';
export const UNSEAL_FAILURE = 'UNSEAL_FAILURE';
export const SEAL = 'SEAL';
export const ADD_ACCOUNT_INIT = 'ADD_ACCOUNT_INIT';
export const ADD_ACCOUNT = 'ADD_ACCOUNT';
export const REMOVE_ACCOUNT_INIT = 'REMOVE_ACCOUNT_INIT';
export const REMOVE_ACCOUNT = 'REMOVE_ACCOUNT';
export const UPDATE_ACCOUNT_INIT = 'UPDATE_ACCOUNT_INIT';
export const UPDATE_ACCOUNT = 'UPDATE_ACCOUNT';
export const IMPORT_KEY_INIT = 'IMPORT_KEY_INIT';
export const IMPORT_KEY = 'IMPORT_KEY';
export const REMOVE_KEY = 'REMOVE_KEY';
export const REMOVE_KEY_INIT = 'REMOVE_KEY_INIT';
export const SAVE_GENERATED_KEYS = 'SAVE_GENERATED_KEYS';
export const SAVE_GENERATED_KEYS_INIT = 'SAVE_GENERATED_KEYS_INIT';
export const SELECT_ACTIVE_ACCOUNT = 'SELECT_ACTIVE_ACCOUNT';
export const SWITCH_NETWORK = 'SWITCH_NETWORK';


export function create(password, seedPhrase, callback) {
  return { type: CREATE, password, seedPhrase, callback };
}

export function changePassword(password, callback) {
  return { type: CHANGE_PASSWORD, password, callback };
}

export function erase() {
  return { type: ERASE };
}

export function eraseInit() {
  return { type: ERASE_INIT };
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

export function addAccountInit() {
  return { type: ADD_ACCOUNT_INIT };
}

export function addAccount({ address, name, publicKey, password }) {
  return { type: ADD_ACCOUNT, address, name, publicKey, password };
}

export function updateAccountInit() {
  return { type: UPDATE_ACCOUNT_INIT };
}

export function updateAccount({ address, name, publicKey, password }) {
  return { type: UPDATE_ACCOUNT, address, name, publicKey, password };
}

export function removeAccountInit(address) {
  return { type: REMOVE_ACCOUNT_INIT, address };
}

export function removeAccount(updatedAccounts, password) {
  return { type: REMOVE_ACCOUNT, updatedAccounts, password };
}

export function importKeyInit() {
  return { type: IMPORT_KEY_INIT };
}

export function importKey({ name, publicKey, secretKey, password }) {
  return { type: IMPORT_KEY, name, publicKey, secretKey, password };
}

export function removeKey(keysArr, password) {
  return { type: REMOVE_KEY, keysArr, password };
}

export function removeKeyInit(secretKey) {
  return { type: REMOVE_KEY_INIT, secretKey };
}

export function selectActiveAccount(accountAddress) {
  return { type: SELECT_ACTIVE_ACCOUNT, accountAddress };
}

export function switchNetwork(testnet) {
  return { type: SWITCH_NETWORK, testnet };
}

export function saveGeneratedKeysInit(keys) {
  return { type: SAVE_GENERATED_KEYS_INIT, keys };
}

export function saveGeneratedKeys(keys, newKeyCount, password) {
  return { type: SAVE_GENERATED_KEYS, keys, newKeyCount, password };
}
