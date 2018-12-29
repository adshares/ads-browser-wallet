import { ofType } from 'redux-observable';
import { of, from } from 'rxjs';
import { mergeMap, withLatestFrom } from 'rxjs/operators';
import {
  globalPassInputValidateFailed,
  GLOBAL_PASS_INPUT_VALIDATE, globalPassInputValidateSuccess, toggleGlobalAuthorisationDialog,
} from '../actions/actions';
import * as validators from '../utils/validators';

export default (action$, state$) =>
    action$.pipe(
        ofType(GLOBAL_PASS_INPUT_VALIDATE),
        withLatestFrom(state$),
        mergeMap(([action, state]) => {
          const { vault, authDialog } = state;

          const errorMsg = validators.password({ value: authDialog.password.value, vault });
          const isInputValid = errorMsg === null;

          return isInputValid ? from([
            globalPassInputValidateSuccess(),
            toggleGlobalAuthorisationDialog(false),
          ]) : of(globalPassInputValidateFailed(errorMsg));
        }),
);
