import { from, of } from 'rxjs';
import { ofType } from 'redux-observable';
import { mergeMap, switchMap, take } from 'rxjs/operators';
import BgClient from '../../app/utils/background';
import { password } from '../utils/validators';
import * as settingsActions from '../actions/settingsActions';
import {
  formClean,
  FORM_VALIDATION_SUCCESS
} from '../actions/form';

export const changePasswordEpic = (action$, store) => action$.pipe(
  ofType(FORM_VALIDATION_SUCCESS),
  switchMap(action => action$.pipe(
    ofType(settingsActions.CHANGE_PASSWORD_INIT),
    take(1),
    mergeMap(() => {
      const { vault, pages: { SettingsPage } } = store.getState();
      const { inputs } = SettingsPage;
      const promise = new Promise((resolve) => {
        BgClient.startSession(window.btoa(inputs.newPassword.value), data =>
          resolve(data));
      }).then(data => password({ value: window.atob(data.secret), vault }) ?
        settingsActions.saveChangedPasswordFailure(action.pageName) :
        settingsActions.saveChangedPasswordSuccess(action.pageName));
      return from(promise);
    }),
    ),
  )
);

export const cleanSettings = action$ => action$.pipe(
  ofType(settingsActions.SAVE_CHANGED_PASSWORD_FAILURE, settingsActions.SAVE_CHANGED_PASSWORD_SUCCESS),
  mergeMap(action => of(formClean(action.pageName)))
);
