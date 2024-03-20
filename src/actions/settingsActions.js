export const SETTINGS = 'SETTINGS';
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
export const CREATE_FREE_ACCOUNT = 'SETTINGS_CREATE_FREE_ACCOUNT';
export const CREATE_FREE_ACCOUNT_SUCCESS = 'SETTINGS_CREATE_FREE_ACCOUNT_SUCCESS';
export const CREATE_FREE_ACCOUNT_FAILURE = 'SETTINGS_CREATE_FREE_ACCOUNT_FAILURE';
export const FIND_ACCOUNTS = 'SETTINGS_FIND_ACCOUNTS';
export const FIND_ACCOUNTS_SUCCESS = 'SETTINGS_FIND_ACCOUNTS_SUCCESS';
export const FIND_ACCOUNTS_FAILURE = 'SETTINGS_FIND_ACCOUNTS_FAILURE';
export const FIND_ALL_ACCOUNTS = 'SETTINGS_FIND_ALL_ACCOUNTS';
export const FIND_ALL_ACCOUNTS_SUCCESS = 'SETTINGS_FIND_ALL_ACCOUNTS_SUCCESS';
export const FIND_ALL_ACCOUNTS_FAILURE = 'SETTINGS_FIND_ALL_ACCOUNTS_FAILURE';

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

export function saveAccountSuccess(account, editedId) {
  return { type: SAVE_ACCOUNT_SUCCESS, account, editedId };
}

export function saveAccountFailure(pageName, editedId, errorMsg) {
  return { type: SAVE_ACCOUNT_FAILURE, pageName, editedId, errorMsg };
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

export function saveKey(pageName, editedId) {
  return { type: SAVE_KEY, pageName, editedId };
}

export function saveKeySuccess(key, editedId) {
  return { type: SAVE_KEY_SUCCESS, key, editedId };
}

export function saveKeyFailure(pageName, editedId, errorMsg) {
  return { type: SAVE_KEY_FAILURE, pageName, editedId, errorMsg };
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

export function createFreeAccount() {
  return { type: CREATE_FREE_ACCOUNT, pageName: CREATE_FREE_ACCOUNT };
}

export function createFreeAccountSuccess(account) {
  return { type: CREATE_FREE_ACCOUNT_SUCCESS, pageName: CREATE_FREE_ACCOUNT, account };
}

export function createFreeAccountFailure(errorMsg) {
  return { type: CREATE_FREE_ACCOUNT_FAILURE, pageName: CREATE_FREE_ACCOUNT, errorMsg };
}

export function findAccounts(publicKey) {
  return { type: FIND_ACCOUNTS, publicKey };
}

export function findAccountsSuccess(accountsCount) {
  return { type: FIND_ACCOUNTS_SUCCESS, accountsCount };
}

export function findAccountsFailure(errorMsg) {
  return { type: FIND_ACCOUNTS_FAILURE, errorMsg };
}

export function findAllAccounts() {
  return { type: FIND_ALL_ACCOUNTS, pageName: SETTINGS };
}

export function findAllAccountsSuccess(accountsCount) {
  return { type: FIND_ALL_ACCOUNTS_SUCCESS, pageName: SETTINGS, accountsCount };
}

export function findAllAccountsFailure(errorMsg) {
  return { type: FIND_ALL_ACCOUNTS_FAILURE, pageName: SETTINGS, errorMsg };
}
