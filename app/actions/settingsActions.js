export const IMPORT_ACCOUNT_PK = 'IMPORT_ACCOUNT_PK';
export const IMPORT_ACCOUNT_PK_SUCCESS = 'IMPORT_ACCOUNT_PK_SUCCESS';
export const IMPORT_ACCOUNT_PK_FAILURE = 'IMPORT_ACCOUNT_PK_FAILURE';
export const SETTINGS_CHANGE_PASSWORD_INIT = 'SETTINGS_CHANGE_PASSWORD_INIT';
export const SETTINGS_CHANGE_PASSWORD = 'SETTINGS_CHANGE_PASSWORD';
export const SETTINGS_PASSWORD_CHANGE_SUCCESS = 'SETTINGS_PASSWORD_CHANGE_SUCCESS ';
export const SETTINGS_PASSWORD_CHANGE_FAILURE = 'SETTINGS_PASSWORD_CHANGE_FAILURE';

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
  return { type: SETTINGS_CHANGE_PASSWORD_INIT, pageName, actionCallback };
}

export function changePassword(pageName) {
  return { type: SETTINGS_CHANGE_PASSWORD, pageName };
}

export function passwordChangeSuccess(pageName) {
  return { type: SETTINGS_PASSWORD_CHANGE_SUCCESS, pageName };
}

export function passwordChangeFailure(pageName, errorMsg) {
  return { type: SETTINGS_PASSWORD_CHANGE_FAILURE, pageName, errorMsg };
}
