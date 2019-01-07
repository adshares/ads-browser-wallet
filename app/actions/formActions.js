export const INPUT_CHANGED = 'FORM_INPUT_CHANGED';
export const TOGGLE_VISIBILITY = 'FORM_TOGGLE_VISIBILITY';
export const INPUT_VALIDATION_SUCCESS = 'FORM_INPUT_VALIDATION_SUCCESS';
export const INPUT_VALIDATION_FAILED = 'FORM_INPUT_VALIDATION_FAILED';
export const CLEAN_FORM = 'FORM_CLEAN_FORM';
export const VALIDATE_FORM = 'FORM_VALIDATE_FORM';
export const FORM_VALIDATION_SUCCESS = 'FORM_ALIDATION_SUCCESS';
export const FORM_VALIDATION_FAILURE = 'FORM_VALIDATION_FAILURE';
export const ACCOUNT_EDIT_FORM_VALIDATE = 'FORM_ACCOUNT_EDIT_FORM_VALIDATE';
export const ACCOUNT_EDIT_FORM_VALIDATION_SUCCESS = 'FORM_ACCOUNT_EDIT_FORM_VALIDATION_SUCCESS';
export const ACCOUNT_EDIT_FORM_VALIDATION_FAILURE = 'FORM_ACCOUNT_EDIT_FORM_VALIDATION_FAILURE';

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

const validateForm = (pageName, editedId) => ({
  type: VALIDATE_FORM,
  pageName,
  editedId
});

const formValidationSuccess = pageName => ({
  type: FORM_VALIDATION_SUCCESS,
  pageName
});

const formValidationFailure = pageName => ({
  type: FORM_VALIDATION_FAILURE,
  pageName
});

const accountEditFormValidate = (pageName, initialInputValues) => ({
  type: ACCOUNT_EDIT_FORM_VALIDATE,
  pageName,
  initialInputValues
});

const accountEditFormValidationSuccess = pageName => ({
  type: ACCOUNT_EDIT_FORM_VALIDATION_SUCCESS,
  pageName
});

const accountEditFormValidationFailure = pageName => ({
  type: ACCOUNT_EDIT_FORM_VALIDATION_FAILURE,
  pageName
});

const cleanForm = pageName => ({
  type: CLEAN_FORM,
  pageName
});

const inputChange = (pageName, inputName, inputValue) => ({
  type: INPUT_CHANGED,
  pageName,
  inputName,
  inputValue
});

const toggleVisibility = (pageName, inputName, shown) => ({
  type: TOGGLE_VISIBILITY,
  pageName,
  inputName,
  shown,
});

export {
  inputChange,
  inputValidateSuccess,
  inputValidateFailure,
  validateForm,
  formValidationSuccess,
  formValidationFailure,
  cleanForm,
  toggleVisibility,
  accountEditFormValidate,
  accountEditFormValidationFailure,
  accountEditFormValidationSuccess
};
