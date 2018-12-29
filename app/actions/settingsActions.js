export const IMPORT_ACCOUNT_PK = 'IMPORT_ACCOUNT_PK';
export const IMPORT_ACCOUNT_PK_SUCCESS = 'IMPORT_ACCOUNT_PK_SUCCESS';
export const IMPORT_ACCOUNT_PK_FAILURE = 'IMPORT_ACCOUNT_PK_FAILURE';

export function importAccountPublicKey(pageName, address) {
  return { type: IMPORT_ACCOUNT_PK, pageName, address };
}

export function importAccountPublicKeySuccess(pageName, publicKey) {
  return { type: IMPORT_ACCOUNT_PK_SUCCESS, pageName, publicKey };
}

export function importAccountPublicKeyFailure(pageName, errorMsg, publicKey) {
  return { type: IMPORT_ACCOUNT_PK_FAILURE, pageName, errorMsg, publicKey };
}

