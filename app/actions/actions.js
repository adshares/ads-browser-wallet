export const TOGGLE_AUTHORISATION_DIALOG_GLOBAL = 'TOGGLE_AUTHORISATION_DIALOG_GLOBAL';
export const PASS_INPUT_CHANGED = 'PASS_INPUT_CHANGED';
export const PASS_INPUT_VALIDATION_SUCCESS = 'PASS_INPUT_VALIDATION_SUCCESS';
export const PASS_INPUT_VALIDATION_FAILED = 'PASS_INPUT_VALIDATION_FAILED';

const handlePasswordChange = (pageName, inputValue) => ({
  type: PASS_INPUT_CHANGED,
  inputValue
});

const passInputValidateSuccess = (pageName, valid) => ({
  type: PASS_INPUT_VALIDATION_SUCCESS,
  valid
});

const passInputValidateFailed = (pageName, errorMsg) => ({
  type: PASS_INPUT_VALIDATION_FAILED,
  errorMsg
});

const toggleAuthorisationDialog = (isOpen) => ({
  type: TOGGLE_AUTHORISATION_DIALOG_GLOBAL,
  isOpen,
});

export {
  handlePasswordChange,
  passInputValidateSuccess,
  passInputValidateFailed,
  toggleAuthorisationDialog
};
