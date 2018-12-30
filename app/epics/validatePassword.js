import { ofType } from 'redux-observable';
import { of, from } from 'rxjs';
import { mergeMap, withLatestFrom } from 'rxjs/operators';
import {
  passInputValidateFailure,
  passInputValidateSuccess,
  toggleAuthorisationDialog,
    PASS_INPUT_VALIDATE,
} from '../actions/form';
import * as validators from '../utils/validators';
import { validatePagesBranch } from './helpers';

export default (action$, state$) =>
    action$.pipe(
        ofType(PASS_INPUT_VALIDATE),
        withLatestFrom(state$),
        mergeMap(([action, state]) => {
          const { pageName } = action;
          const { vault, pages } = state;
          validatePagesBranch(pages, pageName);
          const { auth } = pages[pageName];
          const errorMsg = validators.password({ value: auth.password.value, vault });
          const isInputValid = errorMsg === null;

          return isInputValid ? from([
            passInputValidateSuccess(pageName, true),
            toggleAuthorisationDialog(pageName, false),
          ]) : of(passInputValidateFailure(pageName, errorMsg));
        }),
);
