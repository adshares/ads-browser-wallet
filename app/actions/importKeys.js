export const SAVE_KEY = 'SAVE_KEY';
export const VALIDATE_FORM = 'VALIDATE_FORM';
export const VALIDATE_FORM_SUCCESS = 'VALIDATE_FORM_SUCCESS';
export const VALIDATE_FORM_FAILED = 'VALIDATE_FORM_FAILED';
export const IMPORT_KEY = 'IMPORT_KEY';

export function saveKey() {
  return { type: SAVE_KEY };
}

export function validateFormSuccess(payload) {
  return { type: VALIDATE_FORM_SUCCESS, payload };
}

export function validateFormFailed(payload) {
  return { type: VALIDATE_FORM_FAILED, payload };
}

export function validateForm(payload) {
  return { type: VALIDATE_FORM, payload };
}

export function importKey(payload) {
  return { type: IMPORT_KEY, payload };
}
