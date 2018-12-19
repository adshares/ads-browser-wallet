export const INPUT_CHANGED = 'INPUT_CHANGED';
export const PASS_INPUT_CHANGED = 'PASS_INPUT_CHANGED';
export const PASS_INPUT_VALIDATION_SUCCESS = 'PASS_INPUT_VALIDATION_SUCCESS';
export const PASS_INPUT_VALIDATION_FAILED = 'PASS_INPUT_VALIDATION_FAILED';
export const INPUT_VALIDATION_SUCCESS = 'INPUT_VALIDATION_SUCCESS';
export const INPUT_VALIDATION_FAILED = 'INPUT_VALIDATION_FAILED';
export const FORM_VALIDATION_SUCCESS = 'FORM_VALIDATION_SUCCESS';
export const FORM_VALIDATION_FAILED = 'FORM_VALIDATION_FAILED';
export const FORM_CLEANING = 'FORM_CLEANED';

const passInputValidateSuccess = (pageName, valid) => ({
  type: PASS_INPUT_VALIDATION_SUCCESS,
  valid
});

const passInputValidateFailed = (pageName, errorMsg) => ({
  type: PASS_INPUT_VALIDATION_FAILED,
  errorMsg
});

const inputValidateSuccess = (pageName, inputName) => ({
  type: INPUT_VALIDATION_SUCCESS,
  pageName,
  inputName,
});

const inputValidateFailed = (pageName, inputName, errorMsg) => ({
  type: INPUT_VALIDATION_FAILED,
  pageName,
  inputName,
  errorMsg
});

const formValidationSuccess = pageName => ({
  type: FORM_VALIDATION_SUCCESS,
  pageName
});

const formValidationFailed = pageName => ({
  type: FORM_VALIDATION_FAILED,
  pageName
});

const formClean = pageName => ({
  type: FORM_CLEANING,
  pageName
});

const handleInputChange = (pageName, inputName, inputValue) => ({
  type: INPUT_CHANGED,
  pageName,
  inputName,
  inputValue
});

const handlePasswordChange = (pageName, inputValue) => ({
  type: PASS_INPUT_CHANGED,
  pageName,
  inputValue
});

export {
  handleInputChange,
  handlePasswordChange,
  inputValidateSuccess,
  inputValidateFailed,
  passInputValidateFailed,
  passInputValidateSuccess,
  formValidationSuccess,
  formValidationFailed,
  formClean,
};
