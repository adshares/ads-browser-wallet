import { ofType } from 'redux-observable';
import { mergeMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import {
    inputValidateSuccess,
    inputValidateFailure,
    formValidationSuccess,
    formValidationFailure,
    toggleAuthorisationDialog,
    FORM_VALIDATE
} from '../actions/form';
import * as validators from '../utils/validators';
import { validatePagesBranch } from './helpers';

export default (action$, store) =>
    action$.pipe(
        ofType(FORM_VALIDATE),
        mergeMap((action) => {
          const { pageName } = action;
          const { vault, pages } = store.getState();

          validatePagesBranch(pages, pageName);

          const { inputs } = pages[pageName];

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
                  const actionToDispatch = isInputValid
                    ? inputValidateSuccess(pageName, inputName)
                    : inputValidateFailure(pageName, inputName, errorMsg);
                  return {
                    isFormValid: acc.isFormValid === false ? false : isInputValid,
                    actionsToDispatch: [...acc.actionsToDispatch, actionToDispatch]
                  };
                },
                { isFormValid: true, actionsToDispatch: [] }
              );

            return isFormValid
                ? Observable.from([
                  ...actionsToDispatch,
                  toggleAuthorisationDialog(pageName, true),
                  formValidationSuccess(pageName)
                ])
                : Observable.from([...actionsToDispatch, formValidationFailure(pageName)]);
          }
          return Observable.of(formValidationFailure(pageName));
        }),
    );
