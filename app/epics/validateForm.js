import { ofType } from 'redux-observable';
import { mergeMap, withLatestFrom } from 'rxjs/operators';
import { of, from } from 'rxjs';

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

export default (action$, state$) =>
    action$.pipe(
        ofType(FORM_VALIDATE),
        withLatestFrom(state$),
        mergeMap(([action, state]) => {
          const { pageName } = action;
          const { vault, pages } = state;

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
                ? from([
                  ...actionsToDispatch,
                  toggleAuthorisationDialog(pageName, true),
                  formValidationSuccess(pageName)
                ])
                : from([
                  ...actionsToDispatch,
                  formValidationFailure(pageName)
                ]);
          }
          return of(formValidationFailure(pageName));
        }),
    );
