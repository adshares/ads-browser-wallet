export const SECRET_DATA_ACCESS = 'SETTINGS_SECRET_DATA_ACCESS';
export const SECRET_DATA_ACCESS_GRANTED = 'SETTINGS_SECRET_DATA_ACCESS_GRANTED';
export const SECRET_DATA_ACCESS_DENIED = 'SETTINGS_SECRET_DATA_ACCESS_DENIED';
export const IMPORT_ACCOUNT_PK = 'SETTINGS_IMPORT_ACCOUNT_PK';
export const IMPORT_ACCOUNT_PK_SUCCESS = 'SETTINGS_IMPORT_ACCOUNT_PK_SUCCESS';
export const IMPORT_ACCOUNT_PK_FAILURE = 'SETTINGS_IMPORT_ACCOUNT_PK_FAILURE';
export const SAVE_ACCOUNT = 'SETTINGS_SAVE_ACCOUNT';
export const SAVE_ACCOUNT_SUCCESS = 'SETTINGS_SAVE_ACCOUNT_SUCCESS';
export const SAVE_ACCOUNT_FAILURE = 'SETTINGS_SAVE_ACCOUNT_FAILURE';
export const REMOVE_ACCOUNT = 'SETTINGS_REMOVE_ACCOUNT';
export const REMOVE_ACCOUNT_SUCCESS = 'SETTINGS_REMOVE_ACCOUNT_SUCCESS';
export const REMOVE_ACCOUNT_FAILURE = 'SETTINGS_REMOVE_ACCOUNT_FAILURE';
export const GENERATE_KEYS = 'SETTINGS_GENERATE_KEYS';
export const GENERATE_KEYS_SUCCESS = 'SETTINGS_GENERATE_KEYS_SUCCESS';
export const GENERATE_KEYS_FAILURE = 'SETTINGS_GENERATE_KEYS_FAILURE';
export const SAVE_KEY = 'SETTINGS_SAVE_KEY';
export const SAVE_KEY_SUCCESS = 'SETTINGS_SAVE_KEY_SUCCESS';
export const SAVE_KEY_FAILURE = 'SETTINGS_SAVE_KEY_FAILURE';
export const REMOVE_KEY = 'SETTINGS_REMOVE_KEY';
export const REMOVE_KEY_SUCCESS = 'SETTINGS_REMOVE_KEY_SUCCESS';
export const REMOVE_KEY_FAILURE = 'SETTINGS_REMOVE_KEY_FAILURE';
export const CHANGE_PASSWORD = 'SETTINGS_CHANGE_PASSWORD';
export const PASSWORD_CHANGE_SUCCESS = 'SETTINGS_PASSWORD_CHANGE_SUCCESS ';
export const PASSWORD_CHANGE_FAILURE = 'SETTINGS_PASSWORD_CHANGE_FAILURE';
export const ERASE_STORAGE = 'SETTINGS_ERASE_STORAGE';
export const ERASE_STORAGE_SUCCESS = 'SETTINGS_ERASE_STORAGE_SUCCESS';
export const ERASE_STORAGE_FAILURE = 'SETTINGS_ERASE_STORAGE_FAILURE';

export function secretDataAccess(name) {
  return { type: SECRET_DATA_ACCESS, name };
}

export function secretDataAccessGranted(name) {
  return { type: SECRET_DATA_ACCESS_GRANTED, name };
}

export function secretDataAccessDenied(name) {
  return { type: SECRET_DATA_ACCESS_DENIED, name };
}

export function importAccountPublicKey(pageName, address) {
  return { type: IMPORT_ACCOUNT_PK, pageName, address };
}

export function importAccountPublicKeySuccess(pageName, publicKey) {
  return { type: IMPORT_ACCOUNT_PK_SUCCESS, pageName, publicKey };
}

export function importAccountPublicKeyFailure(pageName, errorMsg, publicKey) {
  return { type: IMPORT_ACCOUNT_PK_FAILURE, pageName, errorMsg, publicKey };
}

export function saveAccount(pageName, editedId) {
  return { type: SAVE_ACCOUNT, pageName, editedId };
}

export function saveAccountSuccess(pageName) {
  return { type: SAVE_ACCOUNT_SUCCESS, pageName };
}

export function saveAccountFailure(pageName, errorMsg) {
  return { type: SAVE_ACCOUNT_FAILURE, pageName, errorMsg };
}

export function removeAccount(address) {
  return { type: REMOVE_ACCOUNT, address };
}

export function removeAccountSuccess(address) {
  return { type: REMOVE_ACCOUNT_SUCCESS, address };
}

export function removeAccountFailure(address, errorMsg) {
  return { type: REMOVE_ACCOUNT_FAILURE, address, errorMsg };
}

export function generateKeys(quantity) {
  return { type: GENERATE_KEYS, quantity };
}

export function generateKeysSuccess() {
  return { type: GENERATE_KEYS_SUCCESS };
}

export function generateKeysFailure(errorMsg) {
  return { type: GENERATE_KEYS_FAILURE, errorMsg };
}

export function saveKey(pageName) {
  return { type: SAVE_KEY, pageName };
}

export function saveKeySuccess(pageName) {
  return { type: SAVE_KEY_SUCCESS, pageName };
}

export function saveKeyFailure(pageName, errorMsg) {
  return { type: SAVE_KEY_FAILURE, pageName, errorMsg };
}

export function removeKey(publicKey) {
  return { type: REMOVE_KEY, publicKey };
}

export function removeKeySuccess(publicKey) {
  return { type: REMOVE_KEY_SUCCESS, publicKey };
}

export function removeKeyFailure(publicKey, errorMsg) {
  return { type: REMOVE_KEY_FAILURE, publicKey, errorMsg };
}

export function changePassword(pageName) {
  return { type: CHANGE_PASSWORD, pageName };
}

export function passwordChangeSuccess(pageName) {
  return { type: PASSWORD_CHANGE_SUCCESS, pageName };
}

export function passwordChangeFailure(pageName, errorMsg) {
  return { type: PASSWORD_CHANGE_FAILURE, pageName, errorMsg };
}

export function eraseStorage() {
  return { type: ERASE_STORAGE };
}

export function eraseStorageSuccess() {
  return { type: ERASE_STORAGE_SUCCESS };
}

export function eraseStorageFailure(errorMsg) {
  return { type: ERASE_STORAGE_FAILURE, errorMsg };
}
