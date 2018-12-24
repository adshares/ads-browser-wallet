export const VAULT_CREATE = 'VAULT_CREATE';
export const VAULT_EREASE = 'VAULT_EREASE';
export const VAULT_UNSEAL = 'VAULT_UNSEAL';
export const VAULT_SEAL = 'VAULT_SEAL';
export const VAULT_SWITCH_NETWORK = 'VAULT_SWITCH_NETWORK';
export const VAULT_ADD_ACCOUNT = 'VAULT_ADD_ACCOUNT';
export const VAULT_UPDATE_ACCOUNT = 'VAULT_UPDATE_ACCOUNT';
export const VAULT_REMOVE_ACCOUNT = 'VAULT_REMOVE_ACCOUNT';
export const VAULT_IMPORT_KEY = 'VAULT_IMPORT_KEY';


export function create(password, seedPhrase, callback) {
  return { type: VAULT_CREATE, password, seedPhrase, callback };
}

export function erease() {
  return { type: VAULT_EREASE };
}

export function unseal(password) {
  return { type: VAULT_UNSEAL, password };
}

export function seal() {
  return { type: VAULT_SEAL };
}

export function switchNetwork(testnet) {
  return { type: VAULT_SWITCH_NETWORK, testnet };
}

export function addAccount(address, name, publicKey, password, callback) {
  return { type: VAULT_ADD_ACCOUNT, address, name, publicKey, password, callback };
}

export function updateAccount(address, name, publicKey, password, callback) {
  return { type: VAULT_UPDATE_ACCOUNT, address, name, publicKey, password, callback };
}

export function removeAccount(address, password, callback) {
  return { type: VAULT_REMOVE_ACCOUNT, address, password, callback };
}

export function importKey({ name, publicKey, secretKey, password }) {
  return { type: VAULT_IMPORT_KEY, name, publicKey, secretKey, password };
}
