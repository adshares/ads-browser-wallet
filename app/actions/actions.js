export const TOGGLE_AUTHORISATION_DIALOG_GLOBAL = 'TOGGLE_AUTHORISATION_DIALOG_GLOBAL';
export const GLOBAL_PASS_INPUT_CHANGED = 'GLOBAL_PASS_INPUT_CHANGED';
export const GLOBAL_PASS_INPUT_VALIDATION_SUCCESS = 'GLOBAL_PASS_INPUT_VALIDATION_SUCCESS';
export const GLOBAL_PASS_INPUT_VALIDATION_FAILED = 'GLOBAL_PASS_INPUT_VALIDATION_FAILED';

const handlePasswordChange = (inputValue) => ({
  type: GLOBAL_PASS_INPUT_CHANGED,
  inputValue
});

const passInputValidateSuccess = (valid) => ({
  type: GLOBAL_PASS_INPUT_CHANGED,
  valid
});

const passInputValidateFailed = (errorMsg) => ({
  type: GLOBAL_PASS_INPUT_CHANGED,
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
