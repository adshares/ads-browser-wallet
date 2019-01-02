export const ADS_WALLET_INIT = 'ADS_WALLET_INIT';
export const PREVIEW_SECRET_DATA_INIT = 'PREVIEW_SECRET_DATA_INIT';
export const PREVIEW_SECRET_DATA = 'PREVIEW_SECRET_DATA';
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
export const RETRIEVE_NODES_DATA_IN_INTERVALS = 'RETRIEVE_NODES_DATA_IN_INTERVALS';
export const RETRIEVE_NODES_DATA_IN_INTERVALS_SUCCESS = 'RETRIEVE_NODES_DATA_IN_INTERVALS_SUCCESS';
export const RETRIEVE_NODES_DATA_IN_INTERVALS_FAILURE = 'RETRIEVE_NODES_DATA_IN_INTERVALS_FAILURE';
export const RETRIEVE_NODES_DATA_IN_INTERVALS_STOP = 'RETRIEVE_NODES_DATA_IN_INTERVALS_STOP';

export const adsWalletInit = () => ({
  type: ADS_WALLET_INIT,
});

export const previewSecretDataInit = (path) => ({
  type: PREVIEW_SECRET_DATA_INIT,
  path
});

export const previewSecretData = (path) => ({
  type: PREVIEW_SECRET_DATA,
  path
});

export const handleGlobalPassInputChange = inputValue => ({
  type: GLOBAL_PASS_INPUT_CHANGED,
  inputValue
});

export const globalPassInputValidate = () => ({
  type: GLOBAL_PASS_INPUT_VALIDATE,
});

export const globalPassInputValidateSuccess = () => ({
  type: GLOBAL_PASS_INPUT_VALIDATION_SUCCESS,
});

export const globalPassInputValidateFailed = errorMsg => ({
  type: GLOBAL_PASS_INPUT_VALIDATION_FAILED,
  errorMsg
});

export const toggleGlobalAuthorisationDialog = isOpen => ({
  type: TOGGLE_AUTHORISATION_DIALOG_GLOBAL,
  isOpen,
});

export const cleanGlobalAuthorisationDialog = () => ({
  type: CLEAN_AUTHORISATION_DIALOG_GLOBAL,
});

export const retrieveAccountDataInIntervals = initialAccount => ({
  type: RETRIEVE_ACCOUNT_DATA_IN_INTERVALS,
  initialAccount,
});

export const retrieveAccountDataInIntervalsSuccess = account => ({
  type: RETRIEVE_ACCOUNT_DATA_IN_INTERVALS_SUCCESS,
  account,
});

export const retrieveAccountDataInIntervalsFailure = error => ({
  type: RETRIEVE_ACCOUNT_DATA_IN_INTERVALS_FAILURE,
  error,
});

export const retrieveAccountDataInIntervalsStop = () => ({
  type: RETRIEVE_ACCOUNT_DATA_IN_INTERVALS_STOP,
});

export const retrieveNodesDataInIntervals = () => ({
  type: RETRIEVE_NODES_DATA_IN_INTERVALS,
});

export const retrieveNodesDataInIntervalsSuccess = nodes => ({
  type: RETRIEVE_NODES_DATA_IN_INTERVALS_SUCCESS,
  nodes,
});

export const retrieveNodesDataInIntervalsFailure = error => ({
  type: RETRIEVE_NODES_DATA_IN_INTERVALS_FAILURE,
  error,
});

export const retrieveNodesDataInIntervalsStop = () => ({
  type: RETRIEVE_NODES_DATA_IN_INTERVALS_STOP,
});
