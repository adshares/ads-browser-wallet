export const TOGGLE_AUTHORISATION_DIALOG = 'TOGGLE_AUTHORISATION_DIALOG';
export const INPUT_CHANGED = 'INPUT_CHANGED';
export const PASS_INPUT_CHANGED = 'PASS_INPUT_CHANGED';
export const PASS_INPUT_VALIDATE = 'PASS_INPUT_VALIDATE';
export const PASS_INPUT_VALIDATION_SUCCESS = 'PASS_INPUT_VALIDATION_SUCCESS';
export const PASS_INPUT_VALIDATION_FAILED = 'PASS_INPUT_VALIDATION_FAILED';
export const INPUT_VALIDATION_SUCCESS = 'INPUT_VALIDATION_SUCCESS';
export const INPUT_VALIDATION_FAILED = 'INPUT_VALIDATION_FAILED';
export const FORM_VALIDATE = 'FORM_VALIDATE';
export const FORM_VALIDATION_SUCCESS = 'FORM_VALIDATION_SUCCESS';
export const FORM_VALIDATION_FAILURE = 'FORM_VALIDATION_FAILURE';
export const FORM_CLEAN = 'FORM_CLEAN';
export const TOGGLE_VISIBILITY = 'TOGGLE_VISIBILITY';

const passInputValidate = (pageName, actionCallback) => ({
  type: PASS_INPUT_VALIDATE,
  pageName,
  actionCallback,
});

const passInputValidateSuccess = (pageName, valid) => ({
  type: PASS_INPUT_VALIDATION_SUCCESS,
  pageName,
  valid
});

const passInputValidateFailure = (pageName, errorMsg) => ({
  type: PASS_INPUT_VALIDATION_FAILED,
  pageName,
  errorMsg
});

const inputValidateSuccess = (pageName, inputName) => ({
  type: INPUT_VALIDATION_SUCCESS,
  pageName,
  inputName,
});

const inputValidateFailure = (pageName, inputName, errorMsg) => ({
  type: INPUT_VALIDATION_FAILED,
  pageName,
  inputName,
  errorMsg
});

const formValidate = pageName => ({
  type: FORM_VALIDATE,
  pageName
});

const formValidationSuccess = pageName => ({
  type: FORM_VALIDATION_SUCCESS,
  pageName
});

const formValidationFailure = pageName => ({
  type: FORM_VALIDATION_FAILURE,
  pageName
});

const formClean = pageName => ({
  type: FORM_CLEAN,
  pageName
});

const inputChange = (pageName, inputName, inputValue) => ({
  type: INPUT_CHANGED,
  pageName,
  inputName,
  inputValue
});

const passwordChange = (pageName, inputValue) => ({
  type: PASS_INPUT_CHANGED,
  pageName,
  inputValue
});
const toggleVisibility = (pageName, inputName, shown) => ({
  type: TOGGLE_VISIBILITY,
  pageName,
  inputName,
  shown,
});

const toggleAuthorisationDialog = (pageName, isOpen) => ({
  type: TOGGLE_AUTHORISATION_DIALOG,
  isOpen,
  pageName
});

export {
  inputChange,
  passwordChange,
  inputValidateSuccess,
  inputValidateFailure,
    passInputValidate,
  passInputValidateFailure,
  passInputValidateSuccess,
    formValidate,
  formValidationSuccess,
  formValidationFailure,
  formClean,
  toggleVisibility,
  toggleAuthorisationDialog
};
