export const TOGGLE_AUTHORISATION_DIALOG_GLOBAL = 'TOGGLE_AUTHORISATION_DIALOG_GLOBAL';
export const CLEAN_AUTHORISATION_DIALOG_GLOBAL = 'CLEAN_AUTHORISATION_DIALOG_GLOBAL';
export const GLOBAL_PASS_INPUT_CHANGED = 'GLOBAL_PASS_INPUT_CHANGED';
export const GLOBAL_PASS_INPUT_VALIDATE = 'GLOBAL_PASS_INPUT_VALIDATE';
export const GLOBAL_PASS_INPUT_VALIDATION_SUCCESS = 'GLOBAL_PASS_INPUT_VALIDATION_SUCCESS';
export const GLOBAL_PASS_INPUT_VALIDATION_FAILED = 'GLOBAL_PASS_INPUT_VALIDATION_FAILED';

export const handleGlobalPassInputChange = (inputValue) => ({
  type: GLOBAL_PASS_INPUT_CHANGED,
  inputValue
});

export const globalPassInputValidate = () => ({
  type: GLOBAL_PASS_INPUT_VALIDATE,
});

export const globalPassInputValidateSuccess = () => ({
  type: GLOBAL_PASS_INPUT_VALIDATION_SUCCESS,
});

export const globalPassInputValidateFailed = (errorMsg) => ({
  type: GLOBAL_PASS_INPUT_VALIDATION_FAILED,
  errorMsg
});

export const toggleGlobalAuthorisationDialog = (isOpen) => ({
  type: TOGGLE_AUTHORISATION_DIALOG_GLOBAL,
  isOpen,
});

export const cleanGlobalAuthorisationDialog = () => ({
  type: CLEAN_AUTHORISATION_DIALOG_GLOBAL,
});
