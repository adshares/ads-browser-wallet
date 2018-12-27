import { ofType } from 'redux-observable';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import {
  passInputValidateFailed,
  passInputValidateSuccess,
    PASS_INPUT_VALIDATE,
} from '../actions/form';
import { toggleAuthorisationDialog } from '../actions/actions';
import * as validators from '../utils/validators';
import { validatePagesBranch } from './helpers';

export default (action$, store) =>
    action$.pipe(
        ofType(PASS_INPUT_VALIDATE),
        mergeMap((action) => {
          const { pageName } = action;
          const { vault, pages } = store.getState();
          validatePagesBranch(pages, pageName);

          const { auth } = pages[pageName];

          const errorMsg = validators.password({ value: auth.password.value, vault });
          const isInputValid = errorMsg === null;

          return isInputValid ? Observable.from([
            passInputValidateSuccess(pageName, true),
            toggleAuthorisationDialog(pageName, false),
          ]) : Observable.of(passInputValidateFailed(pageName, errorMsg));
        }),
);
