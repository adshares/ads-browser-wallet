export const IMPORT_ACCOUNT_PK = 'IMPORT_ACCOUNT_PK';
export const IMPORT_ACCOUNT_PK_SUCCESS = 'IMPORT_ACCOUNT_PK_SUCCESS';
export const IMPORT_ACCOUNT_PK_FAILURE = 'IMPORT_ACCOUNT_PK_FAILURE';
export const CHANGE_PASSWORD_INIT = 'CHANGE_PASSWORD_INIT';
export const SAVE_CHANGED_PASSWORD = 'SAVE_CHANGED_PASSWORD';
export const SAVE_CHANGED_PASSWORD_SUCCESS = 'SAVE_CHANGED_PASSWORD_SUCCESS ';
export const SAVE_CHANGED_PASSWORD_FAILURE = 'SAVE_CHANGED_PASSWORD_FAILURE';

export function importAccountPublicKey(pageName, address) {
  return { type: IMPORT_ACCOUNT_PK, pageName, address };
}

export function importAccountPublicKeySuccess(pageName, publicKey) {
  return { type: IMPORT_ACCOUNT_PK_SUCCESS, pageName, publicKey };
}

export function importAccountPublicKeyFailure(pageName, errorMsg, publicKey) {
  return { type: IMPORT_ACCOUNT_PK_FAILURE, pageName, errorMsg, publicKey };
}

export function changePasswordInit(pageName, actionCallback) {
  return { type: CHANGE_PASSWORD_INIT, pageName, actionCallback };
}

export function saveChangedPassword(pageName, actionCallback) {
  return { type: SAVE_CHANGED_PASSWORD, pageName, actionCallback };
}

export function saveChangedPasswordSuccess(pageName) {
  return { type: SAVE_CHANGED_PASSWORD_SUCCESS, pageName };
}

export function saveChangedPasswordFailure(pageName) {
  return { type: SAVE_CHANGED_PASSWORD_FAILURE, pageName };
}
