export const TOGGLE_AUTHORISATION_DIALOG_GLOBAL = 'TOGGLE_AUTHORISATION_DIALOG_GLOBAL';
export const CLEAN_AUTHORISATION_DIALOG_GLOBAL = 'CLEAN_AUTHORISATION_DIALOG_GLOBAL';
export const GLOBAL_PASS_INPUT_CHANGED = 'GLOBAL_PASS_INPUT_CHANGED';
export const GLOBAL_PASS_INPUT_VALIDATE = 'GLOBAL_PASS_INPUT_VALIDATE';
export const GLOBAL_PASS_INPUT_VALIDATION_SUCCESS = 'GLOBAL_PASS_INPUT_VALIDATION_SUCCESS';
export const GLOBAL_PASS_INPUT_VALIDATION_FAILED = 'GLOBAL_PASS_INPUT_VALIDATION_FAILED';
export const RETRIEVE_ACCOUNT_DATA_IN_INTERVALS = 'RETRIEVE_ACCOUNT_DATA_IN_INTERVALS';
export const RETRIEVE_ACCOUNT_DATA_IN_INTERVALS_SUCCESS = 'RETRIEVE_ACCOUNT_DATA_IN_INTERVALS_SUCCESS';
export const RETRIEVE_ACCOUNT_DATA_IN_INTERVALS_FAILURE = 'RETRIEVE_ACCOUNT_DATA_IN_INTERVALS_FAILURE';
export const RETRIEVE_ACCOUNT_DATA_IN_INTERVALS_STOP = 'RETRIEVE_ACCOUNT_DATA_IN_INTERVALS_STOP';

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

export const retrieveAccountDataInIntervals = (initialAccount) => ({
  type: RETRIEVE_ACCOUNT_DATA_IN_INTERVALS,
  initialAccount,
});

export const retrieveAccountDataInIntervalsSuccess = (account) => ({
  type: RETRIEVE_ACCOUNT_DATA_IN_INTERVALS_SUCCESS,
  account,
});

export const retrieveAccountDataInIntervalsFailure = (error) => ({
  type: RETRIEVE_ACCOUNT_DATA_IN_INTERVALS_FAILURE,
  error,
});

export const retrieveAccountDataInIntervalsStop = () => ({
  type: RETRIEVE_ACCOUNT_DATA_IN_INTERVALS_STOP,
});
