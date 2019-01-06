export const CREATE = 'VAULT_CREATE';
export const CHANGE_PASSWORD = 'VAULT_CHANGE_PASSWORD';
export const ERASE = 'VAULT_ERASE';
export const UNSEAL = 'VAULT_UNSEAL';
export const UNSEAL_SUCCESS = 'VAULT_UNSEAL_SUCCESS';
export const UNSEAL_FAILURE = 'VAULT_UNSEAL_FAILURE';
export const SEAL = 'VAULT_SEAL';
export const ADD_ACCOUNT_INIT = 'VAULT_ADD_ACCOUNT_INIT';
export const ADD_ACCOUNT = 'VAULT_ADD_ACCOUNT';
export const REMOVE_ACCOUNT_INIT = 'VAULT_REMOVE_ACCOUNT_INIT';
export const REMOVE_ACCOUNT = 'VAULT_REMOVE_ACCOUNT';
export const UPDATE_ACCOUNT_INIT = 'VAULT_UPDATE_ACCOUNT_INIT';
export const UPDATE_ACCOUNT = 'VAULT_UPDATE_ACCOUNT';
export const ADD_KEY = 'VAULT_ADD_KEY';
export const REMOVE_KEY = 'VAULT_REMOVE_KEY';
export const GENERATE_KEYS = 'VAULT_GENERATE_KEYS';
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

export function addAccountInit() {
  return { type: ADD_ACCOUNT_INIT };
}

export function addAccount({ address, name, password }) {
  return { type: ADD_ACCOUNT, address, name, password };
}

export function updateAccountInit() {
  return { type: UPDATE_ACCOUNT_INIT };
}

export function updateAccount({ address, name, password }) {
  return { type: UPDATE_ACCOUNT, address, name, password };
}

export function removeAccountInit(address) {
  return { type: REMOVE_ACCOUNT_INIT, address };
}

export function removeAccount(updatedAccounts, password) {
  return { type: REMOVE_ACCOUNT, updatedAccounts, password };
}

export function generateKeys(quantity, password, callback) {
  return { type: GENERATE_KEYS, quantity, password, callback };
}

export function addKey(name, secretKey, password, callback) {
  return { type: ADD_KEY, name, secretKey, password, callback };
}

export function removeKey(publicKey, password, callback) {
  return { type: REMOVE_KEY, publicKey, password, callback };
}

export function selectActiveAccount(accountAddress) {
  return { type: SELECT_ACTIVE_ACCOUNT, accountAddress };
}

export function switchNetwork(testnet) {
  return { type: SWITCH_NETWORK, testnet };
}
