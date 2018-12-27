export const INPUT_CHANGED = 'INPUT_CHANGED';
export const INPUT_VALIDATION_SUCCESS = 'INPUT_VALIDATION_SUCCESS';
export const INPUT_VALIDATION_FAILURE = 'INPUT_VALIDATION_FAILURE';
export const FORM_VALIDATION_SUCCESS = 'FORM_VALIDATION_SUCCESS';
export const FORM_VALIDATION_FAILURE = 'FORM_VALIDATION_FAILURE';
export const CLEAN_FORM = 'CLEAN_FORM';
export const SIGN_TRANSACTION = 'SIGN_TRANSACTION';
export const TRANSACTION_ACCEPTED = 'TRANSACTION_ACCEPTED';
export const TRANSACTION_REJECTED = 'TRANSACTION_REJECTED';
export const SEND_TRANSACTION = 'SEND_TRANSACTION';
export const TRANSACTION_SUCCESS = 'TRANSACTION_SUCCESS';
export const TRANSACTION_FAILURE = 'TRANSACTION_FAILURE';

export const inputChanged = (pageName, inputName, inputValue) => ({
  type: INPUT_CHANGED,
  pageName,
  inputName,
  inputValue
});

export const inputValidateSuccess = (pageName, inputName) => ({
  type: INPUT_VALIDATION_SUCCESS,
  pageName,
  inputName,
});

export const inputValidateFailure = (pageName, inputName, errorMsg) => ({
  type: INPUT_VALIDATION_FAILURE,
  pageName,
  inputName,
  errorMsg
});

export const formValidationSuccess = pageName => ({
  type: FORM_VALIDATION_SUCCESS,
  pageName
});

export const formValidationFailure = pageName => ({
  type: FORM_VALIDATION_FAILURE,
  pageName
});

export const cleanForm = pageName => ({
  type: CLEAN_FORM,
  pageName
});

export const signTransaction = pageName => ({
  type: SIGN_TRANSACTION,
  pageName
});
