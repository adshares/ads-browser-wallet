import {
  inputValidateSuccess,
  inputValidateFailed,
  formValidationSuccess,
  formValidationFailed
} from '../actions/form';
import { toggleAuthorisationDialog } from '../actions/actions';

import * as validators from '../utils/validators';

export default function (pageName) {
  return (dispatch, getState) => {
    const { vault, pages } = getState();
    if (!pages[pageName]) {
      throw new Error(`Page ${pageName} does not exist in store!`);
    }
    const { inputs, isSubmitted, authConfirmed } = pages[pageName];
    if (inputs) {
      const { isFormValid, actionsToDispatch } = Object.entries(inputs).reduce(
        (acc, [inputName, inputProps]) => {
          const validator = validators[inputName];
          let errorMsg = null;
          if (!validator) {
            throw new Error(`No validator is defined for name ${inputName}`);
          }

          if (typeof inputProps.shown === 'undefined' || inputProps.shown === true) {
            errorMsg = validator({ value: inputProps.value, vault, inputs, pageName });
          }
          const isInputValid = errorMsg === null;
          const action = isInputValid
            ? dispatch(inputValidateSuccess(pageName, inputName))
            : dispatch(inputValidateFailed(pageName, inputName, errorMsg));
          return {
            isFormValid: acc.isFormValid === false ? false : isInputValid,
            actionsToDispatch: [...acc.actionsToDispatch, action]
          };
        },
        { isFormValid: true, actionsToDispatch: [] }
      );

      if (isFormValid) {
        actionsToDispatch.concat([
          dispatch(toggleAuthorisationDialog(pageName, true)),
          dispatch(formValidationSuccess(pageName)) // only for info purposes
        ]);
      } else {
        actionsToDispatch.push([dispatch(formValidationFailed(pageName))]); // to prevent from sendingg
      }

      return Promise.all(actionsToDispatch);
    }
    return Promise.resolve(dispatch(formValidationFailed(pageName)));
  };
}
